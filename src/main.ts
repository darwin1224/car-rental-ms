import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 50,
    }),
  );
  await app.listen(3000);
}
bootstrap();
