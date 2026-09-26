import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import jwt from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean {
    const request = context.switchToHttp().getRequest()
    const header = request.headers.authorization

    if (
      !header ||
      !header.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Token no proporcionado'
      )
    }

    try {
      request.user = jwt.verify(
        header.split(' ')[1],
        this.configService.getOrThrow<string>(
          'JWT_SECRET'
        )
      )

      return true
    } catch {
      throw new UnauthorizedException(
        'Token inválido o expirado'
      )
    }
  }
}