import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 254,
    nullable: false,
  })
  userEmail: string;

  @Column({
    nullable: false,
  })
  pwdHash: string;

  @Column({
    default: null,
    nullable: true,
  })
  currentTokenId: string | null;
}
