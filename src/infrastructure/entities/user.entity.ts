import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TransactionEntity } from './transaction.entity'

@Entity('user')
export class UserEntity {
   @PrimaryGeneratedColumn()
   id!: number

   @Column({
      name: 'balance',
      nullable: false,
      default: 0,
      type: 'int'
   })
   balance!: number

   @OneToMany(() => TransactionEntity, transaction => transaction.user)
   transactions!: TransactionEntity[]

   constructor(balance: number) {
      this.balance = balance
   }
}
