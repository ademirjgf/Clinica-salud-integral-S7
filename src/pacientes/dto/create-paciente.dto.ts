import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString
} from 'class-validator'

export class CreatePacienteDto {
  @ApiProperty({
    example: 'Ana',
    description: 'Nombre del paciente'
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del paciente'
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string

  @ApiProperty({
    example: 'ana@mail.com',
    description: 'Correo electrónico del paciente'
  })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del paciente'
  })
  @IsDateString({}, {
    message: 'La fecha de nacimiento debe ser válida'
  })
  fechaNacimiento: string
}