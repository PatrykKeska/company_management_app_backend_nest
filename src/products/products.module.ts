import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FileTransferModule } from '../file-transfer/file-transfer.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
  imports: [forwardRef(() => FileTransferModule)],
})
export class ProductsModule {}
