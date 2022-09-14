import { Test, TestingModule } from '@nestjs/testing';
import { ProductInPlacesController } from './product-in-places.controller';

describe('ProductInPlacesController', () => {
  let controller: ProductInPlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInPlacesController],
    }).compile();

    controller = module.get<ProductInPlacesController>(ProductInPlacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
