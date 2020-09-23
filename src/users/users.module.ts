import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { FilesController } from '../files/files.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [UsersController, FilesController],
  providers: [ UsersService ],
})
export class UsersModule {}
