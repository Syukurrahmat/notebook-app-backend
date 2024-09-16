import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginationQueryDto as PaginationDto } from 'src/lib/dto/pagination.dto';
import { readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { HERO_IMAGE_PATH, PUBLIC_DIR } from 'src/config/config';

@Injectable()
export class NotebooksService {
    private readonly resource: Prisma.NotebooksDelegate<DefaultArgs>
    private readonly emojiPath = '/assets/emojis/all-emojis.json'

    constructor(private prisma: PrismaService) {
        this.resource = prisma.notebooks
    }

    async create(userId: number) {
        return await this.resource.create({ data: { userId }, select: { id: true } })
    }

    async findAll(userId: number, pagination: PaginationDto): Promise<Paginated> {
        const { paginationObj, getMetaData } = pagination

        const queryOptions = {
            where: { userId },
            select: {
                id: true,
                emoji: true,
                name: true
            }
        }

        const [total, rows] = await Promise.all([
            this.resource.count({ where: queryOptions.where }),
            this.resource.findMany({
                ...paginationObj,
                ...queryOptions
            }),
        ]);

        return {
            rows,
            meta: getMetaData(pagination, total)
        };
    }

    async findOne(userId: number, id: number) {
        await this.itemIsExist(userId, id)
        return await this.resource.findUnique({ where: { userId, id } })
            .then(e => ({
                ...e,
                heroImage: e?.heroImage ? HERO_IMAGE_PATH + e.heroImage : null
            }))
    }

    async update(userId: number, id: number, updateDto: UpdateNotebookDto) {
        await this.itemIsExist(userId, id)
        const { name, description, emoji } = updateDto

        if (emoji) await this.isEmojiExist(emoji)

        return await this.resource
            .update({
                where: { userId, id },
                data: { name, description, emoji },
            })
    }

    async remove(userId: number, id: number) {
        await this.itemIsExist(userId, id)
        await this.prisma.$transaction([
            this.prisma.notes.deleteMany({
                where: { notebookId: id },
            }),
            this.resource.delete({
                where: { id },
                select: { id: true }
            }),
        ]);
    }

    async itemIsExist(userId: number, id: number, select: Prisma.NotebooksCountAggregateInputType = { id: true }) {
        const yes = await this.resource.findFirst({ where: { userId, id }, select })
        if (!yes) throw new NotFoundException(`Sumber daya tidak ditemukan`);
        return yes
    }
    private async isEmojiExist(emoji: string) {
        const isExist = await this.prisma.emoji.count({ where: { id: emoji } })
        if (!isExist) throw new BadRequestException('Emoji invalid')
    }
    private async getRandomEmoji() {
        return await this.prisma
            .$queryRaw`SELECT * FROM emoji ORDER BY RAND() LIMIT 1`
            .then((e: any) => e[0].id)
    }
}
