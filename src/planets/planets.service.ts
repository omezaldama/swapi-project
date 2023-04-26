import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from './planet.entity';
import { SwapiService } from '../swapi/swapi.service';
import { SwapiPlanet, PaginatedPlanets } from './planets.types';

@Injectable()
export class PlanetsService {
  private swapiService: SwapiService;

  constructor(
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
  ) {
    this.swapiService = new SwapiService();
  }

  public buildPlanet(swapiPlanet: SwapiPlanet): Planet {
    const planet = new Planet();
    planet.climate = swapiPlanet.climate;
    planet.diameter = swapiPlanet.diameter === 'unknown' ? null : parseFloat(swapiPlanet.diameter);
    planet.gravity = swapiPlanet.gravity;
    planet.name = swapiPlanet.name;
    planet.population = swapiPlanet.population === 'unknown' ? null : parseInt(swapiPlanet.population);
    planet.terrain = swapiPlanet.terrain;
    planet.url = swapiPlanet.url;
    return planet;
  }

  public async getPaginatedPlanets(page: number): Promise<PaginatedPlanets> {
    const pageQueryPromises = await this.swapiService.buildPageQueryPromises('planets', page);
    const swapiPlanets = await this.swapiService.getResourcesFromQueryPromises<SwapiPlanet>(
      pageQueryPromises
    );
    const planets = swapiPlanets.map((swapiPlanet) => this.buildPlanet(swapiPlanet));
    return {
      count: planets.length,
      planets,
    };
  }

  public async getPlanetBySwapiIdFromDb(planetSwapiId: number): Promise<Planet | null> {
    return this.planetRepository.findOneBy({ externalId: planetSwapiId });
  }

  public async getPlanetBySwapiIdFromSwapi(swapiPlanetId: number): Promise<Planet | null> {
    const swapiPlanet = await this.swapiService.getPlanetById(swapiPlanetId);
    if (swapiPlanet !== null) {
      const planet = this.buildPlanet(swapiPlanet);
      planet.externalId = swapiPlanetId;
      return planet;
    }
    return null;
  }

  public async savePlanet(planet: Planet): Promise<Planet> {
    return this.planetRepository.save(planet);
  }

  public async getPlanetBySwapiId(swapiPlanetId: number): Promise<Planet | null> {
    const planetFromDb = await this.getPlanetBySwapiIdFromDb(swapiPlanetId);
    if (planetFromDb !== null) {
      console.info(`Got planet from database. Planet id: ${planetFromDb.id}`);
      return planetFromDb;
    }
    const planetFromSwapi = await this.getPlanetBySwapiIdFromSwapi(swapiPlanetId);
    if (planetFromSwapi !== null) {
      console.info(`Got planet from Swapi. Swapi planet id: ${swapiPlanetId}`);
      await this.savePlanet(planetFromSwapi);
      return planetFromSwapi;
    }
    return null;
  }
}
