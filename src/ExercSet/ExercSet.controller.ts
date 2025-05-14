import { AuthGuard } from '../auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExercSetService } from './ExercSet.service';
import { FindExercSetArgs } from './args/find-exerc-set.args';
import { CreateExercSetDto } from './dto/create-exerc-set.dto';
import { UpdateExercSetDto } from './dto/update-exerc-set.dto';

@Controller('exerc-set')
@UseGuards(AuthGuard)
@ApiTags('exerc-set')
export class ExercSetController {
  constructor(private readonly exercSetService: ExercSetService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns all exercise sets',
  })
  findAll(@Query() args: FindExercSetArgs) {
    return this.exercSetService.findAll(args);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exercSetService.findOneSafe(id);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Creates an exercise set',
  })
  createExercSet(@Body() dto: CreateExercSetDto) {
    return this.exercSetService.create(dto);
  }

  @Patch()
  update(@Body() dto: UpdateExercSetDto) {
    return this.exercSetService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exercSetService.remove(id);
  }
}
