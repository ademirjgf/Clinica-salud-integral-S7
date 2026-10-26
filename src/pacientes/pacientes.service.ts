
import {
  BadRequestException,
  Injectable
} from '@nestjs/common'

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

  async findAll(
    query?: string,
    paginaTexto?: string,
    limiteTexto?: string
  ) {
    const pagina = paginaTexto === undefined
      ? 1
      : Number(paginaTexto)

    const limite = limiteTexto === undefined
      ? 100
      : Number(limiteTexto)

    if (
      !Number.isInteger(pagina) ||
      pagina < 1 ||
      !Number.isInteger(limite) ||
      limite < 1 ||
      limite > 100
    ) {
      throw new BadRequestException(
        'La página y el límite deben ser válidos (límite máximo: 100)'
      )
    }

    const busqueda = query?.trim() ?? ''

    const where = busqueda
      ? {
          OR: [
            {
              nombre: {
                contains: busqueda,
                mode: 'insensitive' as const
              }
            },
            {
              apellido: {
                contains: busqueda,
                mode: 'insensitive' as const
              }
            },
            {
              email: {
                contains: busqueda,
                mode: 'insensitive' as const
              }
            }
          ]
        }
      : {}

    const [data, total] = await this.prisma.$transaction([
      this.prisma.paciente.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (pagina - 1) * limite,
        take: limite
      }),
      this.prisma.paciente.count({ where })
    ])

    return {
      data,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    }
  }

  findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { id }
    })
  }

  private validarFechaNacimiento(
    fecha: string | Date
  ): Date {
    const fechaConvertida =
      typeof fecha === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ? new Date(`${fecha}T00:00:00.000Z`)
        : new Date(fecha)

    if (Number.isNaN(fechaConvertida.getTime())) {
      throw new BadRequestException(
        'La fecha de nacimiento no es válida'
      )
    }

    if (
      typeof fecha === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
      fechaConvertida.toISOString().slice(0, 10) !== fecha
    ) {
      throw new BadRequestException(
        'La fecha de nacimiento no es válida'
      )
    }

    if (fechaConvertida > new Date()) {
      throw new BadRequestException(
        'La fecha de nacimiento no puede ser futura'
      )
    }

    return fechaConvertida
  }

  create(data: PacienteData) {
    const fechaNacimiento = this.validarFechaNacimiento(
      data.fechaNacimiento
    )

    return this.prisma.paciente.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        fechaNacimiento
      }
    })
  }

  update(
    id: number,
    data: Partial<PacienteData>
  ) {
    const datosActualizados = {
      ...data,
      ...(data.fechaNacimiento !== undefined
        ? {
            fechaNacimiento:
              this.validarFechaNacimiento(
                data.fechaNacimiento
              )
          }
        : {})
    }

    return this.prisma.paciente.update({
      where: { id },
      data: datosActualizados
    })
  }

  remove(id: number) {
    return this.prisma.paciente.delete({
      where: { id }
    })
  }
}
