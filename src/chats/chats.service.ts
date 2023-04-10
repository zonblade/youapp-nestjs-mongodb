import { Injectable } from '@nestjs/common';
import { ObjectId } from 'bson';
import { ChatClusterDocument } from './model/cluster.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessageDocument } from './model/message.model';
import { chatClusterList } from './interface/chat.interface.output';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel('ChatCluster') private readonly clusterModel: Model<ChatClusterDocument>,
        @InjectModel('ChatMessage') private readonly messageModel: Model<ChatMessageDocument>,
    ){}

    /**
     * find existing chat cluster
     * if not exist, create one!
     */
    async chatTarget(target_user_id:ObjectId, current_user_id:ObjectId):Promise<string|null>{
        const result = await this.clusterModel.findOneAndUpdate(
            {
                $or:[
                    {occupient: {$eq: [target_user_id,current_user_id]}},
                    {occupient: {$eq: [current_user_id,target_user_id]}},
                ]
            },
            {
                $set:{
                    occupient: [target_user_id, current_user_id]
                }
            },
            {
                upsert:true,
                returnDocument: 'after',
            }
        );
        if(result) {
            return (result._id as undefined as ObjectId).toHexString()
        }else{
            return null
        }
    }

    async saveChat(cluster_id:ObjectId, message:string, user_id:ObjectId) {
        console.log(typeof(cluster_id))
        const messageObject = await this.messageModel.insertMany([{
            _cluster: cluster_id,
            _sender: user_id,
            message: message,
            search: message,
        }])
        if(messageObject.length > 0) {
            return true
        } else {
            return false
        }
    }

    async chatHistory(user_id:ObjectId): Promise<chatClusterList[]> {
        const result = await this.clusterModel.aggregate([
            {$match:{
                occupient: {$all: [user_id]}
            }},
            {$addFields:{
                occupient:{
                    $first:{
                        $map:{
                            input: "$occupient",
                            in:{
                                $cond:{
                                    if: {$eq: ["$$this", user_id]},
                                    then: "$$REMOVE",
                                    else: "$$this"
                                }
                            }
                        }
                    }
                }
            }},
            {$lookup:{
                from: 'users',
                localField: 'occupient',
                foreignField: '_id',
                as: 'other_user'
            }},
            {$unwind: '$other_user'},
            {$lookup:{
                from: 'chat_message',
                localField: '_id',
                foreignField: '_cluster',
                pipeline:[
                    {$match:{
                        _sender: {$ne: user_id}
                    }},
                    {$sort:{_id:-1}},
                    {$limit:1}
                ],
                as: 'messages'
            }},
            {$project:{
                id: { $toString: '$_id' },
                username: '$other_user.username',
                name: '$other_user.name',
                image: '$other_user.image',
                last_message: {$ifNull:[{$arrayElemAt:['$messages.message',0]},'']},
                _id:0
            }}
        ]);
        return result;
    }

    async chatInternalHistory(cluster_id:ObjectId, user_id:ObjectId) {
        console.log(cluster_id)
        const result = await this.messageModel.aggregate([
            {$match:{
                _cluster: cluster_id
            }},
            {$sort:{_id:-1}},
            {$project:{
                id: { $toString: '$_id' },
                message: '$message',
                date:{$toDate:'$_id'},
                itsMe: {$cond: [{$eq: ['$_sender', user_id]}, true, false]},
                _id: 0
            }}
        ]);
        return result;
    }
}
