import { Injectable, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FilesController } from './files.controller';
import { UploadMiddleware } from '../middlewares/middlewares';

@Module({
  imports: [FilesModule],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}

@Injectable()
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({path: 'files', method: RequestMethod.POST})
  }
}

