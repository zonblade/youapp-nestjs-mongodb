import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { UtilityModule } from './utility/utility.module';
import { MONGO_CONNECTION } from './lib/globalConstant';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forRoot(MONGO_CONNECTION, {
          dbName: 'test2',
          connectTimeoutMS: 10000,
        }),
        JwtModule.register({
          global: true,
          secret: 'secretKey',
          signOptions: { expiresIn: '30d' },
        }),
        UsersModule, 
        ChatsModule, 
        UtilityModule
    ],
})
export class AppModule {}
