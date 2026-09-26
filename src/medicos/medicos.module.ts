import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module.js'
import { MedicosController } from './medicos.controller.js'
import { MedicosService } from './medicos.service.js'

@Module({
  imports: [AuthModule],
  controllers: [MedicosController],
  providers: [MedicosService]
})
export class MedicosModule {}