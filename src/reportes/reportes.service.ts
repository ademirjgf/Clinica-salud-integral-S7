
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

export interface ReporteEspecialidad {
  especialidad: string
  total: number
}

@Injectable()
export class ReportesService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async obtenerCitasPorEspecialidad(): Promise<
    ReporteEspecialidad[]
  > {
    const especialidades =
      await this.prisma.especialidad.findMany({
        select: {
          nombre: true,
          medicos: {
            select: {
              _count: {
                select: {
                  citas: true
                }
              }
            }
          }
        },
        orderBy: {
          nombre: 'asc'
        }
      })

    return especialidades.map((especialidad) => ({
      especialidad: especialidad.nombre,
      total: especialidad.medicos.reduce(
        (acumulado, medico) =>
          acumulado + medico._count.citas,
        0
      )
    }))
  }
}
