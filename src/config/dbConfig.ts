import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnection } from '../secretFIle';
import { Places } from '../entities/places.entity';
import { Products } from '../entities/products.entity';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { User } from '../entities/user.entity';
export default () =>
  ({
    type: dbConnection.DB_CONNECTION,
    host: dbConnection.DB_HOST,
    port: 3306,
    username: dbConnection.DB_USERNAME,
    password: dbConnection.DB_PASSWORD,
    database: dbConnection.DB_DATABASE,
    entities: [Places, Products, ProductInPlaces, User],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
  } as TypeOrmModule);

//dbConnectionConfig
