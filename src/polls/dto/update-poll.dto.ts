import { IsString, IsOptional, ArrayMinSize, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePollDto {
  @ApiProperty({ description: 'New question for the poll', example: 'Which language is best?', required: false })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiProperty({
    description: 'New array of answer options for the poll',
    example: ['JavaScript', 'Python', 'Java'],
    minItems: 2,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'Optional. New expiration date and time for the poll (ISO 8601 format)',
    example: '2024-01-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}