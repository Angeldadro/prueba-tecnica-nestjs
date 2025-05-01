import { NestFastifyApplication } from '@nestjs/platform-fastify';
import rateLimit from '@fastify/rate-limit';

export async function setupRateLimit(
  app: NestFastifyApplication,
): Promise<void> {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}
