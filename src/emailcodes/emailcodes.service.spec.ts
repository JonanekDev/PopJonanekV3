import { Test, TestingModule } from '@nestjs/testing';
import { EmailcodesService } from './emailcodes.service';

describe('EmailcodesService', () => {
  let service: EmailcodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailcodesService],
    }).compile();

    service = module.get<EmailcodesService>(EmailcodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
