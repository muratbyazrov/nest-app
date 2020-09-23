import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateUserDto { // схема body при регистрации
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsBoolean()
  enabled: boolean;
  @IsString()
  password: string;
}
