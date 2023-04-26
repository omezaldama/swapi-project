import { HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from 'express';

export const TypeOrmTestingModule = (entities: any[]) => TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'test-db.sqlite',
  entities,
  dropSchema: true,
  synchronize: true,
  logging: false,
});

export const mockStatusResponse = {
  json: jest.fn((x) => x),
};

export const mockResponse: any = {
  status: jest.fn((x) => mockStatusResponse),
  json: jest.fn((x) => x),
} as unknown as Response;
