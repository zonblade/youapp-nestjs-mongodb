import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import { UserDocument } from './model/users.model';
import { FILE_SERVER, TOKEN_SECRET } from 'src/lib/globalConstant';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import {
    iUserDetail,
    iUserPrefrences,
    iUserRegister,
} from './interface/users.interface';
import { iUserServiceRegister, iUserUpdateBody } from './interface/users.interface.input';
import { JwtPayload } from 'src/lib/jwt.sign';
import { createSearchIndex } from 'src/lib/indexEngine';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async userLogin(
        username: string,
        password: string,
    ): Promise<string | null> {
        const password_hash = crypto
            .createHmac('sha512', TOKEN_SECRET)
            .update(password)
            .digest('hex');
        const result = await this.userModel.aggregate([
            {
                $match: {
                    $and: [{ username: username }, { password: password_hash }],
                },
            },
            {
                $project: {
                    id: { $toString: '$_id' },
                    name: '$name',
                    username: '$username',
                    image: '$image',
                    prefrences: '$prefrences',
                },
            },
            { $project: { _id: 0 } },
        ]);
        if (result.length > 0) {
            const jwtData: JwtPayload = {
                sub: result[0].id,
                username: result[0].username,
            };
            const jwtToken = this.jwtService.sign(jwtData, {
                secret: TOKEN_SECRET,
            });
            return jwtToken;
        } else {
            return null;
        }
    }

    async userUpdate(user_id: ObjectId, payload:iUserUpdateBody): Promise<boolean> {
        var updatedData = {};
        if (payload.name) {
            updatedData['name'] = payload.name;
        }
        if (payload.username) {
            updatedData['username'] = payload.username;
        }
        if (payload.image) {
            updatedData['image'] = payload.image;
        }
        if (payload.prefrences) {
            updatedData['prefrences'] = payload.prefrences;
        }
        const resultBefore = await this.userModel.findOneAndUpdate(
            {_id:user_id},
            {
                $set: {
                    ...updatedData,
                }
            },
            {
                returnDocument: 'after',
            }
        );
        if (!resultBefore) {
            return false;
        }
        const createIndexLucene = createSearchIndex(
            `${resultBefore.username} ${resultBefore.email} ${resultBefore.name}`,
        );
        const result = await this.userModel.updateOne({_id:user_id},{
            $set:{
                search:createIndexLucene.join(' ')
            }
        });
        if(result.modifiedCount > 0){
            return true;
        }else{
            return false;
        }
    }

    async userRegister(payload: iUserServiceRegister): Promise<string | null> {
        const password_hash = crypto
            .createHmac('sha512', TOKEN_SECRET)
            .update(payload.password)
            .digest('hex');
        const createIndexLucene = createSearchIndex(
            `${payload.username} ${payload.email} ${payload.name}`,
        );
        const userPrefrencesInit: iUserPrefrences = {
            horoscope: null,
            zodiac: null,
            height: 0,
            weight: 0,
            interest: [],
            about: null,
        };
        const userDataInit: iUserRegister = {
            id: new ObjectId(),
            name: payload.name,
            username: payload.username,
            password: password_hash,
            image: [],
            prefrences: userPrefrencesInit,
            search: createIndexLucene.join(' '),
        };
        const result = await this.userModel.insertMany([userDataInit]);
        // directly assign JWT token to user

        // returning jwt token!
        if (result.length > 0) {
            const jwtData: JwtPayload = {
                sub: result[0].id,
                username: result[0].username,
            };
            const jwtToken = this.jwtService.sign(jwtData, {
                secret: TOKEN_SECRET,
            });
            return jwtToken;
        } else {
            return null;
        }
    }

    async userList(search: string): Promise<iUserDetail[]> {
        const result = await this.userModel.aggregate([
            {
                $match: {
                    $text: {
                        $search: search,
                        $caseSensitive: false,
                        $diacriticSensitive: false,
                    },
                },
            },
            {
                $project: {
                    id: { $toString: '$_id' },
                    name: '$name',
                    username: '$username',
                    image: '$image',
                    prefrences: '$prefrences',
                },
            },
            { $project: { _id: 0 } },
        ]);
        if (result.length > 0) {
            return result;
        } else {
            return [];
        }
    }

    async userData(user_id: ObjectId): Promise<iUserDetail | null> {
        const result = await this.userModel.aggregate([
            { $match: { _id: user_id } },
            {
                $project: {
                    id: { $toString: '$_id' },
                    name: '$name',
                    username: '$username',
                    image: {
                        $map: {
                            input: '$image',
                            in: {
                                id: { $toString: '$$this' },
                                url: { $concat: [FILE_SERVER, '$$this'] },
                            },
                        },
                    },
                    prefrences: '$prefrences',
                },
            },
            { $project: { _id: 0 } },
        ]);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }
}
