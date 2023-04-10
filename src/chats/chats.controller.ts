import { Controller, Get, Query, UseGuards, Response, Request, Param } from '@nestjs/common';
import { AuthGuard } from 'src/lib/jwt.verify';
import { ChatsService } from './chats.service';
import { Http, Case } from 'src/common.interface';
import { Response as Responses } from 'express';
import { ObjectId } from 'bson';

@Controller('chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService
    ) {}

    @UseGuards(AuthGuard)
    @Get('')
    async chatList(
        @Request() req: any,
        @Response() res: Responses,
        // @Query() query: { search: string },
    ) {
        let user_id = null;
        try {
            user_id = new ObjectId(req.user.sub);
        } catch {
            return Http({ res, http: Case.UserNotFound });
        }
        // const search = query.search?query.search:''; // search not yet implemented!
        const result = await this.chatsService.chatHistory(user_id);
        return Http({
            res,
            http: Case.Success,
            data: result,
        });
    }


    @UseGuards(AuthGuard)
    @Get('/:id')
    async chatHistory(
        @Request() req: any,
        @Response() res: Responses,
        @Param('id') id: string,
        // @Query() query: { search: string },
    ) {
        let user_id = null;
        let cluster_id = null;
        try {
            cluster_id = new ObjectId(id);
            user_id = new ObjectId(req.user.sub);
        } catch {
            return Http({ res, http: Case.CommonError, data:[] });
        }
        // const search = query.search?query.search:''; // search not yet implemented!
        const result = await this.chatsService.chatInternalHistory(cluster_id,user_id);
        return Http({
            res,
            http: Case.Success,
            data: result,
        });
    }
}
