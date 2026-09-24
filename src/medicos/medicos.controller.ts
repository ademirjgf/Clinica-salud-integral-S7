import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'

import { MedicosService } from './medicos.service.js'
import { CreateMedicoDto } from './dto/create-medico.dto.js'
import { UpdateMedicoDto } from './dto/update-medico.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'

@Controller('medicos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
export class MedicosController {
  constructor(
    private readonly medicosService: MedicosService
  ) {}

  @Get()
  findAll() {
    return this.medicosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const medico = await this.medicosService.findOne(Number(id))

    if (!medico) {
      throw new NotFoundException('Médico no encontrado')
    }

    return medico
  }

  @Post()
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicoDto
  ) {
    return this.medicosService.update(Number(id), dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(Number(id))
  }
}