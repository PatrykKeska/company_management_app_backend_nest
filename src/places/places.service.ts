import { Inject, Injectable } from '@nestjs/common';
import { Places, PlaceStatus } from '../entities/places.entity';
import { NewPlaceDto } from './dto/new-place.dto';
import { NewPlaceResponse } from './interfaces/new-place-response';
import { UpdatePlaceResponse } from './interfaces/update-place-response';
import { DeletePlaceResponse } from './interfaces/delete-place-response';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ProductInPlaces } from '../entities/product_in_places.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PlacesService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}
  async deletePlace(id): Promise<DeletePlaceResponse> {
    // @TODO Keep that in mind You can't remove a row since there is a relation table which gonna use this rows. Handle it by using enum to manage state and if there is no place in middle table just remove it !
    const data = await this.dataSource
      .getRepository(ProductInPlaces)
      .createQueryBuilder('placesInProducts')
      .leftJoinAndSelect('placesInProducts.places', 'places')
      .where('places.id = :id', { id })
      .getOne();
    const isExist = await Places.findOne({
      where: { id },
    });
    if (!isExist) {
      return {
        isSuccess: false,
        message: `there is no such a place!`,
      };
    } else {
      // await Places.delete(id);
      return {
        isSuccess: true,
        message: `place ${id} has been removed`,
      };
    }
  }

  async getAllPlaces(): Promise<Places[]> {
    return await Places.find();
  }

  async getPlaceByID(id: string): Promise<Places> | null {
    return await Places.findOne({ where: { id } });
  }

  async updatePlaceValues(place: UpdatePlaceDto): Promise<UpdatePlaceResponse> {
    const { id, name, city, street, buildNumber, img } = place;
    const placeToUpdate = await Places.findOne({ where: { id } });

    if (placeToUpdate) {
      placeToUpdate.name = name;
      placeToUpdate.city = city;
      placeToUpdate.street = street;
      placeToUpdate.buildNumber = buildNumber;
      placeToUpdate.img = img;
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

  async createNewPlace(place: NewPlaceDto): Promise<NewPlaceResponse> {
    const { name, city, street, buildNumber, img } = place;
    if (!name || !city || !street || !buildNumber || !img) {
      return { isSuccess: false, message: 'All values are necessary!' };
    }
    if (name.length < 3) {
      return {
        isSuccess: false,
        message: `name length have to be greater than 3 and less than 20`,
      };
    }
    const isExist = await Places.findOne({ where: { name } });
    if (!isExist) {
      const newPlace = new Places();
      newPlace.name = name;
      newPlace.city = city;
      newPlace.street = street;
      newPlace.buildNumber = buildNumber;
      newPlace.img = img;
      await newPlace.save();
      return { isSuccess: true, message: `New place ${name} created!` };
    } else {
      return {
        isSuccess: false,
        message: `place name: ${name} is already exist!`,
      };
    }
  }
}
