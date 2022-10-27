import { Products } from '../../entities/products.entity';

export interface AllProductsInPlace {
  place: {
    id: string;
    name: string;
    city: string;
    street: string;
    buildNumber: string;
    img: string;
    placeStatus: number;
  };
  products: Products[];
}
