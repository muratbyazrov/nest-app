import { Body, Controller, Get, Post } from '@nestjs/common'; // почему здесь надо импортировать body? - потому что все используемые декараторы надо импортировать
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/users.json'); // доступ к users.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt'); //  для хеширования пароля
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs'); // модуль для работы с файлами

class CreateUserDto { // это схъема пользователя
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  password: string;
}


@Controller('users')
export class UsersController {

  @Get() // отдать всех пользователей
  findAllUsers() {
    return data;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) { // передается сюда, но не понятно как точно работает
    const { id, name, email, enabled, password } = createUserDto;
    const token = '';
    const hash = await bcrypt.hash(password, 10);
    data.push({ id, name, email, enabled, password: hash, token });
    await this.updateData();
    return 'Регистрация успешна';
  }

  // записывает массив данных в user.json
  private async updateData() {
    const newArray = JSON.stringify(data);
    fs.writeFile('./data/users.json', newArray, (err) => {
      if (err) {
        return Promise.reject(new Error(err));
      }
    });
  }

}
