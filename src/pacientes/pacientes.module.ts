import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module.js'
import { PacientesController } from './pacientes.controller.js'
import { PacientesService } from './pacientes.service.js'

@Module({
  imports: [AuthModule],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService]
})
export class PacientesModule {}