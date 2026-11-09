
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Request } from 'express'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto.js'
import { Role } from '../../generated/prisma/client.js'

interface UsuarioJwt {
  id: number
  email: string
  role: Role
}

type RequestAutenticada = Request & {
  user: UsuarioJwt
}

const MAX_FOTO_BYTES = 5 * 1024 * 1024

const EXTENSIONES_PERMITIDAS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
register(
  @Body()
  body: {
    email: string
    password: string
    role: Role
  }
) {
  if (process.env.NODE_ENV === 'production') {
    throw new ForbiddenException(
      'El registro público está deshabilitado'
    )
  }

  return this.authService.register(
    body.email,
    body.password,
    body.role
  )
}

  @Post('login')
  login(
    @Body()
    body: {
      email: string
      password: string
    }
  ) {
    return this.authService.login(body.email, body.password)
  }

  @Put('perfil')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FOTO_BYTES
      },
      fileFilter: (_req, file, callback) => {
        if (!EXTENSIONES_PERMITIDAS[file.mimetype]) {
          callback(
            new BadRequestException(
              'Formato no permitido. Usa JPG, PNG, WEBP o GIF'
            ),
            false
          )
          return
        }

        callback(null, true)
      }
    })
  )
  async actualizarPerfil(
    @Req() request: RequestAutenticada,
    @Body() datos: ActualizarPerfilDto,
    @UploadedFile() archivo?: Express.Multer.File
  ) {
    let rutaArchivo: string | undefined
    let fotoUrl: string | undefined

    if (archivo) {
      const extension = EXTENSIONES_PERMITIDAS[archivo.mimetype]

      if (!extension || archivo.size > MAX_FOTO_BYTES) {
        throw new BadRequestException('Fotografía no válida')
      }

      const nombreArchivo = `${randomUUID()}${extension}`
      const directorio = join(process.cwd(), 'uploads', 'perfiles')

      await mkdir(directorio, { recursive: true })

      rutaArchivo = join(directorio, nombreArchivo)
      await writeFile(rutaArchivo, archivo.buffer)

      fotoUrl = `/uploads/perfiles/${nombreArchivo}`
    }

    try {
      return await this.authService.actualizarPerfil(
        request.user.id,
        datos,
        fotoUrl
      )
    } catch (error: unknown) {
      if (rutaArchivo) {
        await unlink(rutaArchivo).catch(() => undefined)
      }

      throw error
    }
  }
}
