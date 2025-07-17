// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hacelo global así no tenés que importarlo cada vez
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
