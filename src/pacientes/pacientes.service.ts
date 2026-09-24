import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'


type PacienteData = {
  nombre: string
  apellido: string
  email: string
  fechaNacimiento: string | Date
}

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.paciente.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { id }
    })
  }

  create(data: PacienteData) {
  if (new Date(data.fechaNacimiento) > new Date()) {
    throw new BadRequestException(
      'La fecha de nacimiento no puede ser futura'
    )
  }

  return this.prisma.paciente.create({
    data
  })
}

update(id: number, data: Partial<PacienteData>) {
  if (
    data.fechaNacimiento &&
    new Date(data.fechaNacimiento) > new Date()
  ) {
    throw new BadRequestException(
      'La fecha de nacimiento no puede ser futura'
    )
  }

  return this.prisma.paciente.update({
    where: { id },
    data
  })
}
  remove(id: number) {
    return this.prisma.paciente.delete({
      where: { id }
    })
  }
}