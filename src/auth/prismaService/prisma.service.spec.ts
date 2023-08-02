import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to the database on module initialization', async () => {
    // Arrange
    const prismaConnectSpy = jest.spyOn(service, '$connect');

    // Act
    await service.onModuleInit();

    // Assert
    expect(prismaConnectSpy).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from the database on module destruction', async () => {
    // Arrange
    const prismaDisconnectSpy = jest.spyOn(service, '$disconnect');

    // Act
    await service.onModuleDestroy();

    // Assert
    expect(prismaDisconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('should extend PrismaClient', () => {
    // Assert
    expect(service instanceof PrismaClient).toBeTruthy();
  });
});
