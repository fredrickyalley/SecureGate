import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto} from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecureUserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({where: {deletedAt: null}});
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {email, password} = createUserDto;
    if(!email && !password) throw new HttpException('Invalid email or password', 400)
    const user = await this.prisma.user.findFirst({where: {email, deletedAt: null}});

    if(user) throw new HttpException('User already exists', 400);

    const saltpounds = 10;
    const hashPassword = await bcrypt.hash(password, saltpounds)

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashPassword,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    const user =  await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    if(!user) throw new NotFoundException('User not found')

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const {email, password} = updateUserDto;

    if((!email && !password) || !password) throw new HttpException('Invalid email or password', 400)
    const user = await this.getUserById(id);

    const verifyPassword = await bcrypt.compare(password, user.password);

    if(verifyPassword) throw new HttpException('Password is same as previous password', 400)

    const saltpounds = 10;
    const hashPassword = await bcrypt.hash(password, saltpounds)

    return await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: {email, password: hashPassword},
    });
  }

  async deleteUser(id: number): Promise<User> {
    
    await this.getUserById(id);
  
    return await this.prisma.user.delete({
      where: { id, deletedAt: null },
    });
  }

  async deactivateUser(id: number): Promise<void> {

    const user = await this.prisma.user.findFirst({where: { id}});
    if (!user) throw new NotFoundException('User not found');

  if(user.deletedAt ===  null) {
      await this.prisma.user.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(Date.now())}
      });
    }else {
      throw new HttpException('User already deactivated', 400)
    }
    
  }

  async reactivateUser(id: number): Promise<void> {
    console.log(id)
    const user = await this.prisma.user.findFirst({where: { id}});
    if (!user) throw new NotFoundException('User not found')

    if(user.deletedAt !== null) {
        await this.prisma.user.update({
          where: { id },
          data: { deletedAt: null}
        });
     }else {
      throw new HttpException('User already activated', 400)
     }

    
  }
}
