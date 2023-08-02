import { Test, TestingModule } from '@nestjs/testing';
import { SecureUserService } from '../service/user.service';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { PrismaService } from 'auth/prismaService/prisma.service';

// Mock the PrismaService
const prismaServiceMock = {
  user: {
    findMany: jest.fn(() => []),
    findFirst: jest.fn(() => null),
    create: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    delete: jest.fn(() => ({})),
  },
};

describe('UserService', () => {
  let service: SecureUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecureUserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<SecureUserService>(SecureUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an empty array when no users found', async () => {
      const users = await service.getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await service.createUser(createUserDto);

      expect(createdUser).toBeDefined();
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: expect.any(String), // The password should be hashed
        },
      });
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce({}); // User already exists

      await expect(service.createUser(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user when found', async () => {
      const email = 'test@example.com';
      prismaServiceMock.user.findFirst.mockResolvedValueOnce({ email });

      const user = await service.findUserByEmail(email);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const email = 'nonexistent@example.com';
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.findUserByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com' };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      const result = await service.getUserById(userId);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.getUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'updatedpassword',
      };

      const user = { id: userId, email: 'test@example.com', password: 'oldpassword' };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      const updatedUser = await service.updateUser(userId, updateUserDto);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.email).toBe(updateUserDto.email);
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: {
          email: updateUserDto.email,
          password: expect.any(String), // The password should be hashed
        },
      });
    });

    it('should throw an error if the new password is the same as the old password', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        password: 'oldpassword',
      };

      const user = { id: userId, email: 'test@example.com', password: 'oldpassword' };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(HttpException);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'updatedpassword',
      };

      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com' };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      const deletedUser = await service.deleteUser(userId);

      expect(deletedUser).toBeDefined();
      expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', deletedAt: null };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      await service.deactivateUser(userId);

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw a HttpException if user is already deactivated', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', deletedAt: new Date() };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      await expect(service.deactivateUser(userId)).rejects.toThrow(HttpException);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.deactivateUser(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate a user', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', deletedAt: new Date() };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      await service.reactivateUser(userId);

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deletedAt: null },
      });
    });

    it('should throw a HttpException if user is already activated', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', deletedAt: null };
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(user);

      await expect(service.reactivateUser(userId)).rejects.toThrow(HttpException);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      prismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.reactivateUser(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
