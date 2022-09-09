import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Places extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    type: 'varchar',
  })
  name: string;

  @Column({
    length: 35,
    type: 'varchar',
  })
  city: string;

  @Column({
    length: 36,
    type: 'varchar',
  })
  street: string;

  @Column({
    length: 20,
    type: 'varchar',
  })
  buildNumber: string;

  @Column({
    length: 200,
    type: 'varchar',
  })
  img: string;
}
