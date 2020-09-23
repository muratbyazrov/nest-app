export class CreateUserDto { // схема body при регистрации
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  password: string;
}
