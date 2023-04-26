import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTestingModule, mockResponse } from '../common/test-utils';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person } from './people.entity';

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
});
