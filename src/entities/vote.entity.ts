import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Poll } from './poll.entity';
import { User } from './user.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chosenOptionIndex: number;

  @CreateDateColumn()
  votedAt: Date;

  @ManyToOne(() => Poll, (poll) => poll.votes)
  poll: Poll;

  @ManyToOne(() => User, (user) => user.votes, { nullable: true })
    user: User;
}