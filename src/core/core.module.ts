import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as path from 'node:path'
import { PaymentModule } from '../infrastructure/handler/payment/payment.module'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: path.join(
            __dirname,
            `../../assets/.${process.env.NODE_ENV}.env`
         )
      }),
      PaymentModule
   ]
})
export class CoreModule {}
