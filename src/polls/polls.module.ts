import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { PollsService } from './polls.service';
    import { PollsController } from './polls.controller';
    import { Poll } from '../entities/poll.entity';
    import { Vote } from '../entities/vote.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Poll, Vote])],
      controllers: [PollsController],
      providers: [PollsService],
    })
    export class PollsModule {}