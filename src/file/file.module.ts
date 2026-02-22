import { Module } from '@nestjs/common';
import { FileService } from './file.service.js';
import { FileController } from './file.controller.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
