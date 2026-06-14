import { Injectable, OnModuleInit } from '@nestjs/common';
// Import PrismaClient from the main package
import { PrismaClient } from '@prisma/client'; 

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }
}