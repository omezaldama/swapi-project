import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person } from './people.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Person]),
    ],
    controllers: [PeopleController],
    providers: [PeopleService],
})
export class PeopleModule {};
