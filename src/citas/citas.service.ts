
import {
  Injectable,
  NotFoundException
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service.js'
import { PacientesService } from '../pacientes/pacientes.service.js'
import { EstadoCita } from '../../generated/prisma/client.js'

type CitaData = {
  pacienteId: number
  medicoId: number
  fechaHora: string | Date
  estado?: EstadoCita
}

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacientesService: PacientesService
  ) {}

  // Crear una nueva cita
  async create(data: CitaData) {
    const paciente = await this.pacientesService.findOne(
      data.pacienteId
    )

    if (!paciente) {
      throw new NotFoundException(
        'El paciente no existe'
      )
    }

    return this.prisma.cita.create({
      data
    })
  }

  // Listar todas las citas (endpoint existente)
  findAll() {
    return this.prisma.cita.findMany({
      include: {
        paciente: true
      },
      orderBy: {
        id: 'asc'
      }
    })
  }

  // Historial paginado: 10 registros por página
  async findHistorial(
    pagina: number,
    estado?: EstadoCita
  ) {
    const limite = 10
    const skip = (pagina - 1) * limite

    const where = estado
      ? { estado }
      : {}

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cita.findMany({
        where,
        include: {
          paciente: true
        },
        orderBy: [
          { fechaHora: 'desc' },
          { id: 'desc' }
        ],
        skip,
        take: limite
      }),

      this.prisma.cita.count({
        where
      })
    ])

    return {
      data,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    }
  }

  // Actualizar únicamente el estado de una cita
  async updateEstado(id: number, estado: EstadoCita) {
    const cita = await this.prisma.cita.findUnique({
      where: { id }
    })

    if (!cita) {
      throw new NotFoundException(
        'La cita no existe'
      )
    }

    return this.prisma.cita.update({
      where: { id },
      data: { estado },
      include: {
        paciente: true
      }
    })
  }
}
