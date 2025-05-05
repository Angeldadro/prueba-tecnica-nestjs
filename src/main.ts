import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupHelmet } from '@/src/middleware/helmet.middleware';
import { setupRateLimit } from '@/src/middleware/rate-limit.middleware';
import { setupCompression } from '@/src/middleware/compression.middleware';
import { setupCors } from '@/src/middleware/cors.middleware';
import { LoggingInterceptor } from '@/src/interceptors/logging.interceptor';
import { ItemExceptionsFilter } from '@items/infraestructure/filters/item-exceptions.filter';
import { OrderExceptionsFilter } from '@orders/infraestructure/filters/order-exceptions.filter';
import { DefaultExceptionsFilter } from '@/src/default-exceptions-errors';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await setupHelmet(app);
  await setupRateLimit(app);
  await setupCompression(app);
  await setupCors(app);
  app.useGlobalFilters(new ItemExceptionsFilter(), new OrderExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new DefaultExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle('My Bun NestJS API')
    .setDescription('Descripción de la API creada con NestJS, Bun y Fastify')
    .setVersion('1.0')
    .addBearerAuth()
    
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
