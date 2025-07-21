// src/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // Registro normal
  @Post('register')
  register(@Body() body) {
    return this.authService.register(body);
  }

  // Login normal
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Perfil del usuario
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  // Inicia autenticación con Google (GET)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este método no necesita cuerpo
  }

  // Callback de Google (GET) – Ya está bien
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    const { access_token, user } = result;
    res.redirect(
      `http://localhost:3000/auth/callback?token=${access_token}&user=${encodeURIComponent(
        JSON.stringify(user),
      )}`,
    );
  }

  // Nueva ruta: Login manual con Google (POST) – 👈 Añade esta
  @Post('google/callback')
  async googleManualLogin(@Body() body: { name: string; email: string }) {
    const { name, email } = body;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser({
        email,
        name,
        provider: 'google',
        role: 'USER',
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      });
    }

    const result = await this.authService.login(user);
    return result;
  }
}