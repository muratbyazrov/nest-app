import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';

@Module({
  imports: [FilesModule],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}

