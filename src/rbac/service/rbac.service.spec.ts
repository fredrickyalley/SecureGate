// import { Test, TestingModule } from '@nestjs/testing';
// import { SecureRbacService } from '../service/rbac.service';
// import { NotFoundException, HttpException } from '@nestjs/common';
// import {
//   RoleDto,
//   PermissionDto,
//   AssignRoleToUserDto,

// } from '../dto/permission-role.dto';
// import { Role, Permission } from '../interface/role.-permission.interface';
// import { PrismaService } from 'auth/prismaService/prisma.service';

// // Mock the PrismaService
// const prismaServiceMock = {
//   role: {
//     findMany: jest.fn(() => []),
//     findFirst: jest.fn(() => null),
//     create: jest.fn(() => ({})),
//     update: jest.fn(() => ({})),
//     delete: jest.fn(() => ({})),
//     findUnique: jest.fn(() => null),
//   },
//   permission: {
//     findMany: jest.fn(() => []),
//     findFirst: jest.fn(() => null),
//     create: jest.fn(() => ({})),
//     update: jest.fn(() => ({})),
//     delete: jest.fn(() => ({})),
//   },
//   user: {
//     findUnique: jest.fn(() => ({})),
//     findFirst: jest.fn(() => ({})),
//     update: jest.fn(() => ({})),
//   },
// };

// describe('SecureRbacService', () => {
//   let service: SecureRbacService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SecureRbacService,
//         {
//           provide: PrismaService,
//           useValue: prismaServiceMock,
//         },
//       ],
//     }).compile();

//     service = module.get<SecureRbacService>(SecureRbacService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getRoles', () => {
//     it('should return an empty array when no roles found', async () => {
//       const roles = await service.getRoles();
//       expect(roles).toEqual([]);
//     });
//   });

//   describe('createRole', () => {
//     it('should create a new role', async () => {
//       const RoleDto: RoleDto = {
//         name: 'test_role',
//       };

//       const createdRole = await service.createRole(RoleDto);

//       expect(createdRole).toBeDefined();
//       expect(prismaServiceMock.role.create).toHaveBeenCalledWith({
//         data: {
//           name: RoleDto.name,
//         },
//       });
//     });

//     it('should create a new role with permission connected', async () => {
//       const RoleDto: RoleDto = {
//         name: 'test_role',
//         permissionId: 1,
//       };

//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(null);
//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce({ id: 1 });

//       const createdRole = await service.createRole(RoleDto);

//       expect(createdRole).toBeDefined();
//       expect(prismaServiceMock.role.create).toHaveBeenCalledWith({
//         data: {
//           name: RoleDto.name,
//           permissions: {
//             connect: {
//               id: RoleDto.permissionId,
//             },
//           },
//         },
//       });
//     });

//     it('should throw an error if the role already exists', async () => {
//       const RoleDto: RoleDto = {
//         name: 'existing_role',
//       };

//       prismaServiceMock.role.findFirst.mockResolvedValueOnce({}); // Role already exists

//       await expect(service.createRole(RoleDto)).rejects.toThrow(HttpException);
//     });
//   });

//   describe('getRoleById', () => {
//     it('should return a role when found', async () => {
//       const roleId = 1;
//       const role = { id: roleId, name: 'test_role' };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);

//       const result = await service.getRoleById(roleId);

//       expect(result).toBeDefined();
//       expect(result).toEqual(role);
//     });

//     it('should throw a NotFoundException if role not found', async () => {
//       const roleId = 1;
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(null);

//       await expect(service.getRoleById(roleId)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('updateRole', () => {
//     it('should update a role', async () => {
//       const roleId = 1;
//       const RoleDto: RoleDto = {
//         name: 'updated_role',
//       };

//       const role = { id: roleId, name: 'test_role' };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);

//       const updatedRole = await service.updateRole(roleId, RoleDto);

//       expect(updatedRole).toBeDefined();
//       expect(updatedRole.name).toBe(RoleDto.name);
//       expect(prismaServiceMock.role.update).toHaveBeenCalledWith({
//         where: { id: roleId },
//         data: {
//           name: RoleDto.name,
//         },
//       });
//     });

//     // it('should update a role with a new permission connected', async () => {
//     //   const roleId = 1;
//     //   const RoleDto: RoleDto = {
//     //     name: 'updated_role',
//     //     permissionId: 2,
//     //   };

//     //   const role = { id: roleId, name: 'test_role', permissions: [{ id: 1 }] };
//     //   prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);
//     //   prismaServiceMock.permission.findFirst.mockResolvedValueOnce({ id: 2 });

//     //   const updatedRole = await service.updateRole(roleId, RoleDto);

//     //   expect(updatedRole).toBeDefined();
//     //   expect(updatedRole.name).toBe(RoleDto.name);
//     //   expect(updatedRole.permissions).toEqual([{ id: 1 }, { id: 2 }]);
//     //   expect(prismaServiceMock.role.update).toHaveBeenCalledWith({
//     //     where: { id: roleId },
//     //     data: {
//     //       name: RoleDto.name,
//     //       permissions: {
//     //         connect: {
//     //           id: RoleDto.permissionId,
//     //         },
//     //       },
//     //     },
//     //   });
//     // });

