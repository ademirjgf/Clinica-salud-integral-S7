import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common'
import { MedicosService } from './medicos.service.js'
import { CreateMedicoDto } from './dto/create-medico.dto.js'
import { UpdateMedicoDto } from './dto/update-medico.dto.js'

@Controller('medicos')
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
  update(@Param('id') id: string, @Body() dto: UpdateMedicoDto) {
  return this.medicosService.update(Number(id), dto)
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(Number(id))
  }
}