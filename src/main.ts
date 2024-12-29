import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  const host = '192.168.1.35'; // Cambia la IP aquí si es necesario
  await app.listen(3000, host);
}
bootstrap();
