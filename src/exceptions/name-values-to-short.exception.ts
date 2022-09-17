import { HttpException, HttpStatus } from '@nestjs/common';

export class NameValuesToShortException extends HttpException {
  constructor() {
    super(
      'Name characters length have to be greater than 2',
      HttpStatus.BAD_REQUEST,
    );
  }
}
