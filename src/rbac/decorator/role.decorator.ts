import { SetMetadata } from '@nestjs/common';

/**
 * Custom NestJS metadata decorator for assigning roles to a route handler or controller.
 *
 * @function
 * @param {...string[]} roles - An array of role strings to assign to the route handler or controller.
 * @returns {CustomDecorator<string[]>} - A custom decorator function that sets the metadata key 'roles' with the provided roles.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
