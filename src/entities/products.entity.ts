import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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
    length: 5,
    type: 'int',
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
  })
  img: string;
}
