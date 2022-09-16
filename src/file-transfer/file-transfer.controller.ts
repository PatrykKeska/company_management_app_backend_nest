import { Body, Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileTransferService } from './file-transfer.service';
@Controller('file-transfer')
export class FileTransferController {
  constructor(
    @Inject(FileTransferService)
    private fileTransferService: FileTransferService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/photo')
  async getPhoto(@Body() body, @Res() res: any): Promise<any> {
    const { id } = body;
    return this.fileTransferService.getPhoto(id, res);
  }
}
