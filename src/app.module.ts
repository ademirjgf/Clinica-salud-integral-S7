import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PrismaModule } from './prisma/prisma.module.js'
import { PacientesModule } from './pacientes/pacientes.module.js';
import { MedicosModule } from './medicos/medicos.module.js';

@Module({
  imports: [PrismaModule, PacientesModule, MedicosModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}