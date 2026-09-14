 import {
  Controller, ForbiddenException, Get, Headers, HttpException, Post, Delete, Body, Param,
  ServiceUnavailableException, UnauthorizedException,
} from '@nestjs/common';
import { verificar, tieneScope } from './auth/verificador';

const BFF_URL = process.env.BFF_URL!;

@Controller('v1/panel')
export class PanelController {
  private async haciaElBff(ruta: string, authorization?: string): Promise<unknown> {
    let claims;
    try {
      claims = await verificar(authorization);
    } catch (e) {
      throw new UnauthorizedException((e as Error).message);
    }

    if (!tieneScope(claims, 'biblioteca/libros.leer')) {
      throw new ForbiddenException('te falta el permiso biblioteca/libros.leer');
    }

    let respuesta: Response;
    try {
      respuesta = await fetch(`${BFF_URL}${ruta}`, {
        headers: { authorization: authorization! },
      });
    } catch {
      throw new ServiceUnavailableException('el BFF no responde');
    }

    const cuerpo: unknown = await respuesta.json();
    if (!respuesta.ok) {
      throw new HttpException(cuerpo as Record<string, unknown>, respuesta.status);
    }
    return cuerpo;
  }

  @Get()
  async panel(@Headers('authorization') authorization?: string) {
    return this.haciaElBff('/panel', authorization);
  }

  @Get('todos')
  async todos(@Headers('authorization') authorization?: string) {
    return this.haciaElBff('/panel/todos', authorization);
  }

  @Post('prestamos')
  async prestar(
    @Headers('authorization') authorization?: string,
    @Body() cuerpo?: unknown,
  ) {
    let claims;
    try {
      claims = await verificar(authorization);
    } catch (e) {
      throw new UnauthorizedException((e as Error).message);
    }
    if (!tieneScope(claims, 'biblioteca/libros.leer')) {
      throw new ForbiddenException('te falta el permiso biblioteca/libros.leer');
    }
    let respuesta: Response;
    try {
      respuesta = await fetch(`${BFF_URL}/panel/prestamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: authorization! },
        body: JSON.stringify(cuerpo),
      });
    } catch {
      throw new ServiceUnavailableException('el BFF no responde');
    }
    const cuerpoResp: unknown = await respuesta.json();
    if (!respuesta.ok) {
      throw new HttpException(cuerpoResp as Record<string, unknown>, respuesta.status);
    }
    return cuerpoResp;
  }

  @Delete('prestamos/:id')
  async devolver(
    @Headers('authorization') authorization?: string,
    @Param('id') id?: string,
  ) {
    let claims;
    try {
      claims = await verificar(authorization);
    } catch (e) {
      throw new UnauthorizedException((e as Error).message);
    }
    if (!tieneScope(claims, 'biblioteca/libros.leer')) {
      throw new ForbiddenException('te falta el permiso biblioteca/libros.leer');
    }
    let respuesta: Response;
    try {
      respuesta = await fetch(`${BFF_URL}/panel/prestamos/${id}`, {
        method: 'DELETE',
        headers: { authorization: authorization! },
      });
    } catch {
      throw new ServiceUnavailableException('el BFF no responde');
    }
    const cuerpoResp: unknown = await respuesta.json();
    if (!respuesta.ok) {
      throw new HttpException(cuerpoResp as Record<string, unknown>, respuesta.status);
    }
    return cuerpoResp;
  }
}