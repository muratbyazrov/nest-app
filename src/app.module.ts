import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/middlewares';

@Module({
  imports: [FilesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude({path: 'users/login', method: RequestMethod.POST}) // кроме запроса на авторизацию
      .forRoutes({path: '', method: RequestMethod.ALL}) // проверка авторизации всех запросов
  }
}
