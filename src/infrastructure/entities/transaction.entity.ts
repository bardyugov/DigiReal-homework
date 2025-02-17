import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn
} from 'typeorm'
import { UserEntity } from './user.entity'

enum TransactionAction {
   Withdrawal = 'withdrawal',
   Replenishment = 'replenishment'
}

@Entity('transaction')
class TransactionEntity {
   @PrimaryGeneratedColumn()
   id: number

   @ManyToOne(() => UserEntity, user => user.transactions, {
      nullable: false
   })
   @JoinColumn({
      name: 'user_id',
      referencedColumnName: 'id'
   })
   user!: UserEntity

   @Column({
      name: 'action',
      nullable: false,
      type: 'enum',
      enum: TransactionAction
   })
   action!: TransactionAction

   @Column({
      name: 'time',
      nullable: false,
      type: 'time with time zone',
      default: () => 'CURRENT_TIMESTAMP'
   })
   time!: Date

   @Column({
      name: 'amount',
      nullable: false,
      type: 'int'
   })
   amount!: number

   constructor(user: UserEntity, action: TransactionAction, amount: number) {
      this.user = user
      this.action = action
      this.amount = amount
   }
}

export { TransactionEntity, TransactionAction }
