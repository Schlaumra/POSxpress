export const userEntityName = 'users'

export type Role = 'admin' | 'waiter';

interface BaseUser {
    name: string;
    hashedPassword: string;
    password?: string;
    roles: Role[];
    tags: string[];
}

export type ICreateUser = BaseUser
export type IUpdateUser = BaseUser

export interface IUser extends BaseUser {
    _id: string;
}

export interface LoginUser {
    
}