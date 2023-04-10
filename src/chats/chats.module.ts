import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageSchema } from './model/message.model';
import { ChatClusterSchema } from './model/cluster.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ChatMessage', schema: ChatMessageSchema },
            { name: 'ChatCluster', schema: ChatClusterSchema },
        ]),
    ],
    controllers: [ChatsController],
    providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
