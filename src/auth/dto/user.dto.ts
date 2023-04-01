import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, {
    message: 'Пароль должен быть не менее 5 символов',
  })
  password: string;
}
