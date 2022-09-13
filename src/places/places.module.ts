import { forwardRef, Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [forwardRef(() => PlacesService)],
})
export class PlacesModule {}
