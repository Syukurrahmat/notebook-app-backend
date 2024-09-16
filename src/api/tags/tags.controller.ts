import { Controller, Get, Query } from '@nestjs/common';
import { UserId } from 'src/common/decorator/user.decorator';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly services: TagsService) { }

    @Get('')
    findAll(
        @UserId() userId: number,
        @Query('q') query: string
    ) {
        return this.services.findAll(userId, query)
    }
}
