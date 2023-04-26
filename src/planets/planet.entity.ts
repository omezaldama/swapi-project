import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  externalId: number;

  @Column()
  climate: string;

  @Column('decimal', { nullable: true })
  diameter: number;

  @Column()
  gravity: string;

  @Column()
  name: string;

  @Column('bigint', { nullable: true })
  population: number;

  @Column()
  terrain: string;

  @Column()
  url: string;
}
