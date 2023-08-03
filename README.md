# Authentication and Authorization Library for NestJS

[![npm version](https://badge.fury.io/js/authentication-authorization-library.svg)](https://badge.fury.io/js/authentication-authorization-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Secure Gates - NestJS Library

The **Secure Gates** library is a comprehensive and secure collection of reusable services and modules for authentication, role-based access control (RBAC), and user management in NestJS applications. This library is designed to provide robust security features and simplify the implementation of authentication and access control in your applications.

## Features

- **SecureAuthService**: Provides authentication functionalities like login, signup, password reset, and token validation using JSON Web Tokens (JWT).
- **SecureRbacService**: Implements Role-Based Access Control (RBAC) to manage user roles and permissions, allowing fine-grained control over access to resources.
- **SecureUserService**: Handles user management operations, including user creation, updating, deletion, activation, and deactivation.
- **PrismaService**: Extends PrismaClient to connect to the database securely.
- **MailService**: Sends emails, including password reset emails, to users.

## Installation

To use the Secure Gates library in your NestJS application, follow these steps:

1. Install the library via npm or yarn:

```bash
npm install securegates

# or

yarn add securegates
```

2. Import the required modules and services into your application's main module:

```typescript
import { Module } from '@nestjs/common';
import { SecureAuthService, SecureRbacService, SecureUserService, PrismaService, MailService } from 'securegates';

@Module({
  imports: [...], // Other modules
  providers: [SecureAuthService, SecureRbacService, SecureUserService, PrismaService, MailService],
  controllers: [...], // Your application's controllers
})
export class AppModule {}
```

## Usage

### Authentication (SecureAuthService)

The SecureAuthService provides the following authentication functionalities:

1. **Login**: Authenticate a user based on their email and password and return an access token upon successful authentication.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureAuthService } from 'securegates';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: SecureAuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }
}
```

2. **Signup**: Register a new user with the provided email and password.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureAuthService } from 'securegates';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: SecureAuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { email, password } = signupDto;
    return this.authService.signup(email, password);
  }
}
```

3. **Password Reset**: Initiate the "Forgot Password" flow for a user based on the provided email.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureAuthService } from 'securegates';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: SecureAuthService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    return this.authService.forgotPassword(email);
  }
}
```

### Role-Based Access Control (SecureRbacService)

The SecureRbacService provides Role-Based Access Control (RBAC) functionalities to manage user roles and permissions.

1. **Create Role**: Create a new role.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureRbacService } from 'securegates';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: SecureRbacService) {}

  @Post('create-role')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const { name, description } = createRoleDto;
    return this.rbacService.createRole(name, description);
  }
}
```

2. **Create Permission**: Create a new permission.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureRbacService } from 'securegates';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: SecureRbacService) {}

  @Post('create-permission')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const { name, description } = createPermissionDto;
    return this.rbacService.createPermission(name, description);
  }
}
```

3. **Assign Role to User**: Assign a role to a user.

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { SecureRbacService } from 'securegates';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: SecureRbacService) {}

  @Post('assign-role-to-user')
  async assignRoleToUser(@Body() assignRoleToUserDto: AssignRoleToUserDto) {
    const { userId, roleId } = assignRoleToUserDto;
    return this.rbacService.assignRoleToUser(userId, roleId);
  }
}
```

### User Management (SecureUserService)

The SecureUserService handles user management operations.

1. **Get Users**: Get all users from the database.

```typescript
import { Controller, Get } from '@nestjs/common';
import { SecureUserService } from 'securegates';

@Controller('users')
export class UserController {
  constructor(private readonly userService: SecureUserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }
}
```

2. **Update User**: Update a user's email or password.

```typescript
import { Controller, Patch, Param, Body } from '@nestjs/common';
import { SecureUserService, UpdateUserDto } from 'securegates';

@Controller('users')
export class UserController {
  constructor(private readonly userService: SecureUserService) {}

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
```

3. **Delete User**: Delete a user.

```typescript
import { Controller, Delete, Param } from '@nestjs/common';
import { SecureUserService } from 'securegates';

@Controller('users')
export class UserController {
  constructor(private readonly userService: SecureUserService) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
```

## Documentation

Check out the [full documentation](documentation/index.html) for detailed information about the Auth module, services, and more.

## Contribution

Contributions to the Secure Gates library are welcome! If you find any issues or have suggestions for improvement, feel free to open a pull request or create an issue on the repository.

## License

The Secure Gates library is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

Use the library's services and decorators in your controllers to handle authentication, RBAC, and user management tasks.


## Support

If you need any help or have questions, feel free to reach out to the library maintainers or check the [GitHub repository](https://github.com/fredrickyalley/SecureGate) for additional resources.

## Authors

- Fredrick Yalley - [Your GitHub Profile](https://github.com/yalleyfred)

## Acknowledgments

- [NestJS](https://nestjs.com/) community and contributors for providing an excellent framework.
- Other open-source libraries used in this project.