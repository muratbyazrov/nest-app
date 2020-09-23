import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require('multer'); // подключили модуль для работы с загрузкой-выгрузкой фалов
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { base64encode, base64decode } = require('nodejs-base64'); // для сохранения файлов в формате base64


const storageConfig = multer.diskStorage({ // конфигурация загружаемого файла
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, base64encode(file.originalname));
  },
});


@Injectable()
export class UploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    // multer({storage: storageConfig}).single("")
    console.log('req')
    multer({dest:"uploads"}).single("");
    next();
  }
}
