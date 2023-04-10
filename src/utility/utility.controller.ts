import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Response
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Http, Case } from 'src/common.interface';
import { Uploaded } from './interface/upload.interface';
import { Response as Responses } from 'express';

@Controller('utility')
export class UtilityController {
    @Post('/file-upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'storage',
                filename: (req, file, cb) => {
                    const randomName = uuidv4();
                    return cb(
                        null,
                        `${randomName}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
    )
    async uploadFile(
        @Response() res: Responses,
        @UploadedFile() file: Uploaded
    ) {
        const result = Http({
            res,
            http: Case.Success,
            message: null,
            data: {
                originalname: file.originalname,
                filename: file.filename,
            },
        });
        return result;
    }
}
