import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  birth_year: string;

  @ApiProperty()
  @IsNotEmpty()
  eye_color: string;

  @ApiProperty()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  hair_color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  homeworld: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  mass: number;

  @ApiProperty()
  @IsNotEmpty()
  skin_color: string;

  @ApiProperty()
  @IsNotEmpty()
  created: string;

  @ApiProperty()
  @IsNotEmpty()
  edited: string;

  @ApiProperty()
  url: string;
}
