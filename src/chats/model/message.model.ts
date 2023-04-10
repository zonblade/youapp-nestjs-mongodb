import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Document } from 'mongoose';

@Schema({ collection: 'chat_message' })
export class ChatMessage {
    @Prop()
    _id: ObjectId;

    @Prop()
    _cluster: ObjectId;

    @Prop()
    _sender: ObjectId;
    
    @Prop()
    message: string;

    @Prop()
    search: string;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
