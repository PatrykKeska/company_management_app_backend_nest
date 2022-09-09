import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { AuthGuard } from '@nestjs/passport';
import { Places } from '../entities/places.entity';
import { GetPlaceById } from './interfaces/get-place-by-id';
import { NewPlaceDto } from './dto/new-place.dto';
import { NewPlaceResponse } from './interfaces/new-place-response';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { UpdatePlaceResponse } from './interfaces/update-place-response';
import { DeletePlaceResponse } from './interfaces/delete-place-response';

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
  @Post('/add-new')
  async addNewPlace(@Body() body: NewPlaceDto): Promise<NewPlaceResponse> {
    return await this.places.createNewPlace(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  async updateExistedPlace(
    @Body() place: UpdatePlaceDto,
  ): Promise<UpdatePlaceResponse> {
    return await this.places.updatePlaceValues(place);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/remove')
  async removePlace(@Body() place): Promise<DeletePlaceResponse> {
    const { id } = place;
    return await this.places.deletePlace(id);
  }
}
