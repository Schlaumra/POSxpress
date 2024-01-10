import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator'
import { Roles } from './decorators/roles.decorator';
import { Role } from 'libs/interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector, private userService: UsersService) {}

  private matchRoles(userRoles: Role[], contextRoles: Role[] | undefined): boolean {
    let matched = false
    // console.log(userRoles, contextRoles)

    matched = userRoles.includes('admin')

    if (contextRoles && userRoles.some(userRole => contextRoles.includes(userRole)))
    {
      // console.log(true)
      return true
    }
    // console.log(matched)
    return matched
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    if (!token) {
      throw new UnauthorizedException();
    }

    // console.log(roles)

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env['JWT_TOKEN'],
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    const user = request['user']
    if (!(await this.userService.findOneById(user.sub))) {
      throw new UnauthorizedException();
    }
    // console.log(user)

    return this.matchRoles(user.roles, roles);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
