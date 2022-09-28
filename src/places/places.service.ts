import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Places, PlaceStatus } from '../entities/places.entity';
import { NewPlaceDto } from './dto/new-place.dto';
import { NewPlaceResponse } from './interfaces/new-place-response';
import { UpdatePlaceResponse } from './interfaces/update-place-response';
import { DeletePlaceResponse } from './interfaces/delete-place-response';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { DataSource } from 'typeorm';
import { FileTransferService } from '../file-transfer/file-transfer.service';
import { FileTransferInterface } from '../file-transfer/interfaces/multer-disk-uploaded-files';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from '../utils/storage';
import { NameExistException } from '../exceptions/name-exist.exception';
import { PlaceProductNotExistException } from '../exceptions/place-product-not-exist.exception';
import { NeedAllValuesException } from '../exceptions/need-all-values.exception';

@Injectable()
export class PlacesService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(forwardRef(() => FileTransferService))
    private fileTransferService: FileTransferService,
  ) {}

  async deletePlace(id): Promise<DeletePlaceResponse> {
    const placeInAssign = await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('productInPlaces')
      .leftJoinAndSelect('productInPlaces.places', 'places')
      .where('places.id = :id', { id })
      .getOne();
    const isExist = await Places.findOne({
      where: { id },
    });
    if (!isExist) {
      throw new PlaceProductNotExistException();
    } else {
      if (!placeInAssign) {
        const pathTo = path.join(
          storageDir(),
          `/product-photos/${isExist.img}`,
        );
        if (isExist.img && isExist.img !== 'default-office-image.jpeg') {
          fs.unlinkSync(pathTo);
        }
        await Places.delete(id);
        return {
          isSuccess: true,
          message: `place has been removed`,
        };
      } else {
        isExist.placeStatus = PlaceStatus.NOTAVAILABLE;
        await isExist.save();
        return {
          isSuccess: false,
          message: `Since this place is used, you can't delete it straight away. Go to finalized tab and remove all connections with items then remove this place. For now, the place is marked as unavailable!`,
        };
      }
    }
  }

  async getAllPlaces(): Promise<Places[]> {
    return this.dataSource
      .getRepository(Places)
      .createQueryBuilder('places')
      .getMany();
  }

  async getPlaceByID(id: string): Promise<Places> | null {
    return await Places.findOne({ where: { id } });
  }

  async updatePlaceValues(
    place: UpdatePlaceDto,
    file: FileTransferInterface,
  ): Promise<UpdatePlaceResponse> {
    const { id, name, city, street, buildNumber } = place;
    const photo = file;
    const placeToUpdate = await Places.findOne({ where: { id } });

    if (placeToUpdate) {
      placeToUpdate.name = name;
      placeToUpdate.city = city;
      placeToUpdate.street = street;
      placeToUpdate.buildNumber = buildNumber;
      if (photo) {
        const pathTo = path.join(
          storageDir(),
          `/product-photos/${placeToUpdate.img}`,
        );
        if (
          placeToUpdate.img &&
          placeToUpdate.img !== 'default-office-image.jpeg'
        ) {
          fs.unlinkSync(pathTo);
        }
        placeToUpdate.img = photo.filename;
      }
      await placeToUpdate.save();
      return {
        isSuccess: true,
        message: `update success`,
      };
    } else {
      return {
        isSuccess: false,
        message: `there is no such a place!`,
      };
    }
  }

  async createNewPlace(
    place: NewPlaceDto,
    file: FileTransferInterface,
  ): Promise<NewPlaceResponse> {
    const { name, city, street, buildNumber } = place;
    const photo = file;
    if (!name || !city || !street || !buildNumber) {
      return { isSuccess: false, message: 'All values are necessary!' };
    }
    if (name.length < 3) {
      return {
        isSuccess: false,
        message: `name length have to be greater than 3 and less than 20`,
      };
    }
    try {
      const isExist = await Places.findOne({ where: { name } });
      if (!isExist) {
        const newPlace = new Places();
        newPlace.name = name;
        newPlace.city = city;
        newPlace.street = street;
        newPlace.buildNumber = buildNumber;
        if (photo) {
          newPlace.img = photo.filename;
        } else {
          newPlace.img = 'default-office-image.jpeg';
        }
        await newPlace.save();
        return { isSuccess: true, message: `New place ${name} created!` };
      } else {
        throw new NameExistException();
      }
    } catch (e1) {
      try {
        if (photo) {
          fs.unlinkSync(photo.path);
        }
      } catch (e2) {
        throw e2;
      }
      throw e1;
    }
  }

  async restorePlace(placeId: string) {
    if (!placeId) {
      throw new NeedAllValuesException();
    }
    const placeToRestore = await Places.findOne({
      where: { id: placeId },
    });
    if (!placeToRestore) {
      throw new PlaceProductNotExistException();
    }
    placeToRestore.placeStatus = PlaceStatus.AVAILABLE;
    await placeToRestore.save();
    return {
      isSuccess: true,
      message: `Place is now Available!`,
    };
  }

  async unAvailablePlace(placeId: string) {
    if (!placeId) {
      throw new NeedAllValuesException();
    }
    const placeToRestore = await Places.findOne({
      where: { id: placeId },
    });
    if (!placeToRestore) {
      throw new PlaceProductNotExistException();
    }
    placeToRestore.placeStatus = PlaceStatus.NOTAVAILABLE;
    await placeToRestore.save();
    return {
      isSuccess: true,
      message: `Place is now  Unavailable!`,
    };
  }
}
