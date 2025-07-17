// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller'; // ✅ nombre correcto


import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService], // <- ESTO ES MUY IMPORTANTE
})
export class UsersModule {}
