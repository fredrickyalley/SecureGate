import { Permission, Role, User } from '@prisma/client';
import { TokenPayload } from 'auth/interfaces/auth.interface';
import { OAuthProfile } from 'auth/interfaces/user.interface';
import { LoginDto } from './auth/dto/user.dto';
import * as nodemailer from 'nodemailer'
import { AssignPermissionToRoleDto, AssignRoleToUserDto, PermissionDto, RoleDto } from './rbac/dto/permission-role.dto';
import { CreateUserDto, UpdateUserDto } from './user/dto/user.dto';

// Export Services
export declare namespace SecureGates {
class SecureAuthService {
  constructor();
  validateTokenPayload(payload: TokenPayload): Promise<User>;
  findOrCreateUserFromOAuthProfile(profile: OAuthProfile): Promise<User>;
  login(loginDto: LoginDto): Promise<{ access_token: string }>;
  signup(email: string, password: string): Promise<User>;
  resetPassword(email: string, newPassword: string): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  storeResetToken(email: string, resetToken: string, expiration: number): Promise<void>;
  sendResetPasswordEmail(email: string, resetUrl: string): Promise<void>;
  private createTransporter(): nodemailer.Transporter;
  private generateRandomString(length: number): string;
  private isPasswordStrong(password: string): boolean;
  }
  
  export class SecureRbacService {
    constructor(prisma: any);
    
    /**
    * PERMISSIONS SERVICE
    */
    
    getPermissions(): Promise<Permission[]>;
    
    createPermission(permissionDto: PermissionDto): Promise<Permission>;
    
    getPermissionById(id: number): Promise<Permission>;
    
    updatePermission(id: number, updatePermissionDto: PermissionDto): Promise<Permission>;
    
    /**
    * ROLES SERVICES
    */
    
    getRoles(): Promise<Role[]>;
    
    getRoleById(roleId: number): Promise<Role>;
    
    createRole(roleDto: RoleDto): Promise<Role>;
    
    updateRole(roleId: number, updateRoleDto: RoleDto): Promise<Role>;
    
    deleteRole(roleId: number): Promise<void>;

    undeleteRole(roleId: number): Promise<void>

    asignPermissionToRole(assignPermissionToRoleDto: AssignPermissionToRoleDto): Promise<void>

    removePermissionFromRole(removePermissionFromRoleDto: AssignPermissionToRoleDto): Promise<void>

    updatePermissionsToRoles(updatePermissionToRoleDto: AssignPermissionToRoleDto): Promise<void>
    
    assignRoleToUser(assignRoleToUser: AssignRoleToUserDto): Promise<void>;
    
    revokeRoleOfUser(revokeRoleOfUser: AssignRoleToUserDto): Promise<void>;
        
    getPermissionsForUser(userId: number): Promise<Permission[]>;
    
    hasRoles(userId: any, requiredRoles: string[]): Promise<boolean>;
    
    hasPermission(userId: number, requiredPermissions: string[]): Promise<boolean>;
}

export class SecureUserService {
  getUsers(): Promise<User[]>;
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  getUserById(id: number): Promise<User>;
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  deleteUser(id: number): Promise<User>;
  deactivateUser(id: number): Promise<void>;
  reactivateUser(id: number): Promise<void>;
  }

}

export {SecureAuthService} from './auth/services/auth.service';
export {SecureRbacService} from './rbac/service/rbac.service';
export {SecureUserService} from './user/service/user.service';
export { MailService } from './auth/mailer/mail.service';
export { PrismaService } from './auth/prismaService/prisma.service';

// Export Modules
export { SecureAuthModule } from './auth/auth.module';
export { DatabaseModule } from './auth/database/database.module';
export { MailModule } from './auth/mailer/mail.module';
export {SecureGateModule} from 'app.module';

// Export Decorators
export { Auth } from './auth/decorators/auth.decorator';
export { Permissions } from './rbac/decorator/permission.decorator';
export { Roles } from './rbac/decorator/role.decorator';

// Export Guards
export { RbacAuthGuard } from './rbac/guard/rbac.guard';
export { JwtAuthGuard } from './auth/guards/jwt.guard';

// Export Middleware
export { AuthMiddleware } from './auth/middleware/auth.middleware';

// Export Interfaces
export { Role } from './rbac/interface/role.-permission.interface';

// Export DTOs
export { SignupDto, ForgotPasswordDto, ResetPasswordDto, LoginDto } from './auth/dto/user.dto';
export {
  RoleIdDto,
  RoleDto,
  PermissionDto,
  AssignRoleToUserDto,
} from './rbac/dto/permission-role.dto';
export { UpdateUserDto, CreateUserDto } from './user/dto/user.dto';
