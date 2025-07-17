import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from './../../users/users.service';
import { Prisma } from '@prisma/client'; // Importa el tipo de Prisma

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos, provider } = profile;

    let user = await this.userService.findByEmail(emails[0].value);

    if (!user) {
      user = await this.userService.createUser({
        email: emails[0].value,
        name: profile.name.givenName || profile.displayName,
        picture: photos[0].value,
        provider,
        role: 'USER', // Asigna rol por defecto
      });
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role || 'USER', // Asegura que role siempre exista
      provider,
    };

    done(null, userInfo);
  }
}