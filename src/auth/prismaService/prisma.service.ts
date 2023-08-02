import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Injectable service that extends PrismaClient and provides access to the Prisma ORM.
 *
 * @class
 * @name PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit, OnModuleDestroy}
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Creates an instance of the PrismaService.
   *
   * @constructor
   * @param {Prisma.PrismaClientOptions} options - Optional configuration options for PrismaClient.
   */
  constructor(options?: Prisma.PrismaClientOptions) {
    super(options);
  }

  /**
   * Lifecycle hook that runs on application startup.
   * Connects the PrismaClient to the database.
   *
   * @async
   * @function
   * @name onModuleInit
   * @returns {Promise<void>}
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Lifecycle hook that runs on application shutdown.
   * Disconnects the PrismaClient from the database.
   *
   * @async
   * @function
   * @name onModuleDestroy
   * @returns {Promise<void>}
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

