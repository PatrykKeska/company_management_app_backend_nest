import { Controller, Get, Inject, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileTransferService } from './file-transfer.service';

@Controller('file-transfer')
export class FileTransferController {
  constructor(
    @Inject(FileTransferService)
    private fileTransferService: FileTransferService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/product-photo/:id')
  async getProductImg(@Param('id') id, @Res() res: any) {
    return this.fileTransferService.getProductPhoto(id, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/place-photo/:id')
  async getPlaceImg(@Param('id') id, @Res() res: any) {
    return this.fileTransferService.getPlacePhoto(id, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/default-product')
  async getDefaultProductImg(@Res() res: any) {
    return this.fileTransferService.getDefaultProductPhoto(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/default-place')
  async getDefaultPlaceImg(@Res() res: any) {
    return this.fileTransferService.getDefaultPlacePhoto(res);
  }
}
