// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name || 'Usuario',
      picture: user.picture || null,
      role: user.role || 'user',
      provider: user.provider || 'email',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async register(data: { email: string; password: string; name: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) throw new Error('El correo ya está registrado');

    const user = await this.usersService.createUser(data);
    return this.login(user);
  }
}