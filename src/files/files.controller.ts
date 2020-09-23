import { Controller, Get, NestMiddleware, Injectable, Post } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires


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

@Controller('files')
export class FilesController {
  @Get()
  async upload() {
    console.log('скачать из сервера')
  }

  @Post()
  async download() {
    console.log('загрузить на сервер')
    // multer({storage: storageConfig}).single("")
   
  }
}
