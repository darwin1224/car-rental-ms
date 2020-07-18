import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.use(morgan('combined'));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

  app.setGlobalPrefix('/v1/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  process.env.NODE_ENV !== 'production' &&
    SwaggerModule.setup(
      'api',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('Car Rental Management System')
          .setDescription('API documentation for car rental management system.')
          .setVersion('0.1.0')
          .setContact(
            'Darwin',
            'https://twitter.com/darwinblacks',
            'darwinblacks@gmail.com',
          )
          .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
          .addServer(
            app.get(ConfigService).get('APP_BASE_URL') ||
              'http://localhost:3000',
          )
          .addBearerAuth()
          .build(),
        { ignoreGlobalPrefix: true },
      ),
    );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
