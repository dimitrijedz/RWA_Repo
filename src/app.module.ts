import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { PollsModule } from './polls/polls.module';
import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';

    @Module({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'nestpollapp',
          entities: [User, Poll, Vote],
          synchronize: true,
        }),
        AuthModule,
        UsersModule,
        PollsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}