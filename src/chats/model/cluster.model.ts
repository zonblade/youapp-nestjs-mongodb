import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Document } from 'mongoose';

@Schema({ collection: 'chat_cluster' })
export class ChatCluster {
    @Prop()
    _id: ObjectId;
    
    @Prop()
    occupient: ObjectId[];
}

export type ChatClusterDocument = ChatCluster & Document;
export const ChatClusterSchema = SchemaFactory.createForClass(ChatCluster);
