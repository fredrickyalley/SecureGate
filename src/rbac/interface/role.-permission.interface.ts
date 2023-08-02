/**
 * Interface representing a role in the application with its associated permissions.
 *
 * @interface
 */
export interface Role {
  /**
   * The name of the role.
   *
   * @property
   * @type {string}
   */
  name: string;

  /**
   * An array of permissions associated with the role.
   *
   * @property
   * @type {string[]}
   */
  permissions: string[];
}

/**
 * Interface representing a Permission in the system.
 */
export interface Permission {
  /**
   * The unique identifier of the permission.
   */
  id: number;

  /**
   * The name of the permission.
   */
  name: string;

  // Add any other properties related to permissions, if needed
}
