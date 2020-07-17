import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('car_categories')
export class CarCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 30, nullable: false })
  @Index({ unique: true })
  name!: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  displayName!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;
}
