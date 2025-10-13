import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  username?: string;

  @OneToMany(() => Poll, (poll) => poll.user, { cascade: true, onDelete: 'CASCADE' })
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user, { cascade: true, onDelete: 'CASCADE' })
  votes: Vote[];

}