import { JwtService } from '@nestjs/jwt';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket
} from '@nestjs/websockets';
import { ObjectId } from 'bson';
import { Server, Socket } from 'socket.io';
import { TOKEN_SECRET } from 'src/lib/globalConstant';
import { v4 as uuidv4 } from 'uuid';
import { ChatsService } from './chats.service';
import { ParsedUrlQuery } from 'querystring';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly chatsService: ChatsService,
        private jwtService: JwtService
    ) {}
    @WebSocketServer()
    server: Server;

    pool = {
        id:null,
        room:null,
        user:null
    };

    async handshakeHelper(data:ParsedUrlQuery):Promise<{id:ObjectId,jwt:{sub:string,username:string}}|null>{
        try{
            var target = null
            var owned = null
            var jwt = {
                sub:null,
                username:null
            }
            try {
                target = new ObjectId(data.target as undefined as string);
                const user = data.jwt as undefined as string;
                jwt = this.jwtService.verify(user, {
                    secret: TOKEN_SECRET,
                });
                owned = new ObjectId(jwt.sub);
            }catch(e){
                throw e
            }
            const cluster_room = await this.chatsService.chatTarget(target, owned);
            return {
                id:new ObjectId(cluster_room),
                jwt:jwt
            };
        }catch(e){
            return null;
        }
    }
    /**
     * 
     * format connection 
     * ```
     * dom:port?target=room_id&jwt=token
     * ```
     */
    async handleConnection(client: Socket) {
        const data = client.handshake.query;
        try{
            const cluster_room = (await this.handshakeHelper(data)).id;
            if(cluster_room === null){
                throw "Room not found";
            }
            client.join(cluster_room.toHexString());
        }catch(e){
            console.log(e)
            client.disconnect(true);
        }
    }

    /**
     * 
     * payload
     * ```
     * {
     *  "message":"hello",
     *  "image":"uploaded_image_name.png"
     * }
     * ```
     */
    @SubscribeMessage('message')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: any
    ) {
        const data = client.handshake.query;
        try{
            const user = client.handshake.query.jwt as undefined as string;
            this.jwtService.verify(user, {secret: TOKEN_SECRET})
            if(!body.message){
                throw "You must send message";
            }
            const cluster_room = await this.handshakeHelper(data);
            if(cluster_room.id === null){
                throw "Room not found";
            }
            await this.chatsService.saveChat(
                cluster_room.id,
                body.message,
                new ObjectId(cluster_room.jwt.sub)
            ); 
            return {...body,user_id:cluster_room.jwt.sub};
        }catch(e){
            client.emit('error', `${e}`);
        }
    }

    @SubscribeMessage('events.typing')
    handleEvent(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: string,
    ): string {
        return 'typing';
    }

    handleDisconnect(client: Socket) {
        client.leave(this.pool.room);
        client.disconnect(true)
    }
}
