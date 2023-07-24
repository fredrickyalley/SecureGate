import { Controller, Post, Body, UseGuards, Get, Req, Patch, HttpException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../decorators/auth.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;
      return this.authService.login({username, password});
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
      const { username, password } = createUserDto;
      return this.authService.signup(username, password);
    }catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Auth('user', "admin")
  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
   try {
    const { username, newPassword } = resetPasswordDto;
    return this.authService.resetPassword(username, newPassword);
   }catch (error) {
      throw new HttpException(error.message, 500);
   }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const {username} = forgotPasswordDto;
      return this.authService.forgotPassword(username);
    }catch (error) {
      throw new HttpException(error.message, 500)
    }
  }
}
