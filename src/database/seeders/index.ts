import { EntityManager } from '@mikro-orm/core';
import { faker } from '@faker-js/faker/locale/en';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { Group } from '../../groups/entities/group.entity';
import { Exercise } from '../../exercise/entities/exercise.entity';
import { ExerciseSet } from '../../exercise-set/entities/exercise-set.entity';
import { Training } from '../../trainings/entities/training.entity';
import { TrainingType } from '../../trainings/enums/training-type.enum';
import { TrainingStatus } from '../../trainings/enums/training-status';
import { addDays, subMonths } from 'date-fns';

export class Seeder {
  constructor(private readonly em: EntityManager) {}

  async seed() {
    await this.seedUsers();
    await this.seedGroups();
    await this.seedExercises();
    await this.seedExerciseSets();
    await this.seedTrainings();
  }

  private async seedUsers() {
    const users: User[] = [];

    // Create admin
    const admin = new User();
    admin.fullName = 'Administrator';
    admin.email = 'admin@example.com';
    admin.role = UserRole.ADMIN;
    admin.passwordHash = 'dummy_hash';
    admin.passwordSalt = 'dummy_salt';
    users.push(admin);

    // Create trainers
    for (let i = 0; i < 10; i++) {
      const trainer = new User();
      trainer.fullName = faker.person.fullName();
      trainer.email = faker.internet.email();
      trainer.role = UserRole.TRAINER;
      trainer.passwordHash = 'dummy_hash';
      trainer.passwordSalt = 'dummy_salt';
      users.push(trainer);
    }

    // Create regular users
    for (let i = 0; i < 50; i++) {
      const user = new User();
      user.fullName = faker.person.fullName();
      user.email = faker.internet.email();
      user.role = UserRole.USER;
      user.passwordHash = 'dummy_hash';
      user.passwordSalt = 'dummy_salt';
      users.push(user);
    }

    await this.em.persistAndFlush(users);
  }

  private async seedGroups() {
    const groups: Group[] = [];
    const trainers = await this.em.find(User, { role: UserRole.TRAINER });

    // Create one group for each trainer
    for (const trainer of trainers) {
      const group = new Group();
      group.name = faker.company.name();
      group.creator = trainer;
      groups.push(group);
    }

    await this.em.persistAndFlush(groups);
  }

  private async seedExercises() {
    const exercises: Exercise[] = [];

    // List of names that will be repeated
    const exerciseNames = [
      'Squats',
      'Bench Press',
      'Deadlift',
      'Pull-ups',
      'Push-ups',
    ];

    // For each name, create 20 exercises with different parameters
    for (const name of exerciseNames) {
      for (let i = 0; i < 20; i++) {
        const exercise = new Exercise();
        exercise.name = name;
        exercise.startWeight = faker.number.int({ min: 20, max: 50 }) + i * 10;
        exercise.endWeight = faker.number.int({ min: 100, max: 200 }) + i * 10;
        exercise.weightIncrement = faker.number.int({ min: 2, max: 5 });
        exercise.setsNum = faker.number.int({ min: 3, max: 5 }) + i;
        exercise.repsNum = faker.number.int({ min: 8, max: 12 });
        exercises.push(exercise);
      }
    }

    await this.em.persistAndFlush(exercises);
  }

  private async seedExerciseSets() {
    const exerciseSets: ExerciseSet[] = [];
    const exercises = await this.em.find(Exercise, {});

    // Create 20 sets with the same exercise names but different parameters
    for (let i = 0; i < 20; i++) {
      const exerciseSet = new ExerciseSet();
      exerciseSet.name = `Standard Program Variant ${i + 1}`;
      // Take one variant of each name
      exerciseSet.exercises = exercises.filter((ex, idx) => idx % 20 === i);
      exerciseSets.push(exerciseSet);
    }

    await this.em.persistAndFlush(exerciseSets);
  }

  private async seedTrainings() {
    const trainings: Training[] = [];
    const trainers = await this.em.find(User, { role: UserRole.TRAINER });
    const users = await this.em.find(User, { role: UserRole.USER });
    const exerciseSets = await this.em.find(ExerciseSet, {});
    const groups = await this.em.find(Group, {});

    const now = new Date();
    const twoMonthsAgo = subMonths(now, 2);
    const endOfWeek = addDays(now, 7);

    // Create individual trainings for each user
    for (const user of users) {
      // Create 5 completed trainings for the last 2 months
      for (let i = 0; i < 5; i++) {
        const training = new Training();
        const randomTrainer =
          trainers[Math.floor(Math.random() * trainers.length)];
        training.trainer = randomTrainer;
        training.trainingType = TrainingType.INDIVIDUAL;
        training.trainee = user;
        training.description = faker.lorem.sentence();
        training.date = faker.date.between({ from: twoMonthsAgo, to: now });
        training.status = TrainingStatus.FINISHED;
        training.NotifiedAbout = true;
        training.ExerciseSetId = faker.helpers.arrayElement(exerciseSets).id;
        trainings.push(training);
      }

      // Create 2 future individual trainings for this week
      for (let i = 0; i < 2; i++) {
        const training = new Training();
        const randomTrainer =
          trainers[Math.floor(Math.random() * trainers.length)];
        training.trainer = randomTrainer;
        training.trainingType = TrainingType.INDIVIDUAL;
        training.trainee = user;
        training.description = faker.lorem.sentence();
        training.date = faker.date.between({ from: now, to: endOfWeek });
        training.status = TrainingStatus.FUTURE;
        training.NotifiedAbout = false;
        training.ExerciseSetId = faker.helpers.arrayElement(exerciseSets).id;
        trainings.push(training);
      }
    }

    // Create group trainings
    for (const group of groups) {
      // Create 3 completed group trainings for the last 2 months
      for (let i = 0; i < 3; i++) {
        const training = new Training();
        training.trainer = group.creator;
        training.trainingType = TrainingType.GROUP;
        training.traineeGroup = group;
        training.description = faker.lorem.sentence();
        training.date = faker.date.between({ from: twoMonthsAgo, to: now });
        training.status = TrainingStatus.FINISHED;
        training.NotifiedAbout = true;
        training.ExerciseSetId = faker.helpers.arrayElement(exerciseSets).id;
        trainings.push(training);
      }

      // Create 2 future group trainings for this week
      for (let i = 0; i < 2; i++) {
        const training = new Training();
        training.trainer = group.creator;
        training.trainingType = TrainingType.GROUP;
        training.traineeGroup = group;
        training.description = faker.lorem.sentence();
        training.date = faker.date.between({ from: now, to: endOfWeek });
        training.status = TrainingStatus.FUTURE;
        training.NotifiedAbout = false;
        training.ExerciseSetId = faker.helpers.arrayElement(exerciseSets).id;
        trainings.push(training);
      }
    }

    await this.em.persistAndFlush(trainings);
  }
}
