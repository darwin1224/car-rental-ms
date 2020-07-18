import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  @Index()
  name!: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: null,
  })
  phoneNumber?: string;

  @Column({ name: 'address', type: 'text', nullable: true, default: null })
  address?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;
}
