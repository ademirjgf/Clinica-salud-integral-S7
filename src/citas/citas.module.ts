import { Module } from '@nestjs/common'

import { PacientesModule } from '../pacientes/pacientes.module.js'
import { AuthModule } from '../auth/auth.module.js'
import { CitasController } from './citas.controller.js'
import { CitasService } from './citas.service.js'

@Module({
  imports: [
    PacientesModule,
    AuthModule
  ],
  controllers: [CitasController],
  providers: [CitasService]
})
export class CitasModule {}