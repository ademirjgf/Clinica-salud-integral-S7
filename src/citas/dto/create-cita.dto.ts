import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive
} from 'class-validator'

import { EstadoCita } from '../../../generated/prisma/client.js'

export class CreateCitaDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente'
  })
  @IsInt()
  @IsPositive()
  pacienteId: number

  @ApiProperty({
    example: 1,
    description: 'ID del médico'
  })
  @IsInt()
  @IsPositive()
  medicoId: number

  @ApiProperty({
    example: '2026-10-01T15:30:00.000Z',
    description: 'Fecha y hora de la cita'
  })
  @IsDateString()
  fechaHora: string

  @ApiProperty({
    enum: EstadoCita,
    example: EstadoCita.PROGRAMADA,
    required: false,
    description: 'Estado de la cita'
  })
  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita
}
