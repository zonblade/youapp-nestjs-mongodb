import { ObjectId } from 'bson';

export interface iUserPrefrences {
    horoscope: string | null;
    zodiac: string | null;
    height: number;
    weight: number;
    interest: string[];
    about: string | null;
}

export interface iUserDetail {
    id: string;
    name: string;
    username: string;
    image: iUserDetailImage[];
    prefrences: iUserPrefrences;
}

export interface iUserDetailImage {
    id: string;
    url: string;
}

export interface iUserRegister {
    id: ObjectId;
    name: string;
    username: string;
    password: string;
    image: string[];
    prefrences: iUserPrefrences;
    search: string;
}
