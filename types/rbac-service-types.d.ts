
    import {Permission} from './permission.type'
    import { Role } from './role.type';
    
    
    
    export  class SecureRbacService {
    constructor(prisma: any);
    
    /**
    * PERMISSIONS SERVICE
    */
    
    getPermissions(): Promise<Permission[]>;
    
    createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission>;
    
    getPermissionById(id: number): Promise<Permission>;
    
    updatePermission(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission>;
    
    /**
    * ROLES SERVICES
    */
    
    getRoles(): Promise<Role[]>;
    
    getRoleById(roleId: number): Promise<Role>;
    
    createRole(createRoleDto: CreateRoleDto): Promise<Role>;
    
    updateRole(roleId: number, updateRoleDto: UpdateRoleDto): Promise<Role>;
    
    deleteRole(roleId: number): Promise<void>;
    
    assignRoleToUser(assignRoleToUser: AssignRoleToUserDto): Promise<void>;
    
    revokeRoleOfUser(revokeRoleOfUser: RevokeRoleOfUserDto): Promise<void>;
    
    reassignRoleOfUser(assignRoleToUserDto: AssignRoleToUserDto): Promise<void>;
    
    getPermissionsForUser(userId: number): Promise<Permission[]>;
    
    hasRoles(userId: any, requiredRoles: string[]): Promise<boolean>;
    
    hasPermission(userId: number, requiredPermissions: string[]): Promise<boolean>;
    }
    
    export class CreatePermissionDto {
    name: string;
    }
    
    export class UpdatePermissionDto {
    name: string;
    }
    
    export class CreateRoleDto {
    name: string;
    permissionId?: number;
    }
    
    export class UpdateRoleDto {
    name: string;
    permissionId?: number;
    }
    
    export class AssignRoleToUserDto {
    userId: number;
    roleId: number;
    }
    
    export class RevokeRoleOfUserDto {
    userId: number;
    roleId: number;
    }