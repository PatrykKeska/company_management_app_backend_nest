import { Injectable } from '@nestjs/common';
import { Places } from '../entities/places.entity';
import { NewPlaceDto } from './dto/new-place.dto';
import { NewPlaceResponse } from './interfaces/new-place-response';
import { UpdatePlaceResponse } from './interfaces/update-place-response';
import { DeletePlaceResponse } from './interfaces/delete-place-response';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  async deletePlace(id): Promise<DeletePlaceResponse> {
    const isExist = await Places.findOne({ where: { id } });
    if (!isExist) {
      return {
        isSuccess: false,
        message: `there is no such a place!`,
      };
    } else {
      await Places.delete(id);
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
