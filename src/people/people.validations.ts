import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  birth_year: string;

  @IsNotEmpty()
  eye_color: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  hair_color: string;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  homeworld: string;

  @IsNotEmpty()
  @IsNumber()
  mass: number;

  @IsNotEmpty()
  skin_color: string;

  @IsNotEmpty()
  created: string;

  @IsNotEmpty()
  edited: string;

  url: string;
}
