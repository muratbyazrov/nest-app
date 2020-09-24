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
    const id = data.length + 1; // задаем последовательный уникальный id
    const token = '';
    const hash = await bcrypt.hash(password, 10);
    data.push({ id, name, email, enabled, password: hash, token });
    await this.updateData();
  }

  //авторизация
  async login(loginUserDto) {
    const { email, password } = loginUserDto; // достали body запроса
    const user = await data.find(item => item.email == email); // Ждем, пока ведется поиск по email
    if (user == undefined) { // если такого email нет, сразу выкидываем ошибку
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const matched = await bcrypt.compare(password, user.password); // сравнивам хеши паролей
    if (!matched) { // если сравнение возвращает false, кидаем ошибку
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    // если сравнение возвращает true, создаем токен и записываем его в user
    const token = jwt.sign({ id: user.id }, 'token-key', { expiresIn: 3600 * 4 });
    user.token = token;
    this.updateArr(user);
  }

  async updateUser(createUserDto, params) {
    const id = params.id;
    const { name, email, enabled, password } = createUserDto;
    const updateElement = await data.find(item => item.id == id);
    if (updateElement == undefined) {
      throw new HttpException('BAD REQUEST. Нет такого пользователя', HttpStatus.BAD_REQUEST);
    }
    const hash = await bcrypt.hash(password, 10); // хешируем измененый пароль
    const token = jwt.sign({ id }, 'token-key', { expiresIn: 3600 * 4 });
    this.updateArr({ id, name, email, enabled, password: hash, token }); // id не будем менять
  }

  // обновить массив данных
  private async updateArr(obj) {
    const updatingElement = await data.find(item => item.id == obj.id); // найдем обновляемый элемнт
    const elementIndex = data.indexOf(updatingElement); // определяем индекс обновляемого элемента
    data.splice(elementIndex, 1, obj); // начиная с elementIndex удаляем 1 элемент и вставляем obj
    this.updateData(); // обновляем данные в файле
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
}
