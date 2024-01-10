import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}

    async signIn(username: string, pass: string): Promise<any> {
      const user = await this.usersService.findOne(username);
      if (user) {
        if (!compareSync(pass, user?.hashedPassword)) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.name, roles: user.roles };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      throw new UnauthorizedException();
    }
}
