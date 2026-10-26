
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
export class CitasController {
  constructor(
    private readonly citasService: CitasService
  ) {}

  // Crear cita
  @ApiOperation({
    summary: 'Agenda una nueva cita'
  })
  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto)
  }

  // Listar citas
  @ApiOperation({
    summary: 'Lista todas las citas'
  })
  @Get()
  findAll() {
    return this.citasService.findAll()
  }

  // Actualizar estado
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
