import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SwapiPlanet } from '../planets/planets.types';
import { SWAPI_URL, SWAPI_PLANETS_URL, SWAPI_PEOPLE_URL, SwapiResource } from '../common/swapi';
import { SwapiPerson } from 'src/people/people.types';

@Injectable()
export class SwapiService {
  private httpService: HttpService;

  constructor () {
    this.httpService = new HttpService();
  }

  public async getResourcePagePromise(baseUrl: string, page: number): Promise<AxiosResponse> {
    const params = { page: page + 1 }; // Swapi pagination starts at 1
    const swapiRequest = this.httpService.get(baseUrl, { params });
    return firstValueFrom(swapiRequest);
  }

  public async buildPageQueryPromises(
    resource: SwapiResource,
    page: number,
  ): Promise<PromiseSettledResult<any>[]> {
    const url = `${SWAPI_URL}/${resource}`;
    const paginatedQueries = [];
    for (let i=0; i<page; i++)
      paginatedQueries.push(this.getResourcePagePromise(url, i));
    const paginatedPromises = await Promise.allSettled(paginatedQueries);
    return paginatedPromises;
  }

  public async getResourcesFromQueryPromises<T>(
    pageQueryPromises: PromiseSettledResult<any>[]
  ): Promise<T[]> {
    const resources: T[] = [];
    pageQueryPromises.forEach((pagePromise) => {
      if (pagePromise.status === 'fulfilled' && pagePromise.value !== null) {
        const newResources = pagePromise.value.data.results as T[];
        resources.push(...newResources);
      }
    });
    return resources;
  }

  private async getResourceById<T>(url: string): Promise<T | null> {
    try {
      const request = this.httpService.get(url);
      const response = await firstValueFrom(request);
      return response.data as T;
    }
    catch (error: any) {
      console.error(error);
      console.info(`Could not retrieve from Swapi url: ${url}`);
      return null;
    }
  }

  public async getPlanetById(id: number): Promise<SwapiPlanet | null> {
    const url = `${SWAPI_PLANETS_URL}/${id}`;
    const swapiPlanet = await this.getResourceById<SwapiPlanet>(url);
    return swapiPlanet;
  }

  public async getPersonById(id: number): Promise<SwapiPerson | null> {
    const url = `${SWAPI_PEOPLE_URL}/${id}`;
    const swapiPerson = await this.getResourceById<SwapiPerson>(url);
    return swapiPerson;
  }
}
