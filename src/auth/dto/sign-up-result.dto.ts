import { ApiProperty } from '@nestjs/swagger';

export class SignUpResultDto {
  @ApiProperty({
    description: 'Indicates whether the sign-up process was successful',
    example: true,
    required: true,
  })
  success: boolean;
}
