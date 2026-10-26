
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'

import { PacientesService } from './pacientes.service.js'
import { CreatePacienteDto } from './dto/create-paciente.dto.js'
import { UpdatePacienteDto } from './dto/update-paciente.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'

@ApiTags('Pacientes')
@ApiBearerAuth()
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService
  ) {}

  @ApiOperation({
    summary: 'Lista pacientes con búsqueda y paginación'
  })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    type: Number
  })
  @Get()
  findAll(
    @Query('query') query?: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string
  ) {
    return this.pacientesService.findAll(
      query,
      pagina,
      limite
    )
  }

  @ApiOperation({
    summary: 'Obtiene un paciente por ID'
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(
      Number(id)
    )

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado')
    }

    return paciente
  }

  @ApiOperation({
    summary: 'Crea un nuevo paciente'
  })
  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto)
  }

  @ApiOperation({
    summary: 'Actualiza un paciente existente'
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePacienteDto
  ) {
    return this.pacientesService.update(Number(id), dto)
  }

  @ApiOperation({
    summary: 'Elimina un paciente'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id))
  }
}
