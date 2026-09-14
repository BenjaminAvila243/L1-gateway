import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';

@Controller('v1/prestamos')
export class PrestamosController {
  @Get()
  async listar(@Headers('authorization') authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('falta el header Authorization');
    }
    const respuesta = await fetch('http://localhost:3002/prestamos');
    return respuesta.json();
  }
}