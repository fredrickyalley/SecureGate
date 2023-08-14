import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto} from '../dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../auth/prismaService/prisma.service';
import { isNumber } from 'class-validator';
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
   * @throws {BadRequestException} - Invalid email or password, or user already exists.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    if (!email || !password) throw new BadRequestException('Invalid email or password');
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    if (user) throw new BadRequestException('User already exists');

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
    if(isNumber(parseInt(email, 10))) throw new BadRequestException(`User ${email} can't be a number`);

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
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null }, include: {roles: true} });
    if (!user) throw new NotFoundException('User not found');
    
    return user;
  }

  /**
   * Update user by ID
   * @param {number} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - User data to update.
   * @returns {Promise<User>} - The updated user.
   * @throws {BadRequestException} - Invalid email or password, or password is the same as the previous password.
   * @throws {NotFoundException} - User not found.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password } = updateUserDto;

    if ((!email && !password) || !password) throw new BadRequestException('Invalid email or password');
    const user = await this.getUserById(id);

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (verifyPassword) throw new BadRequestException('Password is the same as the previous password');

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
   * @throws {BadRequestException} - User already deactivated.
   * @throws {NotFoundException} - User not found.
   */
  async deactivateUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.deletedAt === null) {
      await this.prisma.user.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(Date.now()) },
      });
    } else {
      throw new BadRequestException('User already deactivated');
    }
  }

  /**
   * Reactivate user by ID
   * @param {number} id - The ID of the user to reactivate.
   * @throws {BadRequestException} - User already activated.
   * @throws {NotFoundException} - User not found.
   */
  async reactivateUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.deletedAt !== null) {
      await this.prisma.user.update({
        where: { id },
        data: { deletedAt: null },
      });
    } else {
      throw new BadRequestException('User already activated');
    }
  }
}
