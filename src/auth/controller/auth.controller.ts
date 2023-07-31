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
import { LoginDto, ResetPasswordDto, ForgotPasswordDto } from '../dto/user.dto';
import { Auth } from '../decorators/auth.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RbacAuthGuard } from 'rbac/guard/rbac.guard';
import { Roles } from 'rbac/decorator/role.decorator';
import { Permissions } from 'rbac/decorator/permission.decorator';
import { SecureUserService } from 'user/service/user.service';
import { SecureRbacService } from 'rbac/service/rbac.service';
import { CreateUserDto, UpdateUserDto } from 'user/dto/user.dto';
import { CreateRoleDto, CreatePermissionDto, UpdatePermissionDto, UpdateRoleDto, AssignRoleToUserDto, RevokeRoleOfUserDto } from 'rbac/dto/permission-role.dto';


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
      return this.authService.login(email, password);
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  // @UseGuards(RbacAuthGuard)
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
  // @UseGuards(RbacAuthGuard)
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
  // @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
  async createRoles(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.rbacService.createRole(createRoleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put(':id')
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  // @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
  @UseGuards(RbacAuthGuard)
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
