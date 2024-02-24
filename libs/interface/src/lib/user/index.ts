export type Role = 'admin' | 'waiter';

export interface User {
    _id?: string;
    name: string;
    hashedPassword: string;
    password?: string;
    roles: Role[];
    tags: string[];
}

export interface LoginUser {
    
}