import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaceProductNotExistException extends HttpException {
  constructor() {
    super('Place Or Product do not exist!', HttpStatus.BAD_REQUEST);
  }
}
