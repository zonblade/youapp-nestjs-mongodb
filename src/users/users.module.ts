import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './model/users.model';
import { AddressSchema } from './model/address.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'Address', schema: AddressSchema },
            // { name: 'Prefrences', schema: PrefrencesSchema },
        ]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
