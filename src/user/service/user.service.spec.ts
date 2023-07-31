import { Test, TestingModule } from '@nestjs/testing';
import { SecureUserService } from '../service/user.service';

describe('UserService', () => {
  let service: SecureUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecureUserService],
    }).compile();

    service = module.get<SecureUserService>(SecureUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
