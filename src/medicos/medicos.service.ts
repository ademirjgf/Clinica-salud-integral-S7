import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

type MedicoData = {
  nombre: string
  apellido: string
  especialidadId: number
}

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.medico.findMany({
      include: {
        especialidad: true
      },
      orderBy: {
        id: 'asc'
      }
    })
  }

  findOne(id: number) {
    return this.prisma.medico.findUnique({
      where: { id },
      include: {
        especialidad: true
      }
    })
  }

  create(data: MedicoData) {
    return this.prisma.medico.create({
      data
    })
  }

  update(id: number, data: Partial<MedicoData>) {
    return this.prisma.medico.update({
      where: { id },
      data
    })
  }

  remove(id: number) {
    return this.prisma.medico.delete({
      where: { id }
    })
  }
}