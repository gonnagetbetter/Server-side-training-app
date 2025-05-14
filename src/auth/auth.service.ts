import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResultDto } from './dto/sign-up-result.dto';
import { JwtDto } from './dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignUpDto): Promise<SignUpResultDto> {
    const user = await this.usersService.findOne({ email: dto.email });

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = new User();

    newUser.email = dto.email;
    newUser.fullName = dto.fullName;
    newUser.role = UserRole.USER;

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(dto.password, salt);

    newUser.passwordHash = hashed;
    newUser.passwordSalt = salt;

    await this.usersService.createOne(newUser);

    return {
      success: true,
    };
  }

  async signin(dto: SignInDto): Promise<JwtDto> {
    const user = await this.usersService.findOne({ email: dto.email });

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);

    if (!match) {
      throw new BadRequestException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  validate(token: string): { sub: number; role: UserRole; email: string } {
    return this.jwtService.verify(token);
  }
}
