import {
   BadRequestException,
   Body,
   Controller,
   NotFoundException,
   Post
} from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CreatePaymentReq, CreatePaymentRes } from './dto'
import { UserEntity } from '../../entities/user.entity'
import {
   TransactionAction,
   TransactionEntity
} from '../../entities/transaction.entity'

@Controller('/payment')
export class PaymentHandler {
   constructor(private readonly dataSource: DataSource) {}

   @Post('/buy')
   async buy(@Body() dto: CreatePaymentReq) {
      return this.dataSource.transaction(async tx => {
         const user = await tx
            .createQueryBuilder(UserEntity, 'user')
            .select()
            .where('user.id = :id', { id: dto.userId })
            .setLock('pessimistic_write')
            .getOne()

         if (!user) {
            throw new NotFoundException(`User with id ${dto.userId} not found`)
         }

         if (user.balance < dto.amount) {
            throw new BadRequestException('Not enough balance')
         }

         const transaction = await tx
            .getRepository(TransactionEntity)
            .save(
               new TransactionEntity(
                  user,
                  TransactionAction.Withdrawal,
                  dto.amount
               )
            )

         const query = await tx
            .createQueryBuilder(TransactionEntity, 'tx')
            .select([
               'SUM(CASE WHEN tx.action = :withdrawal THEN tx.amount ELSE 0 END) AS withdraws',
               'SUM(CASE WHEN tx.action = :replenishment THEN tx.amount ELSE 0 END) AS replenishments'
            ])
            .where('tx.user_id = :id', { id: user.id })
            .setParameters({
               withdrawal: TransactionAction.Withdrawal,
               replenishment: TransactionAction.Replenishment
            })
            .getRawOne<{ withdraws: string; replenishments: string }>()

         if (!query) {
            return
         }

         const updatedBalance = Math.abs(
            parseInt(query.withdraws) - parseInt(query.replenishments)
         )

         await tx
            .createQueryBuilder(UserEntity, 'user')
            .update()
            .where('id = :id', { id: user.id })
            .set({
               balance: updatedBalance
            })
            .execute()

         return new CreatePaymentRes(transaction.id, updatedBalance)
      })
   }
}
