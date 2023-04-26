import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true })
  externalId: number;

  @Column()
  name: string;

  @Column()
  birthYear: string;

  @Column()
  eyeColor: string;

  @Column()
  gender: string;

  @Column()
  hairColor: string;

  @Column()
  height: number;

  @Column()
  homeworld: string;

  @Column()
  mass: number;

  @Column()
  skinColor: string;

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column({ nullable: true })
  url: string;
}
