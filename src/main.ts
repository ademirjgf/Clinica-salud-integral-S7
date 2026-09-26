import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger'

import { AppModule } from './app.module.js'
import { LoggingInterceptor } from './common/logging.interceptor.js'
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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
    .setDescription(
      'API de la clínica, migrada a NestJS'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(
    app,
    config
  )

  SwaggerModule.setup(
    'api/docs',
    app,
    document
  )

  const configService = app.get(ConfigService)

  await app.listen(
    configService.getOrThrow<number>('PORT')
  )
}

await bootstrap()