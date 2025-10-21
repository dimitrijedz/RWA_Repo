import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Request, Patch, Delete, HttpCode } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new poll (requires JWT token)' })
  @ApiResponse({ status: 201, description: 'Poll successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createPollDto: CreatePollDto, @Request() req) {
    return this.pollsService.createPoll(createPollDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all polls' })
  @ApiResponse({ status: 200, description: 'Returns a list of all polls.' })
  findAll() {
    return this.pollsService.findAllPolls();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single poll by ID' })
  @ApiResponse({ status: 200, description: 'Returns the poll details.' })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOnePoll(id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vote on a poll' })
  @ApiResponse({ status: 201, description: 'Vote successfully recorded.' })
  @ApiResponse({ status: 400, description: 'Invalid option index.' })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  vote(
    @Param('id', ParseIntPipe) id: number,
    @Body() votePollDto: VotePollDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.pollsService.voteOnPoll(id, votePollDto, user);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get results for a specific poll' })
  @ApiResponse({ status: 200, description: 'Returns the poll results.' })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  getResults(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.getPollResults(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a poll by ID (requires JWT token, only owner can update)' })
  @ApiResponse({ status: 200, description: 'Poll successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: You are not the owner of this poll.' })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollDto: UpdatePollDto,
    @Request() req,
  ) {
    return this.pollsService.updatePoll(id, updatePollDto, req.user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a poll by ID (requires JWT token, only owner can delete)' })
  @ApiResponse({ status: 204, description: 'Poll successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: You are not the owner of this poll.' })
  @ApiResponse({ status: 404, description: 'Poll not found.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.pollsService.removePoll(id, req.user.id);
  }
}