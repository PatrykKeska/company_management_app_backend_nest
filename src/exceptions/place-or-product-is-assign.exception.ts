import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaceOrProductIsAssignException extends HttpException {
  constructor() {
    super(
      'Place or Product is already in use. You can not remove it till you stop using it',
      HttpStatus.BAD_REQUEST,
    );
  }
}
