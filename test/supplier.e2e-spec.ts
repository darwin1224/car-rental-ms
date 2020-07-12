import { Supplier } from '@app/supplier/models/supplier';
import { SupplierModule } from '@app/supplier/supplier.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import request from 'supertest';
import { getConnection } from 'typeorm';

describe('SupplierController (e2e)', () => {
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
            entities: [Supplier],
          }),
          inject: [ConfigService],
        }),
        SupplierModule,
      ],
    }).compile();

    await getConnection().synchronize(true);

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/v1/api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/api/suppliers (GET) should return empty array when there is no single data in database', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/v1/api/suppliers',
    );
    const expectedBody = body as Pagination<Supplier>;

    expect(status).toEqual(200);
    expect(Array.isArray(expectedBody.items)).toEqual(true);
    expect(expectedBody.items.length).toEqual(0);
  });

  it('/v1/api/suppliers (POST)', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/v1/api/suppliers')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Budi',
        phoneNumber: '0852114342',
        address: 'Medan, Indonesia',
      });
    const expectedBody = body as Supplier;

    expect(status).toEqual(201);
    expect(typeof expectedBody === 'object').toEqual(true);
    expect(Object.keys(expectedBody).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expectedBody.name).toEqual('Budi');
    expect(expectedBody.phoneNumber).toEqual('0852114342');
    expect(expectedBody.address).toEqual('Medan, Indonesia');
  });

  it('/v1/api/suppliers (GET)', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/v1/api/suppliers',
    );
    const expectedBody = body as Pagination<Supplier>;

    expect(status).toEqual(200);
    expect(Object.keys(expectedBody).sort()).toEqual(
      ['items', 'meta', 'links'].sort(),
    );
    expect(Array.isArray(expectedBody.items)).toEqual(true);
    expectedBody.items.forEach(item => {
      expect(Object.keys(item).sort()).toEqual(
        [
          'id',
          'name',
          'phoneNumber',
          'address',
          'createdAt',
          'updatedAt',
        ].sort(),
      );
    });
    expect(Object.keys(expectedBody.meta).sort()).toEqual(
      [
        'currentPage',
        'itemCount',
        'itemsPerPage',
        'totalItems',
        'totalPages',
      ].sort(),
    );
    expect(expectedBody.meta.currentPage).toEqual(1);
    expect(expectedBody.meta.itemsPerPage).toEqual(10);
    expect(expectedBody.meta.itemCount).toEqual(expectedBody.items.length);
    expect(expectedBody.meta.totalItems).toEqual(expectedBody.items.length);
    expect(Object.keys(expectedBody.links).sort()).toEqual(
      ['first', 'last', 'next', 'previous'].sort(),
    );
    expect(expectedBody.links.first).toEqual(
      'http://localhost:3000/v1/api/suppliers?limit=10',
    );
    expect(expectedBody.links.last).toEqual(
      'http://localhost:3000/v1/api/suppliers?page=1&limit=10',
    );
  });

  it('/v1/api/suppliers/:id (GET)', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/v1/api/suppliers/1',
    );
    const expectedBody = body as Supplier;

    expect(status).toEqual(200);
    expect(typeof expectedBody === 'object').toEqual(true);
    expect(Object.keys(expectedBody).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expectedBody.id).toEqual(1);
  });

  it('/v1/api/suppliers/:id (GET) should throw not found exception when supplier is not found', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/v1/api/suppliers/99999',
    );

    expect(status).toEqual(404);
    expect(typeof body === 'object').toEqual(true);
    expect(Object.keys(body).sort()).toEqual(
      ['statusCode', 'error', 'message'].sort(),
    );
    expect(body.statusCode).toEqual(404);
    expect(body.error).toEqual('Not Found');
    expect(body.message).toEqual('Supplier not found');
  });

  it('/v1/api/suppliers/:id (PUT)', async () => {
    const { status, body } = await request(app.getHttpServer())
      .put('/v1/api/suppliers/1')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Dito',
        phoneNumber: '085257221',
        address: 'Bandung, Indonesia',
      });
    const expectedBody = body as Supplier;

    expect(status).toEqual(200);
    expect(typeof expectedBody === 'object').toEqual(true);
    expect(Object.keys(expectedBody).sort()).toEqual(
      ['id', 'name', 'phoneNumber', 'address', 'createdAt', 'updatedAt'].sort(),
    );
    expect(expectedBody.name).toEqual('Dito');
    expect(expectedBody.phoneNumber).toEqual('085257221');
    expect(expectedBody.address).toEqual('Bandung, Indonesia');
  });

  it('/v1/api/suppliers/:id (PUT) should throw not found exception when supplier is not found', async () => {
    const { status, body } = await request(app.getHttpServer())
      .put('/v1/api/suppliers/99999')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Dito',
        phoneNumber: '085257221',
        address: 'Bandung, Indonesia',
      });

    expect(status).toEqual(404);
    expect(typeof body === 'object').toEqual(true);
    expect(Object.keys(body).sort()).toEqual(
      ['statusCode', 'error', 'message'].sort(),
    );
    expect(body.statusCode).toEqual(404);
    expect(body.error).toEqual('Not Found');
    expect(body.message).toEqual('Supplier not found');
  });

  it('/v1/api/suppliers/:id (DELETE)', async () => {
    const { status, body } = await request(app.getHttpServer()).delete(
      '/v1/api/suppliers/1',
    );

    expect(status).toEqual(204);
    expect(body).toEqual({});
  });

  it('/v1/api/suppliers/:id (DELETE) should throw not found exception when supplier is not found', async () => {
    const { status, body } = await request(app.getHttpServer()).delete(
      '/v1/api/suppliers/99999',
    );

    expect(status).toEqual(404);
    expect(typeof body === 'object').toEqual(true);
    expect(Object.keys(body).sort()).toEqual(
      ['statusCode', 'error', 'message'].sort(),
    );
    expect(body.statusCode).toEqual(404);
    expect(body.error).toEqual('Not Found');
    expect(body.message).toEqual('Supplier not found');
  });
});