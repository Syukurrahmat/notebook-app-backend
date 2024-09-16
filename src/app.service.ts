import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Notes } from '@prisma/client';

@Injectable()
export class AppService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getApplication(userId: number) {
        const data = await this.prisma.users.findFirst({
            where: { id: userId },
            include: {
                NoteBooks: {
                    select: {
                        name: true, id: true, emoji: true,
                        Notes: {
                            select: { name: true, id: true, notebookId: true },
                            where: { isPinned: true }
                        }
                    },
                    orderBy: { updatedAt: 'desc' }
                },
                Tags: { omit: { userId: true } }
            },
            omit: {
                password: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!data) throw new UnprocessableEntityException()

        const { Tags, NoteBooks, ...user } = data
        const pinnedNotes: Partial<Notes>[] = []
        const notebooks = NoteBooks.map(({ Notes, ...e }) => {
            pinnedNotes.push(...Notes)
            return e
        })
        return { user, notebooks, pinnedNotes, tags : Tags }
    }
}
