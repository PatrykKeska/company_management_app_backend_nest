import { Test, TestingModule } from '@nestjs/testing';
import { FileTransferController } from './file-transfer.controller';

describe('FileTransferController', () => {
  let controller: FileTransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileTransferController],
    }).compile();

    controller = module.get<FileTransferController>(FileTransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
