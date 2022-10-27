import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { AuthGuard } from '@nestjs/passport';
import { Places } from '../entities/places.entity';
import { NewPlaceDto } from './dto/new-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FileTransferInterface } from '../file-transfer/interfaces/multer-disk-uploaded-files';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage, storageDir } from '../utils/storage';
import * as path from 'path';
import { RestorePlaceDto } from '../products/dto/restore-place.dto';
import { GetPlaceById } from '../../dist/places/interfaces/get-place-by-id';
import { PlaceResponseInterface } from './interfaces/place-response-interface';

@Controller('places')
export class PlacesController {
  constructor(
    @Inject(forwardRef(() => PlacesService)) private places: PlacesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllPlaces(): Promise<Places[]> {
    return await this.places.getAllPlaces();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/id')
  async getPlaceByID(@Body() body: GetPlaceById): Promise<Places> {
    const { id } = body;
    return await this.places.getPlaceByID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage(path.join(storageDir(), 'product-photos')),
    }),
  )
  @Post('/add-new')
  async addNewPlace(
    @Body() place: NewPlaceDto,
    @UploadedFile() file: FileTransferInterface,
  ): Promise<PlaceResponseInterface> {
    return await this.places.createNewPlace(place, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage(path.join(storageDir(), 'product-photos')),
    }),
  )
  async updateExistedPlace(
    @Body() place: UpdatePlaceDto,
    @UploadedFile() file: FileTransferInterface,
  ): Promise<PlaceResponseInterface> {
    return await this.places.updatePlaceValues(place, file);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/restore')
  async restorePlaceToUse(
    @Body() place: RestorePlaceDto,
  ): Promise<PlaceResponseInterface> {
    return await this.places.restorePlace(place.placeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/unavailable')
  async setUnAvailablePlace(
    @Body() place: RestorePlaceDto,
  ): Promise<PlaceResponseInterface> {
    return await this.places.unAvailablePlace(place.placeId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removePlace(
    @Body() place: GetPlaceById,
  ): Promise<PlaceResponseInterface> {
    const { id } = place;
    return await this.places.deletePlace(id);
  }
}
