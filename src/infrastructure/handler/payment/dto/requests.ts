import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const createPaymentCred = z.object({
   userId: z.number().gt(0, 'userId must be > 0'),
   amount: z.number().gt(0, 'amount must be > 0')
})

class CreatePaymentReq extends createZodDto(createPaymentCred) {}

export { CreatePaymentReq }
