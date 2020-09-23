import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TimerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function){
    console.time('Watcher')
    next()
  }
}
