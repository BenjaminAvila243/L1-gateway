import 'dotenv/config';
console.log(process.env.COGNITO_ISSUER);


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:4200' });
  await app.listen(8080);
  console.log('gateway escuchando en http://localhost:8080');
}
bootstrap();