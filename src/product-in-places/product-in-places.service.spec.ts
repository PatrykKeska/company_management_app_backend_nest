import { Test, TestingModule } from '@nestjs/testing';
import { ProductInPlacesService } from './product-in-places.service';

describe('ProductInPlacesService', () => {
  let service: ProductInPlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInPlacesService],
    }).compile();

    service = module.get<ProductInPlacesService>(ProductInPlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
