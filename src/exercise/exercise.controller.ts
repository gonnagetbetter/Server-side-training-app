import { AuthGuard } from '../auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { FindExerciseArgs } from './args/find-exercise.args';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exersice.dto';

@Controller('exercise')
@UseGuards(AuthGuard)
@ApiTags('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returned all exercises',
  })
  findAll(@Query() args: FindExerciseArgs) {
    return this.exerciseService.findAll(args);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.findOneSafe(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Created an exercise',
  })
  createExercise(@Body() dto: CreateExerciseDto) {
    return this.exerciseService.create(dto);
  }

  @ApiBearerAuth()
  @Patch()
  update(@Body() dto: UpdateExerciseDto) {
    return this.exerciseService.update(dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseService.remove(id);
  }
}
