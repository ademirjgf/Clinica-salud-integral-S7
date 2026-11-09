
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'

import { CitasService } from './citas.service.js'
import { CreateCitaDto } from './dto/create-cita.dto.js'
import { UpdateEstadoCitaDto } from './dto/update-estado-cita.dto.js'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'

import { EstadoCita } from '../../generated/prisma/client.js'

@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA', 'GERENCIA')
export class CitasController {
  constructor(
    private readonly citasService: CitasService
  ) {}

  @ApiOperation({
    summary: 'Agenda una nueva cita'
  })
  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto)
  }

  @ApiOperation({
    summary: 'Lista todas las citas'
  })
  @Get()
  findAll() {
    return this.citasService.findAll()
  }

  @ApiOperation({
    summary: 'Historial de citas con paginación y filtro por estado'
  })
  @Get('historial')
  findHistorial(
    @Query('pagina') paginaQuery?: string,
    @Query('estado') estadoQuery?: string
  ) {
    const pagina = paginaQuery === undefined
      ? 1
      : Number(paginaQuery)

    if (
      !Number.isSafeInteger(pagina) ||
      pagina < 1
    ) {
      throw new BadRequestException(
        'La página debe ser un número entero mayor que cero'
      )
    }

    const estados: Record<string, EstadoCita | undefined> = {
      Todos: undefined,
      Programada: EstadoCita.PROGRAMADA,
      Completada: EstadoCita.COMPLETADA,
      Cancelada: EstadoCita.CANCELADA
    }

    const estadoSolicitado = estadoQuery ?? 'Todos'

    if (
      !Object.prototype.hasOwnProperty.call(
        estados,
        estadoSolicitado
      )
    ) {
      throw new BadRequestException(
        'Estado de cita no válido'
      )
    }

    return this.citasService.findHistorial(
      pagina,
      estados[estadoSolicitado]
    )
  }

  @ApiOperation({
    summary: 'Actualiza el estado de una cita'
  })
  @Put(':id')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoCitaDto
  ) {
    return this.citasService.updateEstado(
      id,
      dto.estado
    )
  }
}
