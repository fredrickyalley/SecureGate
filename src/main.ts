import { NestFactory } from '@nestjs/core';
import { SecureGateModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SecureGateModule);

  // Swagger Setup
  const options = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API endpoints for authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(9080);
}
bootstrap();
