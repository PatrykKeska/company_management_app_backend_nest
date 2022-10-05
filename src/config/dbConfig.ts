import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnection } from '../secretFIle';
import { User } from '../entities/user.entity';
import { Places } from '../entities/places.entity';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { Products } from '../entities/products.entity';
export default () =>
  ({
    type: dbConnection.DB_CONNECTION,
    host: dbConnection.DB_HOST,
    username: dbConnection.DB_USERNAME,
    password: dbConnection.DB_PASSWORD,
    database: dbConnection.DB_DATABASE,
    entities: [User, Places, ProductInPlaces, Products],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
  } as TypeOrmModule);
