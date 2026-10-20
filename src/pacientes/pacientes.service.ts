
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

  // Obtener todos los pacientes
  findAll() {
    return this.prisma.paciente.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  // Obtener un paciente por ID
  findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { id }
    })
  }

  // Convertir y validar la fecha de nacimiento
  private validarFechaNacimiento(fecha: string | Date): Date {
    const fechaConvertida =
      typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)
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

  // Registrar un nuevo paciente
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

  // Actualizar un paciente existente
  update(id: number, data: Partial<PacienteData>) {
    const datosActualizados = {
      ...data,
      ...(data.fechaNacimiento !== undefined
        ? {
            fechaNacimiento: this.validarFechaNacimiento(
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

  // Eliminar un paciente
  remove(id: number) {
    return this.prisma.paciente.delete({
      where: { id }
    })
  }
}
