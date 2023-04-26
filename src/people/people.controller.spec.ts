import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTestingModule, mockResponse } from '../common/test-utils';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person } from './people.entity';
import { CreatePersonDto } from './people.validations';

const createMockPerson = (): Person => {
  const person = new Person();
  person.name = 'Mock Name';
  person.birthYear = 'mock year';
  person.eyeColor = 'mock color';
  person.gender = 'mock gender';
  person.hairColor = 'mock color';
  person.height = 123;
  person.homeworld = 'mock homeworld';
  person.mass = 456;
  person.skinColor = 'mock color';
  person.created = '!/2/3456';
  person.edited = '9/8/7654';
  person.externalId = 123;
  return person;
}

const createMockPersonDto = (): CreatePersonDto => {
  const person = new CreatePersonDto();
  person.name = 'Mock Name';
  person.birth_year = 'mock year';
  person.eye_color = 'mock color';
  person.gender = 'mock gender';
  person.hair_color = 'mock color';
  person.height = 123;
  person.homeworld = 'mock homeworld';
  person.mass = 456;
  person.skin_color = 'mock color';
  person.created = '!/2/3456';
  person.edited = '9/8/7654';
  return person;
}

describe('PlanetsController', () => {
  let controller: PeopleController;
  let service: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      imports: [
        TypeOrmTestingModule([Person]),
        TypeOrmModule.forFeature([Person]),
      ],
      providers: [PeopleService],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fail when given a non-integer page number', async () => {
    const response = await controller.getPaginatedPeople('1.4', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should fail when given a page number equal to zero', async () => {
    const response = await controller.getPaginatedPeople('0', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should fail when given a negative page number', async () => {
    const response = await controller.getPaginatedPeople('-1', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should get person from database if it already exists', async () => {
    const spyGetFromDb = jest.spyOn(service, 'getPersonBySwapiIdFromDb')
      .mockReturnValue(Promise.resolve(createMockPerson()));
    const spyGetFromSwapi = jest.spyOn(service, 'getPersonBySwapiIdFromSwapi');
    await controller.getPersonById('1', mockResponse);
    expect(spyGetFromSwapi).toHaveBeenCalledTimes(0);
  });

  it('should get person from Swapi if it doest not exist on the database', async () => {
    const spyGetFromDb = jest.spyOn(service, 'getPersonBySwapiIdFromDb')
      .mockReturnValue(Promise.resolve(null));
    const spyGetFromSwapi = jest.spyOn(service, 'getPersonBySwapiIdFromSwapi')
      .mockReturnValue(Promise.resolve(createMockPerson()));
    await controller.getPersonById('1', mockResponse);
    expect(spyGetFromSwapi).toHaveBeenCalledTimes(1);
  });

  it('should create a person', async () => {
    const spySaveToDb = jest.spyOn(service, 'savePerson');
    await controller.createPerson(createMockPersonDto(), mockResponse);
    expect(spySaveToDb).toHaveBeenCalledTimes(1);
  });
});
