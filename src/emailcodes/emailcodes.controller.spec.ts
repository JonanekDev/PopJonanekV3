import { Test, TestingModule } from '@nestjs/testing';
import { EmailcodesController } from './emailcodes.controller';

describe('EmailcodesController', () => {
  let controller: EmailcodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailcodesController],
    }).compile();

    controller = module.get<EmailcodesController>(EmailcodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
