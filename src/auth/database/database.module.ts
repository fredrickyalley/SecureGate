import { Module, DynamicModule, Global } from '@nestjs/common';
import { PrismaService } from '../prismaService/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * DatabaseModule is a global NestJS module that provides a Prisma service for working with the database.
 * It can be imported in any module to access the PrismaService and interact with the database.
 *
 * @remarks
 * This module is designed to be used globally to ensure that the same instance of PrismaService
 * is shared across the entire application, providing a single connection to the database.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {
  /**
   * Create a dynamic module for the DatabaseModule with optional Prisma client options.
   * This method is used to configure the PrismaService with custom options, if needed.
   *
   * @param {Prisma.PrismaClientOptions} options - Optional configuration options for the Prisma client.
   * @returns {DynamicModule} - A dynamic module containing the PrismaService provider.
   *
   * @example
   * // Import the DatabaseModule and provide custom options for the Prisma client.
   * DatabaseModule.forRoot({
   *   datasources: {
   *     db: {
   *       url: 'DATABASE_URL',
   *     },
   *   },
   *   models: {
   *     User: {
   *       // Custom model configuration
   *     },
   *   },
   * });
   */
  static forRoot(options?: Prisma.PrismaClientOptions): DynamicModule {
    const prismaServiceProvider = {
      provide: PrismaService,
      useValue: new PrismaService(options),
    };

    return {
      module: DatabaseModule,
      providers: [prismaServiceProvider],
      exports: [prismaServiceProvider],
    };
  }
}

