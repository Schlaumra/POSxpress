import { Role } from '@px/interface';

export class CreateUserDto {
  name: string;
  password: string;
  roles: Role[];
  tags: string[];
}
