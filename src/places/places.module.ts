import { forwardRef, Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { FileTransferModule } from '../file-transfer/file-transfer.module';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
  imports: [forwardRef(() => FileTransferModule)],
})
export class PlacesModule {}
