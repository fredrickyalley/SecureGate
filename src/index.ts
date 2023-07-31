export { SecureAuthService } from './auth/services/auth.service';
export {SecureRbacService} from './rbac/service/rbac.service';
export {SecureUserService} from './user/service/user.service';
export {MailService} from './auth/mailer/mail.service';
export {PrismaService} from './auth/prismaService/prisma.service';

export {SecureAuthModule} from './auth/auth.module';
export {DatabaseModule} from './auth/database/database.module';
export {MailModule} from './auth/mailer/mail.module';



export {Auth} from './auth/decorators/auth.decorator';
export {Permissions} from './rbac/decorator/permission.decorator';
export {Roles} from './rbac/decorator/role.decorator';

export {RbacAuthGuard} from './rbac/guard/rbac.guard';
export {JwtAuthGuard} from './auth/guards/jwt.guard';

export {AuthMiddleware} from './auth/middleware/auth.middleware';


export {Role} from './rbac/interface/role.interface';


export {SignupDto, ForgotPasswordDto, ResetPasswordDto, LoginDto} from './auth/dto/user.dto';
export {CreateRoleDto, CreatePermissionDto, AssignRoleToUserDto, RevokeRoleOfUserDto, UpdatePermissionDto, UpdateRoleDto} from './rbac/dto/permission-role.dto';
export {UpdateUserDto, CreateUserDto} from './user/dto/user.dto';
