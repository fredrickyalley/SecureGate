# Authentication and Authorization Library for NestJS

[![npm version](https://badge.fury.io/js/authentication-authorization-library.svg)](https://badge.fury.io/js/authentication-authorization-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Authentication and Authorization Library is a powerful NestJS module that provides user authentication and role-based access control (RBAC) functionalities for your NestJS applications. This library is designed to save you time and effort in implementing secure user management systems, allowing you to focus on building your application's core features.

## Features

- User Authentication: Implement secure user signup, login, reset password, and forgot password functionalities.

- Role-Based Access Control (RBAC): Manage user roles and permissions with ease. Assign, revoke, and check user roles and permissions.

- User Management: Easily perform CRUD operations on user entities. Deactivate or reactivate users as needed.

## Installation

```bash
npm install securegate
```

or

```bash
yarn add securegate
```

## Getting Started

1. Import the `AuthenticationModule` and configure it in your application's main module.

```typescript
import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'securegate';

@Module({
  imports: [
    // Other modules...
    AuthenticationModule.forRoot({
      jwtSecret: 'your-secret-key',
      // Add other configuration options...
    }),
  ],
})
export class AppModule {}
```

2. Implement your `User` entity and repository, or extend the provided base entity and repository from the library.

```typescript
// user.entity.ts
import { BaseEntity } from 'securegate';

@Entity()
export class User extends BaseEntity {
  // Your user entity properties and relations...
}
```

```typescript
// user.repository.ts
import { BaseRepository } from 'securegate';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  // Your custom methods, if needed...
}
```

3. Use the library's services and decorators in your controllers to handle authentication, RBAC, and user management tasks.

## Usage

Please refer to the [documentation](https://link-to-documentation) for detailed usage instructions and examples.

## Contributing

Contributions are welcome! If you encounter any bugs, have feature requests, or want to contribute to the library, please open an issue or submit a pull request.

## License

This library is [MIT licensed](https://opensource.org/licenses/MIT), which means you can use it freely in your projects.

## Support

If you need any help or have questions, feel free to reach out to the library maintainers or check the [GitHub repository](https://github.com/your-username/authentication-authorization-library) for additional resources.

## Authors

- Your Name - [Your GitHub Profile](https://github.com/your-username)

## Acknowledgments

- [NestJS](https://nestjs.com/) community and contributors for providing an excellent framework.
- Other open-source libraries used in this project.