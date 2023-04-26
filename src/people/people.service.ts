import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './people.entity';
import { SwapiService } from '../swapi/swapi.service';
import { SwapiPerson, PaginatedPeople } from './people.types';
import { CreatePersonDto } from './people.validations';

@Injectable()
export class PeopleService {
  private swapiService: SwapiService;

  constructor(
    @InjectRepository(Person)
    private peopleRepository: Repository<Person>,
  ) {
    this.swapiService = new SwapiService();
  }

  public buildPerson(swapiPerson: SwapiPerson): Person {
    const person = new Person();
    person.name = swapiPerson.name;
    person.birthYear = swapiPerson.birth_year;
    person.eyeColor = swapiPerson.eye_color;
    person.gender = swapiPerson.gender;
    person.hairColor = swapiPerson.hair_color;
    person.height = parseInt(swapiPerson.height);
    person.homeworld = swapiPerson.homeworld;
    person.mass = parseInt(swapiPerson.mass);
    person.skinColor = swapiPerson.skin_color;
    person.created = swapiPerson.created;
    person.edited = swapiPerson.edited;
    person.url = swapiPerson.url;
    return person;
  }

  public async getPaginatedPeople(page: number): Promise<PaginatedPeople> {
    const pageQueryPromises = await this.swapiService.buildPageQueryPromises('people', page);
    const swapiPeople = await this.swapiService.getResourcesFromQueryPromises<SwapiPerson>(
      pageQueryPromises
    );
    const people = swapiPeople.map((swapiPerson) => this.buildPerson(swapiPerson));
    return {
      count: people.length,
      people,
    };
  }

  public async getPersonBySwapiIdFromDb(personSwapiId: number): Promise<Person | null> {
    return this.peopleRepository.findOneBy({ externalId: personSwapiId });
  }

  private async getPersonBySwapiIdFromSwapi(swapiPersonId: number): Promise<Person | null> {
    const swapiPerson = await this.swapiService.getPersonById(swapiPersonId);
    if (swapiPerson !== null) {
      const person = this.buildPerson(swapiPerson);
      person.externalId = swapiPersonId;
      return person;
    }
    return null;
  }

  public async savePerson(person: Person): Promise<Person> {
    return this.peopleRepository.save(person);
  }

  public async getPersonBySwapiId(swapiPersonId: number): Promise<Person | null> {
    const personFromDb = await this.getPersonBySwapiIdFromDb(swapiPersonId);
    if (personFromDb !== null) {
      console.info(`Got person from database. Person id: ${personFromDb.id}`);
      return personFromDb;
    }
    const personFromSwapi = await this.getPersonBySwapiIdFromSwapi(swapiPersonId);
    if (personFromSwapi !== null) {
      console.info(`Got person from Swapi. Swapi person id: ${swapiPersonId}`);
      await this.savePerson(personFromSwapi);
      return personFromSwapi;
    }
    return null;
  }

  public async createPerson(personDto: CreatePersonDto): Promise<Person> {
    const swapiPerson = personDto as unknown as SwapiPerson;
    const person = this.buildPerson(swapiPerson);
    return await this.savePerson(person);
  }
}
