import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
  })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fullName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    enum: UserRole,
    required: false,
  })
  role?: UserRole;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  trainer_id?: number;


  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  group_id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;
}
