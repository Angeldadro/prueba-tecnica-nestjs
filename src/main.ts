import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupHelmet } from './infrastructure/middleware/helmet.middleware';
import { setupRateLimit } from './infrastructure/middleware/rate-limit.middleware';
import { setupCompression } from './infrastructure/middleware/compression.middleware';
import { setupCors } from './infrastructure/middleware/cors.middleware';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await setupHelmet(app);
  await setupRateLimit(app);
  await setupCompression(app);
  await setupCors(app);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  const config = new DocumentBuilder()
    .setTitle('My Bun NestJS API')
    .setDescription('Descripción de la API creada con NestJS, Bun y Fastify')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
