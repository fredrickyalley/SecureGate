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

## Table of Contents
- [Installation](#installation)
- [Authentication Module](#authentication-module)
  - [Usage](#usage)
  - [API Reference](#api-reference)
- [RBAC Module](#rbac-module)
  - [Usage](#usage-1)
  - [API Reference](#api-reference-1)
- [User Module](#user-module)
  - [Usage](#usage-2)
  - [API Reference](#api-reference-2)
- [Documentation](#documentation)
- [License](#license)
- [Support](#Support)
- [Author](#Authors)
- [Acknowledgments](#Acknowledgments)



## Installation

To use the Secure Gates library in your NestJS application, follow these steps:

1. Install the library via npm or yarn:

```bash
npm install securegates

# or

yarn add securegates
```

2. Import the required modules and services into your application's main module:

In the user's `app.module`, you would need to import and configure the modules provided by the SecureGates library. Let's assume that the SecureGates library is installed as a dependency and you have access to the modules exported by the library. Here's how the user's `app.module.ts` would look like:

```typescript
import { Module } from '@nestjs/common';
import { SecureAuthModule, DatabaseModule, MailModule, SecureGateModule } from 'securegates';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Import the SecureAuthModule to enable authentication functionalities
    SecureAuthModule.forRoot({
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      // Other authentication configuration options if needed
    }),
    // Import the DatabaseModule to enable database connectivity
    DatabaseModule.forRoot({
      // PrismaClient options for the database connection
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Add your user-defined Prisma models here if needed
      // models: {
      //   User: {
      //     // Model configuration
      //   },
      // },
    }),
    // Import other user-defined modules if needed
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [], // Add your controllers here
  providers: [], // Add your providers here
})
export class AppModule {}
```

Explanation:

1. We import the necessary modules from the SecureGates library: `SecureAuthModule`, and `DatabaseModule`.

2. We configure each module using the `.forRoot()` method and provide the required options based on our application's needs. For example, we configure the `SecureAuthModule` with JWT secret and expiration, the `DatabaseModule` with the database URL etc.

3. We import other user-defined modules as needed. In this example, we import the `ConfigModule` from NestJS to handle configuration options.

4. We add any user-defined controllers and providers if needed.

By importing and configuring these modules in the `app.module.ts`, the user's application will have access to the authentication functionalities provided by the `SecureAuthModule`, and database connectivity via the `PrismaService` from the `DatabaseModule`,. This ensures that the SecureGates library seamlessly integrates into the user's NestJS application, providing all the necessary features for secure authentication and user management.

## Usage

## Authentication Module

The Authentication Module handles user authentication and JWT token generation. It provides endpoints for login, signup, password reset, and token validation.

### Usage

To use the Authentication Module in your NestJS application, follow these steps:

1. Import the `SecureAuthModule` in your application's root module:

```typescript
import { Module } from '@nestjs/common';
import { SecureAuthModule } from 'securegates';

@Module({
  imports: [SecureAuthModule.forRoot({
    // Configure your JWT options here
    jwt: {
      secret: 'your-secret-key',
      expiresIn: '1d',
    },
    // Other configuration options
  })],
})
export class AppModule {}
```

2. Add the authentication guards to your controllers or routes that require authentication:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'securegates';

@Controller('private')
export class PrivateController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getPrivateData() {
    return { message: 'This is private data!' };
  }
}
```

### API Reference

The Authentication Module provides the following endpoints:

- `/auth/login` - POST: Authenticate a user and generate a JWT token.
- `/auth/signup` - POST: Register a new user with an email and password.
- `/auth/forgot-password` - POST: Initiate the password reset process for a user.
- `/auth/reset-password/:token` - POST: Reset the password for a user using a token received via email.

## RBAC Module

The RBAC (Role-Based Access Control) Module allows you to manage user roles and permissions. It provides endpoints for creating and assigning roles, managing permissions, and checking user access.

### Usage

To use the RBAC Module in your NestJS application, follow these steps:

1. Import the `SecureRbacModule` in your application's root module:

```typescript
import { Module } from '@nestjs/common';
import { SecureRbacModule } from 'securegates';

@Module({
  imports: [SecureRbacModule],
})
export class AppModule {}
```

2. Use the provided decorators in your controllers or services to enforce role-based access control:

```typescript
import { Controller, Get } from '@nestjs/common';
import {  Permissions, Roles } from 'securegates';

@Controller('private')
@Roles('admin')
export class PrivateController {
  @Get()
  @Permissions('read')
  getPrivateData() {
    return { message: 'This is private data!' };
  }
}
```

### API Reference

The RBAC Module provides the following decorators:

- `@Roles('role')`: Specifies the roles required to access the endpoint. You can specify multiple roles as arguments.
- `@Permissions('permission')`: Specifies the permissions required to access the endpoint. You can specify multiple permissions as arguments.

## User Module

The User Module provides user management functionalities, such as creating, updating, and deleting users.

### Usage

To use the User Module in your NestJS application, follow these steps:

1. Import the `SecureUserModule` in your application's root module:

```typescript
import { Module } from '@nestjs/common';
import { SecureUserModule } from 'securegates';

@Module({
  imports: [SecureUserModule],
})
export class AppModule {}
```

2. Use the provided service to manage users in your controllers or services:

```typescript
import { Controller, Get } from '@nestjs/common';
import { SecureUserService } from 'securegates';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: SecureUserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }
}
```

### API Reference

The User Module provides the `SecureUserService` service with methods to interact with user data:

- `getUsers()`: Get a list of all users.
- `findUserByEmail(email: string)`: Find a user by their email.
- `getUserById(id: number)`: Find a user by their ID.
- `createUser(createUserDto: CreateUserDto)`: Create a new user.
- `updateUser(id: number, updateUserDto: UpdateUserDto)`: Update an existing user.
- `deleteUser(id: number)`: Delete a user by their ID.
- `deactivateUser(id: number)`: Deactivate a user by their ID.
- `reactivateUser(id: number)`: Reactivate a deactivated user by their ID.


## Documentation

Check out the [full documentation](https://fredrickyalley.github.io/SecureGate/docs/index.html) for detailed information about the Auth module, services, and more.

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