//     it('should throw a NotFoundException if role not found', async () => {
//       const roleId = 1;
//       const RoleDto: RoleDto = {
//         name: 'updated_role',
//       };

//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(null);

//       await expect(service.updateRole(roleId, RoleDto)).rejects.toThrow(NotFoundException);
//     });

//     it('should throw an error if permission to connect not found', async () => {
//       const roleId = 1;
//       const RoleDto: RoleDto = {
//         name: 'updated_role',
//         permissionId: 2,
//       };

//       const role = { id: roleId, name: 'test_role', permissions: [{ id: 1 }] };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);
//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce(null); // Permission not found

//       await expect(service.updateRole(roleId, RoleDto)).rejects.toThrow(HttpException);
//     });

//     it('should throw an error if permission to connect already exists', async () => {
//       const roleId = 1;
//       const RoleDto: RoleDto = {
//         name: 'updated_role',
//         permissionId: 1, // Same as existing permission
//       };

//       const role = { id: roleId, name: 'test_role', permissions: [{ id: 1 }] };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);

//       await expect(service.updateRole(roleId, RoleDto)).rejects.toThrow(HttpException);
//     });

//     it('should throw an error if the name is empty', async () => {
//       const roleId = 1;
//       const RoleDto: RoleDto = {
//         name: '',
//       };

//       const role = { id: roleId, name: 'test_role', permissions: [] };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);

//       await expect(service.updateRole(roleId, RoleDto)).rejects.toThrow(HttpException);
//     });
//   });

//   describe('deleteRole', () => {
//     it('should delete a role', async () => {
//       const roleId = 1;
//       const role = { id: roleId, name: 'test_role' };
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(role);

//       const deletedRole = await service.deleteRole(roleId);

//       expect(deletedRole).toEqual(role);
//       expect(prismaServiceMock.role.delete).toHaveBeenCalledWith({
//         where: { id: roleId },
//       });
//     });

//     it('should throw a NotFoundException if role not found', async () => {
//       const roleId = 1;
//       prismaServiceMock.role.findFirst.mockResolvedValueOnce(null);

//       await expect(service.deleteRole(roleId)).rejects.toThrow(NotFoundException);
//     });
//   });


//   describe('getPermissions', () => {
//     it('should return an empty array when no permissions found', async () => {
//       const permissions = await service.getPermissions();
//       expect(permissions).toEqual([]);
//     });
//   });

//   describe('createPermission', () => {
//     it('should create a new permission', async () => {
//       const PermissionDto: PermissionDto = {
//         name: 'test_permission',
//       };

//       const createdPermission = await service.createPermission(PermissionDto);

//       expect(createdPermission).toBeDefined();
//       expect(prismaServiceMock.permission.create).toHaveBeenCalledWith({
//         data: {
//           name: PermissionDto.name,
//         },
//       });
//     });

//     it('should throw an error if the permission already exists', async () => {
//       const PermissionDto: PermissionDto = {
//         name: 'existing_permission',
//       };

//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce({}); // Permission already exists

//       await expect(service.createPermission(PermissionDto)).rejects.toThrow(HttpException);
//     });
//   });

//   describe('getPermissionById', () => {
//     it('should return a permission when found', async () => {
//       const permissionId = 1;
//       const permission = { id: permissionId, name: 'test_permission' };
//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce(permission);

//       const result = await service.getPermissionById(permissionId);

//       expect(result).toBeDefined();
//       expect(result).toEqual(permission);
//     });

//     it('should throw a NotFoundException if permission not found', async () => {
//       const permissionId = 1;
//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce(null);

//       await expect(service.getPermissionById(permissionId)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('updatePermission', () => {
//     it('should update a permission', async () => {
//       const permissionId = 1;
//       const updatePermissionDto: UpdatePermissionDto = {
//         name: 'updated_permission',
//       };

//       const permission = { id: permissionId, name: 'test_permission' };
//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce(permission);

//       const updatedPermission = await service.updatePermission(permissionId, updatePermissionDto);

//       expect(updatedPermission).toBeDefined();
//       expect(updatedPermission.name).toBe(updatePermissionDto.name);
//       expect(prismaServiceMock.permission.update).toHaveBeenCalledWith({
//         where: { id: permissionId },
//         data: {
//           name: updatePermissionDto.name,
//         },
//       });
//     });

//     it('should throw a NotFoundException if permission not found', async () => {
//       const permissionId = 1;
//       const updatePermissionDto: UpdatePermissionDto = {
//         name: 'updated_permission',
//       };

//       prismaServiceMock.permission.findFirst.mockResolvedValueOnce(null);

//       await expect(service.updatePermission(permissionId, updatePermissionDto)).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

   
//   });
