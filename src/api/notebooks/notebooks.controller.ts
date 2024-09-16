import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/common/decorator/user.decorator';
import { heroImageMulterOpt } from 'src/config/config';
import { PaginationQueryDto } from 'src/lib/dto/pagination.dto';
import LocalAuthGuard from '../../auth/auth.guard';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { NotebooksService } from './notebooks.service';

@Controller('notebooks')
@UseGuards(LocalAuthGuard)
export class NotebooksController {
    constructor(private readonly services: NotebooksService) { }

    @Post()
    create(@UserId() userId: number) {
        return this.services.create(userId)
    }

    @Get()
    async findAll(
        @Body() paginatiion: PaginationQueryDto,
        @UserId() userId: number
    ) {
        return await this.services.findAll(userId, paginatiion);
    }

    @Get(':id')
    async findOne(
        @UserId() userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.services.findOne(userId, id);
    }

    @Patch(':id')
    update(
        @UserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNotebookDto: UpdateNotebookDto,
    ) {
        return this.services.update(userId, id, updateNotebookDto)
    }

    @Delete(':id')
    remove(
        @UserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.services.remove(userId, id);
    }

    // @Patch(':id/hero-image')
    // async editHeroImage(
    //     @UserId() userId: number,
    //     @Body('emoji') emojiId: string
    // ) {

    // }

    // @Delete(':id/hero-image')
    // async deleteHeroImage(@UserId() userId: number) {

    // }



    // @Patch(':id')
    // @UseInterceptors(FileInterceptor('heroImage', heroImageMulterOpt))
    // update(
    //     @UserId() userId: number,
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() updateNotebookDto: UpdateNotebookDto,
    //     @UploadedFile(
    //         new ParseFilePipe({
    //             validators: [
    //                 new MaxFileSizeValidator({ maxSize: 5000 * 1024 }),
    //                 new FileTypeValidator({ fileType: 'image/*' }),
    //             ],
    //             fileIsRequired: false
    //         }),
    //     ) heroImage: Express.Multer.File,
    // ) {
    //     if (!heroImage && !Object.keys(updateNotebookDto).length) throw new BadRequestException()

    //     return this.services.update(userId, id, updateNotebookDto, heroImage);
    // }


}
