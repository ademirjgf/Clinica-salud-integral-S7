import { Injectable } from '@nestjs/common'
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
    return this.prisma.paciente.create({
      data
    })
  }

  update(id: number, data: Partial<PacienteData>) {
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