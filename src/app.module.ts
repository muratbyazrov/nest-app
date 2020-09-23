import { Injectable, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { FilesController } from './files/files.controller';
import { UploadMiddleware } from './middlewares/middlewares';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, FilesController],
  providers: [AppService, UsersService ],
})

@Injectable()
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({path: 'files', method: RequestMethod.POST})
  }
}
