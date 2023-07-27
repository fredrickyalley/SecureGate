// Type definitions for securegates 0.0
// Project: https://github.com/baz/foo (Does not have to be to GitHub, but prefer linking to a source code repository rather than to a project website.)
// Definitions by: Fredrick Yalley <https://github.com/fredrickyalley>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
/// <reference types="node" />

export as namespace securegates;

/*~ If this module has methods, declare them as functions like so.
 */
export * from './auth-service-type';
export * from './rbac-service-types';
export * from './user-service.type'