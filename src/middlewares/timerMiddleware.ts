import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
const { performance } = require('perf_hooks');

@Injectable()
export class TimerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function){
    const start = performance.now();
    res.on("finish", () => {
      const resTime = performance.now()-start;
      console.log(resTime);
    })
    next()
  }
}
