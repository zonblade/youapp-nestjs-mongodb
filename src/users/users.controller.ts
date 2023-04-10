import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/lib/jwt.verify';
import { UsersService } from './users.service';
import { ObjectId } from 'bson';
import { Http, Case } from 'src/common.interface';
import {
    iUserLogin,
    iUserServiceRegister,
    iUserUpdateBody,
} from './interface/users.interface.input';
import { Response as Responses } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    @UseGuards(AuthGuard)
    @Get('')
    async userList(
        @Response() res: Responses,
        @Query() query: { search: string },
    ) {
        console.log(query)
        const search = query.search?query.search:'';
        const result = await this.usersService.userList(search);
        return Http({
            res,
            http: Case.Success,
            data: result,
        });
    }

    @Post('/register')
    async userRegister(
        @Response() res: Responses,
        @Body() body: iUserServiceRegister,
    ) {
        const result = await this.usersService.userRegister(body);
        if (result) {
            return Http({
                res,
                http: Case.Created,
                data: {
                    token: result,
                },
            });
        } else {
            return Http({ res, http: Case.CommonError });
        }
    }

    @Post('/login')
    async userLoggedin(
        @Response() res: Responses,
        @Body() body: iUserLogin,
    ){
        const result = await this.usersService.userLogin(
            body.username,
            body.password,
        );
        if (result) {
            return Http({
                res,
                http: Case.Success,
                data: {
                    token: result,
                },
            });
        } else {
            return Http({res, http: Case.UserLoginFailed });
        }
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async userDetail(
        @Response() res: Responses,
        @Param() param: { id: string },
    ) {
        let user_id = null;
        try {
            user_id = new ObjectId(param.id);
        } catch {
            return Http({ res, http: Case.UserNotFound });
        }
        const result = await this.usersService.userData(user_id);
        if (result) {
            return Http({
                res,
                http: Case.Success,
                data: result,
            });
        } else {
            return Http({ res, http: Case.UserNotFound });
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    async userUpdate(
        @Request() req: any,
        @Response() res: Responses,
        @Body() body: iUserUpdateBody,
    ){
        let user_id = null;
        try {
            user_id = new ObjectId(req.user.sub);
        } catch {
            return Http({ res, http: Case.UserNotFound });
        }

        const result = await this.usersService.userUpdate(user_id, body);
        if(result){
            return Http({ res, http: Case.Success });
        }else{
            return Http({ res, http: Case.FailedToUpdate });
        }
    }
}
