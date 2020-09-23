import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/users.json'); // доступ к users.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt'); //  для хеширования пароля
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs'); // модуль для работы с файлами
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken'); // моуль для создания токенов

@Injectable()
export class UsersService {

  // регистрация
  async createUser(createUserDto): Promise<void> {
    const { name, email, enabled, password } = createUserDto;
    const id = data.length+1; // задаем последовательный уникальный id
    const token = '';
    const hash = await bcrypt.hash(password, 10);
    data.push({ id, name, email, enabled, password: hash, token });
    await this.updateData();
  }

  //авторизация
  async login(loginUserDto) {
    const { email, password } = loginUserDto; // достали body запроса
    const user = await data.find(item => item.email == email) // Ждем, пока ведется поиск по email
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
  }

  async updateUser(createUserDto, params) {
    const id = params.id;
    const { name, email, enabled, password } = createUserDto;
    const updateElement = await data.find(item => item.id == id);
    if (updateElement == undefined) {
      throw new HttpException('BAD REQUEST. Нет такого пользователя', HttpStatus.BAD_REQUEST);
    }
    const hash = await bcrypt.hash(password, 10); // хешируем измененый пароль
    this.updateArr(updateElement, { id, name, email, enabled, password:hash }); // id не будем менять
  }

  // обновить файл с данными
  private updateData() {
    const newArray = JSON.stringify(data);
    fs.writeFile('./data/users.json', newArray, (err) => {
      if (err) {
        return Promise.reject(new Error(err));
      }
    });
  }

  // обноваить массив данных
  private updateArr(element, obj) {
    const token = element.token; // токен оставляем как был
    const { id, name, email, enabled, password } = obj;
    const elementIndex = data.indexOf(element);
    const updateElement = { id, name, email, enabled, password, token };
    data.splice(elementIndex, 1, updateElement);
    this.updateData();
  }
}
