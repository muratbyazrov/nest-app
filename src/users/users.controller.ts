import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/users.json'); // доступ к users.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'

interface IUser {
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  password: string;
}


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get() // отдать всех пользователей
  findAllUsers() {
    console.timeEnd('Watcher');
    return data;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto)
    console.timeEnd('Watcher');
    return 'Регистрация успешна';
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    await this.usersService.login(loginUserDto)
    console.timeEnd('Watcher');
    return `Успешная Авторизация.`;
  }

  @Put(':id')
  async updateUser(@Param() params, @Body() createUserDto: CreateUserDto) {
    await this.usersService.updateUser(createUserDto, params)
    console.timeEnd('Watcher');
    return 'Данные обновлены'
  }
}
