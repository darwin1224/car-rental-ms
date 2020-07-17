import { AuthModule } from '@app/api/auth/auth.module';
import { User } from '@app/api/user/models/user.model';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { getConnection } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: Number(configService.get('DB_PORT')),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [User],
          }),
          inject: [ConfigService],
        }),
        AuthModule,
      ],
    }).compile();

    await getConnection().synchronize(true);
    await getConnection()
      .getRepository(User)
      .save(
        Object.assign(new User(), {
          name: 'Administrator',
          username: 'admin',
          password: '123456',
          role: 'admin',
        }),
      );

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/v1/api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  it('/v1/api/auth/login (POST) should throw bad request exception when request body is empty', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/v1/api/auth/login')
      .set('Content-Type', 'application/json')
      .send();

    expect(status).toEqual(400);
    expect(typeof body === 'object').toEqual(true);
    expect(Object.keys(body).sort()).toEqual(
      ['error', 'statusCode', 'message'].sort(),
    );
    expect(body.error).toEqual('Bad Request');
    expect(body.statusCode).toEqual(400);
    expect(Array.isArray(body.message)).toEqual(true);
    [
      'username must be longer than or equal to 4 characters',
      'username must be a string',
      'username should not be empty',
      'password must be longer than or equal to 4 characters',
      'password must be a string',
      'password should not be empty',
    ].forEach((errorMessage, index) => {
      expect(errorMessage).toEqual(body.message[index]);
    });
  });

  it('/v1/api/auth/login (POST)', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/v1/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ username: 'admin', password: '123456' });

    expect(status).toEqual(200);
    expect(typeof body === 'object').toEqual(true);
    expect(body.hasOwnProperty('accessToken')).toEqual(true);
  });

  it('/v1/api/auth/login (POST) should throw unauthorized exception if username or password is incorrect', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/v1/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ username: 'andi', password: '000000' });

    expect(status).toEqual(401);
    expect(typeof body === 'object').toEqual(true);
    expect(Object.keys(body).sort()).toEqual(
      ['statusCode', 'error', 'message'].sort(),
    );
    expect(body.statusCode).toEqual(401);
    expect(body.error).toEqual('Unauthorized');
    expect(body.message).toEqual('Authentication failed');
  });
});
