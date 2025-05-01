import { NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';

export async function setupHelmet(app: NestFastifyApplication) {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https:'],
        scriptSrc: ["'self'"],
      },
    },
  });
}
