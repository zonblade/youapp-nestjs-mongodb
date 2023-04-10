import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Document } from 'mongoose';

export class UserPrefrences extends Document {
    @Prop()
    horoscope: string;

    @Prop()
    zodiac: string;

    @Prop()
    height: string;

    @Prop()
    weight: string;

    @Prop()
    interest: string[];

    @Prop()
    about: string;
}

@Schema({ collection: 'users' })
export class User {
    @Prop()
    _id: ObjectId;

    @Prop()
    name: string;

    @Prop({ unique: true })
    username: string;

    @Prop()
    password: string;

    @Prop()
    image: string[];

    @Prop()
    email: string;

    @Prop(() => UserPrefrences)
    prefrences: UserPrefrences;

    @Prop({ index: { text: true } })
    search: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
