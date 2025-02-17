import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { ZodFilter } from './infrastructure/common/filter/zod.filter'
import { ZodValidationPipe } from 'nestjs-zod'

async function bootstrap() {
   const app = await NestFactory.create(CoreModule)
   app.setGlobalPrefix('/api')
   app.useGlobalPipes(new ZodValidationPipe())
   app.useGlobalFilters(new ZodFilter())
   const config = app.get(ConfigService)
   if (!config) {
      throw new Error('Not found service')
   }

   const PORT = config.get<number>('APPLICATION_PORT')
   if (!PORT) throw new Error('Not initialized APPLICATION_PORT in environment')

   await app.listen(PORT).then(() => Logger.log(`Payment service was started`))
}

bootstrap()
