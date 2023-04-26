import { Planet } from "./planet.entity";

export type SwapiPlanet = {
    name: string;
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
};

export type PaginatedPlanets = {
    count: number;
    planets: Planet[];
};
