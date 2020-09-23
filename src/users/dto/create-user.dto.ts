export class CreateUserDto { // схема body при регистрации
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  password: string;
}

export class LoginUserDto { // схема body при авторизации
  email: string;
  password: string;
}
