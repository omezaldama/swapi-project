import { Controller, Get, Post, Query, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { Response } from 'express';
import { PeopleService } from './people.service';
import { isPositiveInteger } from '../common/validations';
import { CreatePersonDto } from './people.validations';

@ApiTags('People')
@Controller('api/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  async getPaginatedPeople(
    @Query('page') page: string,
    @Res() response: Response,
  ) {
    if (!isPositiveInteger(page)) {
      const errorMessage = `Not a valid page number: ${page}`;
      console.error(errorMessage);
      return response.status(HttpStatus.BAD_REQUEST).json({ errorMessage });
    }
    const people = await this.peopleService.getPaginatedPeople(parseInt(page));
    return response.json(people);
  }

  @Get(':id')
  async getPersonById(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    if (!isPositiveInteger(id)) {
      const errorMessage = `Not a valid person id: ${id}`;
      console.error(errorMessage);
      return response.status(HttpStatus.BAD_REQUEST).json({ errorMessage });
    }
    const person = await this.peopleService.getPersonBySwapiId(parseInt(id));
    if (person !== null) return response.json(person);
    const errorMessage = `Could not get person with id ${id}`;
    console.info(errorMessage);
    return response.status(HttpStatus.NOT_FOUND).json({ errorMessage });
  }

  @Post()
  async createPerson(
    @Body() createPersonDto: CreatePersonDto,
    @Res() response: Response,
  ) {
    try {
      const person = await this.peopleService.createPerson(createPersonDto);
      return response.status(HttpStatus.OK).json(person);
    }
    catch (error: any) {
      console.error(error.message);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}
