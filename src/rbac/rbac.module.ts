import { Module } from '@nestjs/common';
import { SecureRbacService } from './service/rbac.service';

@Module({
  providers: [SecureRbacService],
  exports: [SecureRbacService],
})
export class SecureRbacModule {}
