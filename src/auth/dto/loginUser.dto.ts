import { IsNotEmpty, IsString } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // _id: string;
}
