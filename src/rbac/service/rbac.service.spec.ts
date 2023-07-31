import { Test, TestingModule } from '@nestjs/testing';
import { SecureRbacService } from './rbac.service';

describe('ServiceService', () => {
  let service: SecureRbacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecureRbacService],
    }).compile();

    service = module.get<SecureRbacService>(SecureRbacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
