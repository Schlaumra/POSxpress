import { Reflector } from '@nestjs/core';
import { Role } from 'libs/interface';

export const Roles = Reflector.createDecorator<Role[]>();