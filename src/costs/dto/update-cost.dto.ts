import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateCostDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}
