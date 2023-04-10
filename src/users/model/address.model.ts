import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// not yet used! but this is good to have
// to detect nearby maybe(?)

export class TwoDSphere extends Document {
    @Prop()
    type: string;

    @Prop()
    coordinates: number[];
}

@Schema({ collection: 'user_address' })
export class Address extends Document {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    country: string;

    @Prop()
    zip: string;

    @Prop()
    phone: string;

    @Prop()
    default: boolean;

    @Prop(() => TwoDSphere)
    location: TwoDSphere;
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
