import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ProductInPlaces } from './product_in_places.entity';
export enum ProductStatus {
  OUTOFSTOCK,
  AVAILABLE,
}

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    precision: 6,
    scale: 2,
    type: 'decimal',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    precision: 6,
    nullable: false,
  })
  amount: number;

  @Column({
    length: 10,
    type: 'varchar',
    nullable: false,
  })
  dateOfBuy: string;

  @Column({
    length: 200,
    type: 'varchar',
    default: null,
  })
  img: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE,
    nullable: false,
  })
  productStatus: ProductStatus;

  @OneToMany(() => ProductInPlaces, (productInPlaces) => productInPlaces.places)
  productInPlaces: ProductInPlaces;
}
