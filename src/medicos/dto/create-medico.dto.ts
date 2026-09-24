import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString
} from 'class-validator'

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string

  @IsInt()
  @IsPositive()
  especialidadId: number
}