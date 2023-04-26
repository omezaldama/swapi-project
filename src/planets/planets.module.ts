import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { Planet } from './planet.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Planet]),
    ],
    controllers: [PlanetsController],
    providers: [PlanetsService],
})
export class PlanetsModule {};
