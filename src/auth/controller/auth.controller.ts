import { Controller, Post, Body, UseGuards, Get, Req, Patch, HttpException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../decorators/auth.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { RbacStrategy } from 'src/rbac/strategies/rbac.strategy';
import { Roles } from 'src/rbac/decorator/role.decorator';
import { Permissions } from 'src/rbac/decorator/permission.decorator';
import { UserService } from 'src/user/service/user.service';
import { RbacService } from 'src/rbac/service/rbac.service';
// import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private userService: UserService, 
    private rbacService: RbacService
    ) {}

  @ApiBearerAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      return this.authService.login({email, password});
    }catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @ApiBearerAuth()
  @Auth('admin', 'user')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('signup')
  async signup( @Body() createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      return this.authService.signup(email, password);
    }catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Auth('user', "admin")
  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
   try {
    const { email, newPassword } = resetPasswordDto;
    return this.authService.resetPassword(email, newPassword);
   }catch (error) {
      throw new HttpException(error.message, 500);
   }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const {email} = forgotPasswordDto;
      return this.authService.forgotPassword(email);
    }catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  @Get()
  @UseGuards(RbacStrategy)
  @Roles('user') 
  @Permissions('write') 
  async exampleRoute(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
