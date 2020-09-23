import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../data/users.json'); // доступ к users.json

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    const { authorization } = req.headers;
    if (authorization == undefined) {
      throw new HttpException('BAD REQUEST. В загаловке отстуствует токен', HttpStatus.BAD_REQUEST);
    }
    const reqToken = authorization.slice(7,); // получили чистый токен из загаловков
    const IsAuth = await data.find((item) => {
      return item.token == reqToken
    })
    if (IsAuth == undefined) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    next();
  }
}
