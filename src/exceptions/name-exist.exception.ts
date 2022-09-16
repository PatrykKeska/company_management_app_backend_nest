import { HttpException, HttpStatus } from '@nestjs/common';

export class NameExistException extends HttpException {
  constructor() {
    super('Place with this name already exist!', HttpStatus.BAD_REQUEST);
  }
}
