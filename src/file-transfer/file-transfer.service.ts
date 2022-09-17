import { Injectable } from '@nestjs/common';
import { Products } from '../entities/products.entity';
import { storageDir } from '../utils/storage';
import * as path from 'path';

@Injectable()
export class FileTransferService {
  async getPhoto(id: string, res: any) {
    try {
      const one = await Products.findOne({ where: { id } });
      if (!one) {
        throw new Error('No object found');
      }
      if (!one.img) {
        throw new Error('No photo found');
      }
      res.sendFile(one.img, {
        root: path.join(storageDir(), '/product-photos/'),
      });
    } catch (error) {
      res.json({ error });
    }
  }
}
