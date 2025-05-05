import { NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';

export async function setupCors(app: NestFastifyApplication): Promise<void> {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
}
