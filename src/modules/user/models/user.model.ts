import bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  @Index()
  name!: string;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: false })
  @Index({ unique: true })
  username!: string;

  @Column({ name: 'password', type: 'text', nullable: false })
  password!: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ['admin', 'cashier'],
    nullable: false,
  })
  role!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: string;

  @BeforeInsert()
  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password);
  }
}
