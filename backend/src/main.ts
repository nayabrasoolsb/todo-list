import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN?.split(","),
    credentials: true,
  });

  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Shared Todo API')
    .setDescription('API for a shared todo list')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('todo/api', app, document);

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT);
  logger.log(`Application running on port ${PORT}`);

}
bootstrap();
