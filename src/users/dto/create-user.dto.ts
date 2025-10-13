import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user (min 6 characters)', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The unique username of the user', example: 'tester1' })
  @IsString()
  @IsNotEmpty()
  username: string;
}