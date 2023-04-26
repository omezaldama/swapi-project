import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTestingModule, mockResponse } from '../common/test-utils';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { Planet } from './planet.entity';

const createMockPlanet = (): Planet => {
  const planet = new Planet();
  planet.climate = 'mock climate';
  planet.diameter = 123.45;
  planet.gravity = 'mock gravity !';
  planet.name = 'Mock Planet';
  planet.population = 12345;
  planet.terrain = 'mock terrain';
  planet.url = 'https://mock.test';
  planet.externalId = 123;
  return planet;
}

describe('PlanetsController', () => {
  let controller: PlanetsController;
  let service: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      imports: [
        TypeOrmTestingModule([Planet]),
        TypeOrmModule.forFeature([Planet]),
      ],
      providers: [PlanetsService],
    }).compile();

    controller = module.get<PlanetsController>(PlanetsController);
    service = module.get<PlanetsService>(PlanetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fail when given a non-integer page number', async () => {
    const response = await controller.getPaginatedPlanets('1.4', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should fail when given a page number equal to zero', async () => {
    const response = await controller.getPaginatedPlanets('0', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should fail when given a negative page number', async () => {
    const response = await controller.getPaginatedPlanets('-1', mockResponse);
    expect(response).toHaveProperty('errorMessage');
  });

  it('should get planet from database if it already exists', async () => {
    const spyGetFromDb = jest.spyOn(service, 'getPlanetBySwapiIdFromDb')
      .mockReturnValue(Promise.resolve(createMockPlanet()));
    const spyGetFromSwapi = jest.spyOn(service, 'getPlanetBySwapiIdFromSwapi');
    await controller.getPlanetById('1', mockResponse);
    expect(spyGetFromSwapi).toHaveBeenCalledTimes(0);
  });

  it('should get planet from Swapi if it doest not exist on the database', async () => {
    const spyGetFromDb = jest.spyOn(service, 'getPlanetBySwapiIdFromDb')
      .mockReturnValue(Promise.resolve(null));
    const spyGetFromSwapi = jest.spyOn(service, 'getPlanetBySwapiIdFromSwapi')
      .mockReturnValue(Promise.resolve(createMockPlanet()));
    await controller.getPlanetById('1', mockResponse);
    expect(spyGetFromSwapi).toHaveBeenCalledTimes(1);
  });
});
