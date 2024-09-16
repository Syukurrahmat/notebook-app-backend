import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UserId } from 'src/common/decorator/user.decorator';
import { PaginationQueryDto } from 'src/lib/dto/pagination.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';
import { UpdateContentDto } from './dto/update-content';

@Controller('notebooks/:notebookId/notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    create(
        @UserId() userId: number,
        @Param('notebookId', ParseIntPipe) notebookId: number,
    ) {
        return this.notesService.create(notebookId);
    }

    @Get('')
    async findALl(
        @UserId() userId: number,
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @Query() paginatiion: PaginationQueryDto,
    ) {
        return await this.notesService.findALl(userId, notebookId, paginatiion);
    }

    @Get(':id')
    async findOne(
        @UserId() userId: number,
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.notesService.findOne(userId, notebookId, id);
    }

    @Patch(':id')
    update(
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNoteDto: UpdateNoteDto,
        @UserId() userId: number,
    ) {
        return this.notesService.update(userId, notebookId, id, updateNoteDto);
    }

    @Delete(':id')
    remove(
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @UserId() userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.notesService.remove(userId, notebookId, id);
    }


    @Get(':id/content')
    async findContent(
        @UserId() userId: number,
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.notesService.findContent(userId, notebookId, id);
    }

    @Patch(':id/content')
    updateContent(
        @Param('notebookId', ParseIntPipe) notebookId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateContentDto,
        @UserId() userId: number,
    ) {
        return this.notesService.updateContent(userId, notebookId, id, updateDto);
    }
}
