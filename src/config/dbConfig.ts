import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnection } from '../secretFIle';
export default () =>
  ({
    type: dbConnection.DB_CONNECTION,
    host: dbConnection.DB_HOST,
    port: dbConnection.DB_PORT,
    username: dbConnection.DB_USERNAME,
    password: dbConnection.DB_PASSWORD,
    database: dbConnection.DB_DATABASE,
    entities: ['dist//**/**.entity{.ts,.js}'],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
  } as TypeOrmModule);
