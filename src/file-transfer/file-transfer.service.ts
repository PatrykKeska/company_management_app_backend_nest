import { Injectable } from '@nestjs/common';
import { Products } from '../entities/products.entity';
import { storageDir } from '../utils/storage';
import * as path from 'path';
import { Places } from '../entities/places.entity';

@Injectable()
export class FileTransferService {
  async getProductPhoto(id: string, res: any) {
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
  async getPlacePhoto(id: string, res: any) {
    try {
      const one = await Places.findOne({ where: { id: id } });
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

  async getDefaultProductPhoto(res: any) {
    try {
      res.sendFile('default-product-image.jpeg', {
        root: path.join(storageDir(), '/product-photos/'),
      });
    } catch (error) {
      res.json({ error });
    }
  }

  async getDefaultPlacePhoto(res: any) {
    try {
      res.sendFile('default-office-image.jpeg', {
        root: path.join(storageDir(), '/product-photos/'),
      });
    } catch (error) {
      res.json({ error });
    }
  }
}
