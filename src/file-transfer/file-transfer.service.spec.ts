import { Test, TestingModule } from '@nestjs/testing';
import { FileTransferService } from './file-transfer.service';

describe('FileTransferService', () => {
  let service: FileTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileTransferService],
    }).compile();

    service = module.get<FileTransferService>(FileTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
