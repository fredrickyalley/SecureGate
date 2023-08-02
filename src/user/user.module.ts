import { Module } from '@nestjs/common';
import { SecureUserService } from './service/user.service';

@Module({
  providers: [SecureUserService],
  exports: [SecureUserService],
})
export class SecureUserModule {}
