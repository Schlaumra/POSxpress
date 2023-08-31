import { PartialType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.shema';

export class UpdateUserDto extends PartialType(User) {}
