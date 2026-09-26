import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module.js'
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  app.useGlobalFilters(new PrismaExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Clínica Salud Integral')
    .setDescription('API de la clínica, migrada a NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}

await bootstrap()