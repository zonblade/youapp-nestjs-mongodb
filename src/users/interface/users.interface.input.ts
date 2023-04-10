import { iUserPrefrences } from './users.interface';

export interface iUserLogin {
    username: string;
    password: string;
}

export interface iUserServiceRegister {
    name: string;
    username: string;
    password: string;
    email: string;
}

export interface iUserUpdateBody {
    name?: string;
    username?: string;
    image?: string[];
    prefrences?: iUserPrefrences;
}
