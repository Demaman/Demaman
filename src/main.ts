import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './Interceptor/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties not defined in DTO
      forbidNonWhitelisted: true, // Throws error if non-DTO properties are present
      validationError: { target: false }, // Returns object instead of full DTO on error
      transform: true, // Transforms input data to match DTO structure
      transformOptions: {
        enableImplicitConversion: true, // Allows auto-conversion of string -> number etc.
      },
    }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
  
  await app.listen(8080);
}
bootstrap();
