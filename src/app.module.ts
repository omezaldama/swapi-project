import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlanetsModule } from './planets/planets.module';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlanetsModule,
    PeopleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'abc123',
      database: process.env.DB_NAME || 'swapi',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
