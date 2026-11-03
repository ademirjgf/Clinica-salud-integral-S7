
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaService } from '../prisma/prisma.service.js'
import { Role } from '../../generated/prisma/client.js'
import type { ActualizarPerfilDto } from './dto/actualizar-perfil.dto.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async register(email: string, password: string, role: Role) {
    const passwordHash = await bcrypt.hash(password, 10)

    return this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: '8h' }
    )

    return {
      token,
      usuario: {
        id: user.id,
        email: user.email,
        rol: user.role,
        nombre: user.nombre,
        telefono: user.telefono,
        foto: user.foto
      }
    }
  }

  async actualizarPerfil(
    usuarioId: number,
    datos: ActualizarPerfilDto,
    foto?: string
  ) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: usuarioId }
    })

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const nombre = datos.nombre.trim()
    const email = datos.email.trim().toLowerCase()
    const telefono = datos.telefono?.trim() || null

    if (nombre.length < 3) {
      throw new BadRequestException(
        'El nombre debe tener al menos 3 caracteres'
      )
    }

    const existeEmail = await this.prisma.user.findUnique({
      where: { email }
    })

    if (existeEmail && existeEmail.id !== usuarioId) {
      throw new ConflictException(
        'El correo electrónico ya está registrado'
      )
    }

    const actualizado = await this.prisma.user.update({
      where: { id: usuarioId },
      data: {
        nombre,
        email,
        telefono,
        ...(foto ? { foto } : {})
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        foto: true,
        role: true
      }
    })

    return {
      usuario: {
        id: actualizado.id,
        nombre: actualizado.nombre,
        email: actualizado.email,
        telefono: actualizado.telefono,
        foto: actualizado.foto,
        rol: actualizado.role
      }
    }
  }
}
