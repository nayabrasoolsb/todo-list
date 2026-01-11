import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT);
  logger.log(`Application running on port ${PORT}`);

}
bootstrap();
