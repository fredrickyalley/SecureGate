import { Controller, Post, Body, UseGuards, Get, Req, Patch } from '@nestjs/common';
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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login({username, password});
  }

  @ApiBearerAuth()
  @Auth('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('signup')
  async signup( @Body() createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    return this.authService.signup(username, password);
  }

  @Auth('user', "admin")
  @Patch('reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(@GetUser() user: User, @Body() resetPasswordDto: ResetPasswordDto) {
    console.log(resetPasswordDto)
    const { username, newPassword } = resetPasswordDto;
    return this.authService.resetPassword(username, newPassword);
  }
}
