import { Module, DynamicModule, Global } from '@nestjs/common';
import { PrismaService } from '../prismaService/prisma.service';
import { Prisma } from '@prisma/client';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {
  static forRoot(options?: Prisma.PrismaClientOptions): DynamicModule {
    const prismaServiceProvider = {
      provide: PrismaService,
      useValue: new PrismaService(options),
    };

    return {
      module: DatabaseModule,
      providers: [prismaServiceProvider],
      exports: [prismaServiceProvider],
    };
  }
}
