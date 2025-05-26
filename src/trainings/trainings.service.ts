import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Training } from './entities/training.entity';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingType } from './enums/training-type.enum';
import { TrainingStatus } from './enums/training-status';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { TrainingRepository } from './repositories/training.repository';
import { plainToInstance } from 'class-transformer';
import { FindTrainingArgs } from './args/find-training.args';
import { UsersService } from '../users/users.service';
import { GroupsService } from '../groups/groups.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class TrainingsService extends BasicCrudService<Training> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly trainingRepository: TrainingRepository,
    protected readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {
    super(Training, trainingRepository, cacheService, entityManager);
  }

  async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const training = new Training();

    if (createTrainingDto.trainer) {
      const user = await this.usersService.findOne({
        id: createTrainingDto.trainer,
      });
      if (user && user.role !== UserRole.TRAINER) {
        throw new BadRequestException(
          `User with ID ${createTrainingDto.trainer} is not a trainer`,
        );
      }
      training.trainer = user;
    }

    if (createTrainingDto.trainingType === TrainingType.INDIVIDUAL) {
      if (!createTrainingDto.trainee) {
        throw new BadRequestException(
          'Trainee ID is required for individual training',
        );
      }
      if (createTrainingDto.traineeGroup) {
        throw new BadRequestException(
          'Trainee group should not be specified for individual training',
        );
      }

      const trainee = await this.usersService.findOne({
        id: createTrainingDto.trainee,
      });
      if (!trainee) {
        throw new NotFoundException(
          `Trainee with ID ${createTrainingDto.trainee} not found`,
        );
      }
    } else if (createTrainingDto.trainingType === TrainingType.GROUP) {
      if (!createTrainingDto.traineeGroup) {
        throw new BadRequestException(
          'Trainee group ID is required for group training',
        );
      }
      if (createTrainingDto.trainee) {
        throw new BadRequestException(
          'Trainee should not be specified for group training',
        );
      }

      const group = await this.groupsService.findOne({
        id: createTrainingDto.traineeGroup,
      });
      if (!group) {
        throw new NotFoundException(
          `Group with ID ${createTrainingDto.traineeGroup} not found`,
        );
      }
    }

    training.trainingType = createTrainingDto.trainingType;
    if (createTrainingDto.trainingType === TrainingType.INDIVIDUAL) {
      const trainee = await this.usersService.findOne({
        id: createTrainingDto.trainee,
      });
      if (!trainee) {
        throw new NotFoundException(
          `Trainee with ID ${createTrainingDto.trainee} not found`,
        );
      }
      training.trainee = trainee;
    }
    if (createTrainingDto.trainingType === TrainingType.GROUP) {
      const group = await this.groupsService.findOne({
        id: createTrainingDto.traineeGroup,
      });
      if (!group) {
        throw new NotFoundException(
          `Group with ID ${createTrainingDto.traineeGroup} not found`,
        );
      }
      training.traineeGroup = group;
    }
    training.description = createTrainingDto.description || '';
    training.date = createTrainingDto.date;
    training.ExerciseSetId = createTrainingDto.ExerciseSetId;
    training.status = TrainingStatus.FUTURE;
    training.NotifiedAbout = false;

    await this.entityManager.persistAndFlush(training);
    return training;
  }

  async complexSearch(args: FindTrainingArgs): Promise<Training[]> {
    const query = this.trainingRepository.qb().select('*');

    if (args.id) {
      query.andWhere({ id: args.id });
    }

    if (args.trainingType) {
      query.andWhere({ trainingType: args.trainingType });
    }

    if (args.status) {
      query.andWhere({ status: args.status });
    }

    if (args.trainer) {
      query.andWhere({ trainer: args.trainer });
    }

    if (args.trainee) {
      query.andWhere({ trainee: args.trainee });
    }

    if (args.traineeGroup) {
      query.andWhere({ traineeGroup: args.traineeGroup });
    }

    if (args.exerciseSetId) {
      query.andWhere({ ExerciseSetId: args.exerciseSetId });
    }

    if (args.description) {
      query.andWhere({ description: args.description });
    }

    if (args.date) {
      query.andWhere({ date: args.date });
    }

    if (args.NotifiedAbout) {
      query.andWhere({ NotifiedAbout: args.NotifiedAbout });
    }

    if (args.search) {
      query.andWhere({
        $or: [{ description: { $like: `%${args.search}%` } }],
      });
    }

    const result = await query.execute();
    return result.map((training) => plainToInstance(Training, training));
  }

  async update(
    id: number,
    updateTrainingDto: UpdateTrainingDto,
  ): Promise<Training> {
    const training = await this.findOne(id);

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    this.entityManager.assign(training, updateTrainingDto);
    await this.entityManager.flush();

    return training;
  }

  async remove(id: number): Promise<void> {
    const training = await this.findOne(id);
    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }
    await this.entityManager.removeAndFlush(training);
  }
}
