// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from './../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
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
    const { name, emails, photos, provider } = profile;

    let user = await this.usersService.findByEmail(emails[0].value);

    if (!user) {
      user = await this.usersService.createUser({
        email: emails[0].value,
        name: name.givenName || profile.displayName,
        picture: photos[0]?.value || null,
        provider,
        role: 'USER',
      });
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role || 'USER',
      provider: user.provider,
    };

    done(null, userInfo);
  }
}