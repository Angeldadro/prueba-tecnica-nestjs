import { NestFastifyApplication } from '@nestjs/platform-fastify';
import compress from '@fastify/compress';

export async function setupCompression(
  app: NestFastifyApplication,
): Promise<void> {
  await app.register(compress, { global: true });
}
