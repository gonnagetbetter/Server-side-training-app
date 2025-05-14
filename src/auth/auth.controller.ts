import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtDto } from './dto/jwt.dto';
import { SignUpResultDto } from './dto/sign-up-result.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiBody({
    type: SignInDto,
    required: true,
    description: 'Credentials for sign in',
  })
  @ApiResponse({
    status: 201,
    description: 'JWT session token',
    type: JwtDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username or password',
  })
  signin(@Body() dto: SignInDto): Promise<JwtDto> {
    return this.authService.signin(dto);
  }

  @Post('signup')
  @ApiBody({
    type: SignUpDto,
    required: true,
    description: 'Credentials for sign in',
  })
  @ApiResponse({
    status: 201,
    description: 'Sign up result',
    type: SignUpResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email already exists or invalid credentials',
  })
  signup(@Body() dto: SignUpDto): Promise<SignUpResultDto> {
    return this.authService.signup(dto);
  }
}
