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
import { ExerciseSetService } from './exercise-set.service';
import { FindExerciseSetArgs } from './args/find-exercise-set.args';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { UpdateExerciseSetDto } from './dto/update-exercise-set.dto';

@Controller('exerc-set')
@UseGuards(AuthGuard)
@ApiTags('exerc-set')
export class ExerciseSetController {
  constructor(private readonly exerciseSetService: ExerciseSetService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all exercise sets',
  })
  findAll(@Query() args: FindExerciseSetArgs) {
    return this.exerciseSetService.findAll(args);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOkResponse({
    description: 'Returns an exercise set',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetService.findOneSafe(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates an exercise set',
  })
  createExerciseSet(@Body() dto: CreateExerciseSetDto) {
    return this.exerciseSetService.create(dto);
  }

  @ApiBearerAuth()
  @Patch()
  @ApiOkResponse({
    description: 'Updates an exercise set',
  })
  update(@Body() dto: UpdateExerciseSetDto) {
    return this.exerciseSetService.update(dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOkResponse({
    description: 'Deletes an exercise set',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetService.remove(id);
  }
}
