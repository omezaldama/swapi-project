import { Controller, Get, Query, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { Response } from 'express';
import { PlanetsService } from './planets.service';
import { isPositiveInteger } from '../common/validations';

@ApiTags('Planets')
@Controller('api/planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  async getPaginatedPlanets(
    @Query('page') page: string,
    @Res() response: Response,
  ) {
    if (!isPositiveInteger(page)) {
      const errorMessage = `Not a valid page number: ${page}`;
      console.error(errorMessage);
      return response.status(HttpStatus.BAD_REQUEST).json({ errorMessage });
    }
    const planets = await this.planetsService.getPaginatedPlanets(parseInt(page));
    return response.json(planets);
  }

  @Get(':id')
  async getPlanetById(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    if (!isPositiveInteger(id)) {
      const errorMessage = `Not a valid planet id: ${id}`;
      console.error(errorMessage);
      return response.status(HttpStatus.BAD_REQUEST).json({ errorMessage });
    }
    const planet = await this.planetsService.getPlanetBySwapiId(parseInt(id));
    if (planet !== null) return response.json(planet);
    const errorMessage = `Could not get planet with id ${id}`
    console.info(errorMessage);
    return response.status(HttpStatus.NOT_FOUND).json({ errorMessage });
  }
}
