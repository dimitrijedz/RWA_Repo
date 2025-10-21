import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async createPoll(createPollDto: CreatePollDto, user: User): Promise<Poll> {
    const newPoll = this.pollsRepository.create({
      ...createPollDto,
      user,
    });
    return this.pollsRepository.save(newPoll);
  }

  async findAllPolls(): Promise<Poll[]> {
    return this.pollsRepository.find({ relations: ['user', 'votes', 'votes.user'] });
  }

  async findOnePoll(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: ['user', 'votes', 'votes.user'],
    });
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }
    return poll;
  }

  async updatePoll(id: number, updatePollDto: UpdatePollDto, userId: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }
    if (poll.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to update this poll.');
    }

    if (updatePollDto.question) {
      poll.question = updatePollDto.question;
    }
    if (updatePollDto.options) {
      poll.options = updatePollDto.options;
    }
    if (updatePollDto.expiresAt) {
      poll.expiresAt = updatePollDto.expiresAt;
    }

    return this.pollsRepository.save(poll);
  }

  async removePoll(id: number, userId: number): Promise<void> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!poll) {
      throw new NotFoundException(`Anketa sa ID ${id} nije pronađena.`);
    }
    if (poll.user.id !== userId) {
      throw new ForbiddenException('Nemate dozvolu za brisanje ove ankete.');
    }
    await this.votesRepository.delete({ poll: poll });
    await this.pollsRepository.delete(id);
  }

  async voteOnPoll(pollId: number, votePollDto: VotePollDto, user?: User): Promise<Vote> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId } });
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${pollId} not found`);
    }

    if (votePollDto.chosenOptionIndex < 0 || votePollDto.chosenOptionIndex >= poll.options.length) {
      throw new BadRequestException('Invalid option index');
    }

    const newVote = this.votesRepository.create({
      poll,
      user,
      chosenOptionIndex: votePollDto.chosenOptionIndex,
    });

    return this.votesRepository.save(newVote);
  }

  async getPollResults(pollId: number): Promise<{ options: string[]; results: { [key: string]: number } }> {
    const poll = await this.pollsRepository.findOne({ where: { id: pollId }, relations: ['votes'] });
    if (!poll) {
      throw new NotFoundException(`Poll with ID ${pollId} not found`);
    }

    const results: { [key: string]: number } = {};
    poll.options.forEach((_, index) => {
      results[index] = 0;
    });

    poll.votes.forEach((vote) => {
      if (vote.chosenOptionIndex >= 0 && vote.chosenOptionIndex < poll.options.length) {
        results[vote.chosenOptionIndex]++;
      }
    });

    return {
      options: poll.options,
      results,
    };
  }
}