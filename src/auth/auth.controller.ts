import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user; // 👈 Asegúrate de que req.user tenga `name`, `picture`, etc.
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este método no necesita cuerpo, solo inicia la autenticación
  }

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
}