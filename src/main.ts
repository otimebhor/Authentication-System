import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import * as dotenv from 'dotenv';
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  const port = process.env.PORT || 8080;

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      // exceptionFactory: (errors) => {
      //   const errorMessages = errors.map(
      //     (error) =>
      //       `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}`,
      //   );
      //   return new BadRequestException(errorMessages);
      // },
    }),
  );
  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
