import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ 
    required: true,
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    required: true,
    description: 'User password (8-20 characters)',
    example: 'password123',
    minLength: 8,
    maxLength: 20,
  })
  @IsString({
    message: 'Password must be a string',
  })
  @MaxLength(20, {
    message: 'Password must be shorter than or equal to 20 characters',
  })
  @MinLength(8, {
    message: 'Password must be longer than or equal to 8 characters',
  })
  password: string;
}
