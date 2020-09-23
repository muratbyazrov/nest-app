import { IsString } from 'class-validator';

export class LoginUserDto { // схема body при авторизации
  @IsString()
  email: string;
  @IsString()
  password: string;
}
