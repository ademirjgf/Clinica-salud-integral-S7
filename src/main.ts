
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger'
import { join } from 'node:path'

import { AppModule } from './app.module.js'
import { LoggingInterceptor } from './common/logging.interceptor.js'
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  
const configService = app.get(ConfigService)

const frontendUrl = configService.get<string>('FRONTEND_URL')

const origenesPermitidos = [
  'http://localhost:5173',
  ...(frontendUrl ? [frontendUrl] : [])
]

app.enableCors({
  origin: origenesPermitidos
})


  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/'
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  app.useGlobalFilters(
    new PrismaExceptionFilter()
  )

  app.useGlobalInterceptors(
    new LoggingInterceptor()
  )

  const config = new DocumentBuilder()
    .setTitle('Clínica Salud Integral')
    .setDescription('API de la clínica, migrada a NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(
    app,
    config
  )

  SwaggerModule.setup('api/docs', app, document)


  await app.listen(
    configService.getOrThrow<number>('PORT')
  )
}

await bootstrap()
