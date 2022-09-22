import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ProductInPlaces } from './product_in_places.entity';

export enum PlaceStatus {
  NOTAVAILABLE,
  AVAILABLE,
}
@Entity()
export class Places extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    length: 35,
    type: 'varchar',
    nullable: false,
  })
  city: string;

  @Column({
    length: 36,
    type: 'varchar',
    nullable: false,
  })
  street: string;

  @Column({
    length: 20,
    type: 'varchar',
    nullable: false,
  })
  buildNumber: string;

  @Column({
    length: 200,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  img: string;

  @Column({
    type: 'enum',
    enum: PlaceStatus,
    default: PlaceStatus.AVAILABLE,
    nullable: false,
  })
  placeStatus: PlaceStatus;

  @OneToMany(() => ProductInPlaces, (productInPlaces) => productInPlaces.places)
  productInPlaces: ProductInPlaces;
}
