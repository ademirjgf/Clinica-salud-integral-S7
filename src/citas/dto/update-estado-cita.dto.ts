
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { EstadoCita } from '../../../generated/prisma/client.js'

export class UpdateEstadoCitaDto {
  @ApiProperty({
    enum: EstadoCita,
    example: EstadoCita.COMPLETADA,
    description: 'Nuevo estado de la cita'
  })
  @IsEnum(EstadoCita)
  estado: EstadoCita
}
