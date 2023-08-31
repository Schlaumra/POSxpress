import { Reflector } from '@nestjs/core';
import { Role } from '@px/interface';

export const Roles = Reflector.createDecorator<Role[]>();
