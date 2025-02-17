import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentHandler } from './payment.handler'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from '../../entities/user.entity'
import { TransactionEntity } from '../../entities/transaction.entity'

@Module({
   imports: [
      TypeOrmModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            type: 'postgres',
            port: config.get<number>('DB_PORT'),
            host: config.get<string>('POSTGRES_HOST'),
            username: config.get<string>('POSTGRES_USER'),
            password: config.get<string>('POSTGRES_PASSWORD'),
            database: config.get<string>('POSTGRES_DB'),
            synchronize: false,
            entities: [UserEntity, TransactionEntity]
         })
      })
   ],
   controllers: [PaymentHandler]
})
export class PaymentModule {}
