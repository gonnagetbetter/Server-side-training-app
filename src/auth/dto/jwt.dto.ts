import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    required: true,
  })
  accessToken: string;
}
