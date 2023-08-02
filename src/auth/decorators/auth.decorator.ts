import { SetMetadata } from '@nestjs/common';

/**
 * Auth decorator is used to set metadata for role-based access control (RBAC) in NestJS.
 * It allows you to specify the required roles for accessing a particular route or handler.
 *
 * @param {...string[]} roles - An array of strings representing the required roles for accessing the route.
 * @returns {CustomDecorator<string[]>} - A custom decorator function that sets metadata for roles.
 *
 * @example
 * // Apply the Auth decorator to a controller or handler to require specific roles for access.
 * // This example requires the user to have 'admin' or 'moderator' role to access the route.
 * @Controller('posts')
 * export class PostsController {
 *   @Get()
 *   @Auth('admin', 'moderator')
 *   getAllPosts() {
 *     // Logic to get all posts
 *   }
 * }
 */
export const Auth = (...roles: string[]) => SetMetadata('roles', roles);

