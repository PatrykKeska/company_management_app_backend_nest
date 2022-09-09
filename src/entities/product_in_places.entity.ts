import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class ProductInPlaces extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 36,
    type: 'varchar',
    nullable: false,
  })
  productID: string;

  @Column({
    length: 36,
    type: 'varchar',
    nullable: false,
  })
  placeID: string;

  @Column({
    type: 'tinyint',
    precision: 5,
    nullable: false,
  })
  amount: number;
}
