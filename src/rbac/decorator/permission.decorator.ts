// rbac/decorators/permission.decorator.ts

import { SetMetadata } from '@nestjs/common';

/**
 * Custom NestJS metadata decorator for assigning permissions to a route handler or controller.
 *
 * @function
 * @param {...string[]} permissions - An array of permission strings to assign to the route handler or controller.
 * @returns {CustomDecorator<string[]>} - A custom decorator function that sets the metadata key 'permissions' with the provided permissions.
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
