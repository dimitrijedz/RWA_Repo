import { IsNotEmpty, IsString, ArrayMinSize, IsArray, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePollDto {
  @ApiProperty({
    description: 'The question for the poll',
    example: 'Which framework do you prefer?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'An array of possible answer options for the poll',
    example: ['A', 'B', 'C', 'D'],
    minItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'Optional. The date and time when the poll should expire (ISO 8601 format)',
    example: 'yyyy-mm-ddThh:mm:ssZ',
    required: false, 
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}