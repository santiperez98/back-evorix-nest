// src/users/users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    password?: string;
    name: string;
    picture?: string;
    provider?: string;
    role?: 'USER' | 'ADMIN';
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new UnauthorizedException('El correo ya está registrado');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (!data.role) {
      data.role = 'USER';
    }

    return this.prisma.user.create({ data });
  }
}