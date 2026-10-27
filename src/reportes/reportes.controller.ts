
import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'

import { ReportesService } from './reportes.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { Roles } from '../auth/decorators/roles.decorator.js'

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('GERENCIA')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService
  ) {}

  @ApiOperation({
    summary: 'Obtiene el total de citas por especialidad'
  })
  @Get('especialidades')
  obtenerCitasPorEspecialidad() {
    return this.reportesService.obtenerCitasPorEspecialidad()
  }
}
