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
  UsePipes
} from '@nestjs/common';
import { SecureAuthService } from '../services/auth.service';
import { LoginDto, ResetPasswordDto, ForgotPasswordDto, SignupDto, userAuthSchema, forgotPasswordSchema, resetPasswordSchema } from '../dto/user.dto';
import { Auth } from '../decorators/auth.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RbacAuthGuard } from 'rbac/guard/rbac.guard';
import { Roles } from 'rbac/decorator/role.decorator';
import { Permissions } from 'rbac/decorator/permission.decorator';
import { SecureUserService } from 'user/service/user.service';
import { SecureRbacService } from 'rbac/service/rbac.service';
import { CreateUserDto, UpdateUserDto } from 'user/dto/user.dto';
import { RoleDto, PermissionDto, AssignRoleToUserDto,AssignPermissionToRoleDto, RoleIdDto, roleSchema } from 'rbac/dto/permission-role.dto';
import { ZodValidationPipe } from 'auth/common/zod-validation-pipe';
import { User } from '@prisma/client';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: SecureAuthService,
    private userService: SecureUserService,
    private rbacService: SecureRbacService,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(userAuthSchema))
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
  @UsePipes(new ZodValidationPipe(userAuthSchema))
  signup(@Body() signUpDto: SignupDto): Promise<User> {
    const { email, password } = signUpDto;
    try {
      return this.authService.signup(email, password);
    }catch(error) {
      throw new HttpException(error.message, 500)
    }
  }

  @ApiBearerAuth()
  @Auth('user', 'admin')
  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const { userId, oldPassword, newPassword } = resetPasswordDto;
      return this.authService.resetPassword(userId, oldPassword, newPassword);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
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
  @UsePipes(new ZodValidationPipe(roleSchema))
  async createRoles(@Body() roleDto: RoleDto) {
    try {
      return this.rbacService.createRole(roleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('permissions-to-roles')
  // @Roles('admin')
  // @Permissions('write')
  // @UseGuards(RbacAuthGuard)
  async assignPermissionToRole(@Body() assignPermissionToRoleDto: AssignPermissionToRoleDto) {
    try {
      return this.rbacService.asignPermissionToRole(assignPermissionToRoleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('update-permissions-to-roles')
  @Roles('admin')
  @Permissions('write')
  @UseGuards(RbacAuthGuard)
  async updatePermissionToRole(@Body() updatePermissionsToRolesDto: AssignPermissionToRoleDto) {
    try {
      return this.rbacService.updatePermissionsToRoles(updatePermissionsToRolesDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('remove-permissions-to-roles')
  @Roles('admin')
  @Permissions('write')
  @UseGuards(RbacAuthGuard)
  async RemovePermissionFromRole(@Body() removePermissionFromRoleDto: AssignPermissionToRoleDto) {
    try {
      return this.rbacService.removePermissionFromRole(removePermissionFromRoleDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put(':id')
  @UseGuards(RbacAuthGuard)
  @Roles('admin')
  @Permissions('write')
  @UsePipes(new ZodValidationPipe(roleSchema))
  async updateRole(
    @Body() updateRoleDto: RoleDto,
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

  @Post('undelete-role')
  @UseGuards(RbacAuthGuard)
  @Roles('admin')
  @Permissions('write')
  async undeleteRole(@Body() roleDto: RoleIdDto) {
    const { roleId} = roleDto
    try {
      return this.rbacService.undeleteRole(roleId);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('assign-role')
  // @UseGuards(RbacAuthGuard)
  // @Roles('admin')
  // @Permissions('write')
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
  async revokeRoleOfUser(@Body() revokeRoleOfUser: AssignRoleToUserDto) {
    try {
      return this.rbacService.revokeRoleOfUser(revokeRoleOfUser);
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
  async createPermission(@Body() permissionDto: PermissionDto) {
    try {
      return this.rbacService.createPermission(permissionDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  @UseGuards(RbacAuthGuard)
  @Roles('admin')
  @Permissions('write')
  async updatePermission(
    @Body() permissionDto: PermissionDto,
    @Param('id', ParseIntPipe) permissionId: number,
  ) {
    try {
      return this.rbacService.updatePermission(
        permissionId,
        permissionDto,
      );
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
