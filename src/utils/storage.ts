import * as path from 'path';
import { diskStorage } from 'multer';
import * as mime from 'mime';
import { v4 as uuid } from 'uuid';
import e from 'express';

export function multerStorage(dest: string) {
  return diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename(
      req: e.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) {
      return callback(
        null,
        `${uuid()}.${(mime as any).getExtension(file.mimetype)}`,
      );
    },
  });
}

export function storageDir() {
  return path.join(__dirname, '../public/product-photos');
}
