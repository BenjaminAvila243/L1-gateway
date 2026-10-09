 import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';

const PRESTAMOS_URL = process.env.PRESTAMOS_URL ?? 'http://localhost:3002';

@Controller('v1/prestamos')
export class PrestamosController {
  @Get()
  async listar(@Headers('authorization') authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('falta el header Authorization');
    }
    const respuesta = await fetch(`${PRESTAMOS_URL}/prestamos`);
    return respuesta.json();
  }
}