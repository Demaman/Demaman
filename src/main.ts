import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './Interceptor/http-exception.filter';
const logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672/smartranking'],
      queue: 'admin-backend'
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      validationError: { target: false },
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
  
  await app.listen();
  logger.log('Microservice is listening')
}
bootstrap();


