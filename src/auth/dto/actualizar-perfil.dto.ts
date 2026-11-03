import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator'

export class ActualizarPerfilDto {
  @IsString()
  @MinLength(3)
  nombre!: string

  @IsEmail()
  email!: string

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8,15}$/, {
    message: 'El teléfono debe tener entre 8 y 15 dígitos'
  })
  telefono?: string
}