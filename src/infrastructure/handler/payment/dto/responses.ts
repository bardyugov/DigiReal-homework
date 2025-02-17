export class CreatePaymentRes {
   constructor(
      readonly transactionId: number,
      readonly currentBalance: number
   ) {}
}
