import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { PrestamosController } from './prestamos.controller';
import { PanelController } from './panel.controller';

@Module({
  controllers: [LibrosController, PrestamosController, PanelController],
})
export class AppModule {}