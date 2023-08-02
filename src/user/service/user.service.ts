import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto} from '../dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../auth/prismaService/prisma.service';
@Injectable()
export class SecureUserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all users
   * @returns {Promise<User[]>} - A list of all active users.
   */
  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto - User data to create.
   * @returns {Promise<User>} - The newly created user.
   * @throws {HttpException} - Invalid email or password, or user already exists.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    if (!email || !password) throw new HttpException('Invalid email or password', 400);
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    if (user) throw new HttpException('User already exists', 400);

    const saltpounds = 10;
    const hashPassword = await bcrypt.hash(password, saltpounds);

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashPassword,
      },
    });
  }

  /**
   * Find user by email
   * @param {string} email - The email of the user to find.
   * @returns {Promise<User>} - The requested user.
   * @throws {NotFoundException} - User not found.
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  /**
   * Get user by ID
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<User>} - The requested user.
   * @throws {NotFoundException} - User not found.
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Update user by ID
   * @param {number} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - User data to update.
   * @returns {Promise<User>} - The updated user.
   * @throws {HttpException} - Invalid email or password, or password is the same as the previous password.
   * @throws {NotFoundException} - User not found.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password } = updateUserDto;

    if ((!email && !password) || !password) throw new HttpException('Invalid email or password', 400);
    const user = await this.getUserById(id);

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (verifyPassword) throw new HttpException('Password is the same as the previous password', 400);

    const saltpounds = 10;
    const hashPassword = await bcrypt.hash(password, saltpounds);

    return await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { email, password: hashPassword },
    });
  }

  /**
   * Delete user by ID
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<User>} - The deleted user.
   * @throws {NotFoundException} - User not found.
   */
  async deleteUser(id: number): Promise<User> {
    await this.getUserById(id);

    return await this.prisma.user.delete({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Deactivate user by ID
   * @param {number} id - The ID of the user to deactivate.
   * @throws {HttpException} - User already deactivated.
   * @throws {NotFoundException} - User not found.
   */
  async deactivateUser(id: number): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.deletedAt === null) {
      await this.prisma.user.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(Date.now()) },
      });
    } else {
      throw new HttpException('User already deactivated', 400);
    }
  }

  /**
   * Reactivate user by ID
   * @param {number} id - The ID of the user to reactivate.
   * @throws {HttpException} - User already activated.
   * @throws {NotFoundException} - User not found.
   */
  async reactivateUser(id: number): Promise<void> {
    console.log(id);
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.deletedAt !== null) {
      await this.prisma.user.update({
        where: { id },
        data: { deletedAt: null },
      });
    } else {
      throw new HttpException('User already activated', 400);
    }
  }
}
