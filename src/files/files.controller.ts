import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Controller('files')
export class FilesController {
  @Get(':id')
  async download(@Param() params,  @Res() res) {
    const fileName = params.id;
    console.timeEnd('Watcher');
    return res.sendFile(fileName, { root: path.join(__dirname, `../../uploads`) });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req: any, file: any, cb: any) => {
        // генериться имя файла
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  }))
  async ( @UploadedFile() file) {
    console.timeEnd('Watcher');
    return 'Файл загружен';
  }
}
