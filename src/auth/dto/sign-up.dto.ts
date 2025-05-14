import { SignInDto } from './sign-in.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the user',
  })
  fullName: string;
}
