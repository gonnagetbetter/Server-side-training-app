import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TrainingsService } from './trainings.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequiredRole } from '../auth/decorator/required-role.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { Training } from './entities/training.entity';
import { FindTrainingArgs } from './args/find-training.args';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingStatus } from './enums/training-status';

@Controller('trainings')
@UseGuards(AuthGuard)
@ApiTags('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates a new training',
    type: Training,
  })
  create(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingsService.create(createTrainingDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all trainings with filtering options',
    type: Training,
    isArray: true,
  })
  findAll(@Query() args: FindTrainingArgs) {
    return this.trainingsService.complexSearch(args);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns a training by ID',
    type: Training,
  })
  findOne(@Param('id') id: string) {
    return this.trainingsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Updates a training',
    type: Training,
  })
  update(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
  ) {
    return this.trainingsService.update(+id, updateTrainingDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes a training',
  })
  remove(@Param('id') id: string) {
    return this.trainingsService.remove(+id);
  }
}
