import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common'; // почему здесь надо импортировать body? - потому что все используемые декараторы надо импортировать
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/users.json'); // доступ к users.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt'); //  для хеширования пароля
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs'); // модуль для работы с файлами
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken'); // моуль для создания токенов

class CreateUserDto { // это схъема пользователя
  id: number;
  name: string;
  email: string;
  enabled: boolean;
  password: string;
}

class LoginUserDto {
  email: string;
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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto; // достали body запроса

    const user = await this.findUser(email); //Ждем, пока ведется поиск по email
    if (user == undefined) { // если такого email нет, сразу выкидываем ошибку
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    const { id, name, userEmail, enabled } = user;

    const matched = await bcrypt.compare(password, user.password); // сравнивам хеши паролей
    if (!matched) { // если сравнение возвращает false, кидаем ошибку
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    // если сравнение возвращает true, создаем токен и записываем его в поля пользователя
    const token = jwt.sign({ id: user.id }, 'token-key', { expiresIn: 3600 * 4 });
    user.token = token;
    this.updateArr(user, { id, name, userEmail, enabled, password, token });
    return `Успешная Авторизация. Ваш токен: ${token}`;
  }

  // находит пользователя с указанным id и передает его методу, который обновляет массив данных
  @Put(':id')
  async updateUser(@Param() params, @Body() createUserDto: CreateUserDto) {
    const userId = params.id;
    const { id, name, email, enabled, password } = createUserDto;
    const updateElement = await data.find(item => item.id == userId);
    if (updateElement == undefined) {
      throw new HttpException('BAD REQUEST. Нет такого пользователя', HttpStatus.BAD_REQUEST);
    }
    this.updateArr(updateElement, { id, name, email, enabled, password });
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

  private updateArr(element, obj) {
    const token = element.token; // токен оставляем как был
    const { id, name, email, enabled, password } = obj;
    const elementIndex = data.indexOf(element);
    const updateElement = { id, name, email, enabled, password, token };
    data.splice(elementIndex, 1, updateElement);
    this.updateData();
  }

  private async findUser(email) {
    return Promise.resolve(data.find(item => item.email == email));
  }

}
