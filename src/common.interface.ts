import { Response } from "express";

export interface NestHttp<T> {
    statusCode: number;
    message: string | null;
    data: T;
}

export enum Case {
    Unautorized,
    CommonError,
    Created,
    Success,
    UserNotFound,
    UserLoginFailed,
    FailedToUpdate,
    FailedToCreate,
}

export function Http<T>({
    res,
    http,
    message,
    data,
}: {
    res: Response,
    http: Case;
    message?: string | null;
    data?: T | null;
}){
    switch (http) {
        case Case.UserLoginFailed:
            return res.status(400).send({
                statusCode: 400,
                message: 'User login failed',
                data: null,
            })
        case Case.FailedToUpdate:
            return res.status(400).send({
                statusCode: 400,
                message: 'Failed to update',
                data: null,
            })
        case Case.FailedToCreate:
            return res.status(400).send({
                statusCode: 400,
                message: 'Failed to create',
                data: null,
            })
        case Case.UserNotFound:
            return res.status(404).send({
                statusCode: 404,
                message: 'User not found',
                data: null,
            })
        case Case.CommonError:
            return res.status(400).send({
                statusCode: 400,
                message: message ? message : null,
                data: data ? data : null,
            })
        case Case.Unautorized:
            return res.status(401).send({
                statusCode: 401,
                message: message ? message : null,
                data: data ? data : null,
            })
        case Case.Created:
            return res.status(201).send({
                statusCode: 201,
                message: message ? message : null,
                data: data ? data : null,
            })
        case Case.Success:
            return res.status(200).send({
                statusCode: 200,
                message: message ? message : null,
                data: data ? data : null,
            })
        default:
            return res.status(400).send({
                statusCode: 400,
                message: message ? message : null,
                data: data ? data : null,
            })
    }
}
