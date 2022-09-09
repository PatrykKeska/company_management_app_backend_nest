import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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
    nullable: false,
  })
  img: string;
}
