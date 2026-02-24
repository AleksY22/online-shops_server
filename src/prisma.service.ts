import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      // connectionString: process.env.DATABASE_URL as string,
      connectionString:
        'postgres://8454ec8413b5ef42a6438291dbe7a26112d7bd56fa7902f88095c2f464d037ae:sk_EwHl5uDes9pwz0t2QzEWt@db.prisma.io:5432/postgres?sslmode=require',
    });
    super({ adapter });
  }
}
