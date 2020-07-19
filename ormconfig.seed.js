module.exports = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
  entities: ['src/**/*.model.{t,j}s'],
  migrations: ['src/**/*.migration.{t,j}s'],
  seeds: ['src/**/*.seed.{t,j}s'],
  factories: ['src/**/*.factory.{t,j}s'],
};
