import { TypeOrmModule } from '@nestjs/typeorm';
export default () =>
  ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist//**/**.entity{.ts,.js}'],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
  } as TypeOrmModule);

//dbConnectionConfig
