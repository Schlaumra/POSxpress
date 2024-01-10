import { Role } from "libs/interface";

export class CreateUserDto {
    name: string;
    password: string;
    roles: Role[];
    tags: string[];
}
