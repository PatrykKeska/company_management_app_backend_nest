import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Products } from './products.entity';
import { Places } from './places.entity';

@Entity()
export class ProductInPlaces extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'tinyint',
    precision: 5,
    nullable: false,
  })
  amount: number;

  @ManyToOne(() => Products, (product) => product.id)
  products: Products;
  @ManyToOne(() => Places, (places) => places.id)
  places: Places;
}
