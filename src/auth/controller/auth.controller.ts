import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  HttpException,
  Param,
  ParseIntPipe,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { SecureAuthService } from '../services/auth.service';
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
import { SecureUserService } from 'src/user/service/user.service';
import { SecureRbacService } from 'src/rbac/service/rbac.service';
// import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateRoleDto } from 'src/rbac/dto/create-role.dto';
import {
  AssignRoleToUserDto,
  RevokeRoleOfUserDto,
} from 'src/rbac/dto/assign-role.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateRoleDto } from 'src/rbac/dto/update-role.dto';
import { CreatePermissionDto } from 'src/rbac/dto/create-permission.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: SecureAuthService,
    private userService: SecureUserService,
    private rbacService: SecureRbacService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      return this.authService.login({ email, password });
    } catch (error) {
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
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      return this.authService.signup(email, password);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @ApiBearerAuth()
  @Auth('user', 'admin')
  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const { email, newPassword } = resetPasswordDto;
      return this.authService.resetPassword(email, newPassword);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto;
      return this.authService.forgotPassword(email);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  /*
    Users Http actions
  */

  @Get('users')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async getUsers() {
    try {
      return this.userService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('create-user')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('user-email')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async findUserByEmail(@Query('email') email: string) {
    try {
      return this.userService.findUserByEmail(email);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  // @Get(':id')
  // @UseGuards(RbacStrategy)
  // @Roles('admin')
  // @Permissions('write')
  // async getUserById(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //         return this.userService.getUserById(id);
  //       }catch (error) {
  //         throw new HttpException(error.message, 500)
  //       }
  // }

  // @Patch(':id')
  // @UseGuards(RbacStrategy)
  // @Roles('admin')
  // @Permissions('write')
  // async updateUser(@Body() UpdateUserDto: UpdateUserDto, @Param('id', ParseIntPipe) id: number) {
  //   try {
  //         return this.userService.updateUser(id, UpdateUserDto);
  //       }catch (error) {
  //         throw new HttpException(error.message, 500)
  //       }
  // }

  // @Delete(':id')
  // @UseGuards(RbacStrategy)
  // @Roles('admin')
  // @Permissions('write')
  // async deactivateUser(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //             return this.userService.deactivateUser(id);
  //           }catch (error) {
  //             throw new HttpException(error.message, 500)
  //           }
  // }

  @Post()
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async reactivateUser(@Query('id', ParseIntPipe) id: number) {
    try {
      return this.userService.reactivateUser(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  /*
    Roles Http actions
  */

  @Post('roles')
  @Roles('admin')
  @Permissions('write')
  @UseGuards(RbacStrategy)
  async createRoles(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.rbacService.createRole(createRoleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put(':id')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id', ParseIntPipe) roleId: number,
  ) {
    try {
      return this.rbacService.updateRole(roleId, updateRoleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Delete(':id')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async deleteRole(@Param('id', ParseIntPipe) roleId: number) {
    try {
      return this.rbacService.deleteRole(roleId);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('assign-role')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async assignRoleToUser(@Body() assignRoleToUserDto: AssignRoleToUserDto) {
    try {
      return this.rbacService.assignRoleToUser(assignRoleToUserDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('revoke-role')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async revokeRoleOfUser(@Body() revokeRoleOfUser: RevokeRoleOfUserDto) {
    try {
      return this.rbacService.revokeRoleOfUser(revokeRoleOfUser);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('reassign-role')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async reassignRoleOfUser(@Body() assignRoleToUserDto: AssignRoleToUserDto) {
    try {
      return this.rbacService.reassignRoleOfUser(assignRoleToUserDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('roles')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async getRoles() {
    try {
      return this.rbacService.getRoles();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  // @Get(':id')
  // @UseGuards(RbacStrategy)
  // @Roles('admin')
  // @Permissions('write')
  // async getRoleById(@Param('id', ParseIntPipe) roleId: number) {
  //   try {
  //         return this.rbacService.getRoleById(roleId);
  //       }catch(error) {
  //         throw new HttpException(error.message, 500)
  //       }
  // }

  /*
    Permissions Http actions
  */

  @Get()
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async getPermissions() {
    try {
      return this.rbacService.getPermissions();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async getPermissionById(@Param('id', ParseIntPipe) permissionId: number) {
    try {
      return this.rbacService.getPermissionById(permissionId);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('create-permission')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      return this.rbacService.createPermission(createPermissionDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  @UseGuards(RbacStrategy)
  @Roles('admin')
  @Permissions('write')
  async updatePermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @Param('id', ParseIntPipe) permissionId: number,
  ) {
    try {
      return this.rbacService.updatePermission(
        permissionId,
        createPermissionDto,
      );
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
