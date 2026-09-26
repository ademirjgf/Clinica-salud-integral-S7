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
}