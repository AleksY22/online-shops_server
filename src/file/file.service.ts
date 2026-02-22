import { Injectable } from '@nestjs/common';
import path from 'app-root-path';
import fs from 'fs-extra';
import { FileResponse } from './file.interface.js';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const uploadedFolder = `${path}/uploads/${folder}`;

    await fs.ensureDir(uploadedFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;

        await fs.writeFile(`${uploadedFolder}/${originalName}`, file.buffer);

        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );

    return response;
  }
}
