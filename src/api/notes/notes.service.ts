import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginationQueryDto } from 'src/lib/dto/pagination.dto';
import { NotebooksService } from 'src/api/notebooks/notebooks.service';
import { Difference, UpdateContentDto } from './dto/update-content';

@Injectable()
export class NotesService {
	private readonly contentTableName = 'contents'
	private readonly resource: Prisma.NotesDelegate<DefaultArgs>

	constructor(private prisma: PrismaService, private notebookService: NotebooksService) {
		this.resource = prisma.notes
	}

	async itemIsExist(userId: number, notebookId: number, id: number) {
		const yes = await this.resource.count({ where: { id, notebookId, Notebook: { userId } } })
		if (!yes) throw new NotFoundException(`Sumber daya tidak ditemukan`);
	}

	async create(notebookId: number) {
		const data = await this.resource.create({ data: { notebookId }, select: { id: true } })
		await this.prisma.contents.create({ data: { noteId: data.id, content: '' } })
		return data
	}

	async findALl(userId: number, id: number, pagination: PaginationQueryDto) {
		await this.notebookService.itemIsExist(userId, id)

		const { paginationObj, getMetaData } = pagination

		const queryOptions = {
			where: { notebookId: id, isArchived: false },
		}

		const [total, rows] = await Promise.all([
			this.prisma.notes.count({ where: queryOptions.where }),
			this.prisma.notes.findMany({
				...paginationObj,
				...queryOptions,
				omit: { isArchived: true },
				include: { tags: { omit: { userId: true } } },
				orderBy: [
					{ isPinned: 'desc' },
					{ updatedAt: 'desc' }
				]
			}),
		])

		const excerptContents: { excerpt: string, id: number }[] = []

		if (rows.length) {
			const excerpt: typeof excerptContents = await this.prisma.$queryRaw`
				SELECT SUBSTRING(content, 1, 100) AS excerpt, id FROM Contents WHERE noteId in (${Prisma.join(rows.map(e => e.id))})
			`;
			excerptContents.push(...excerpt)
		}

		return {
			rows: rows.map(e => ({
				...e,
				content: excerptContents.find(f => f.id == e.id)?.excerpt
			})),
			meta: getMetaData(pagination, total)
		};
	}

	async findOne(userId: number, notebookId: number, id: number) {
		await this.itemIsExist(userId, notebookId, id)

		return await this.resource
			.findFirst({
				where: { id, Notebook: { userId } },
				omit: { notebookId: true },
				include: {
					Notebook: { select: { name: true, id: true, emoji: true } },
					tags: { omit: { userId: true } },
				}
			})
	}

	async findContent(userId: number, notebookId: number, id: number) {
		await this.itemIsExist(userId, notebookId, id)
		return await this.prisma.contents.findFirst({ where: { noteId: id } })
	}

	async updateContent(userId: number, notebookId: number, id: number, { updatedContent }: UpdateContentDto) {
		await this.itemIsExist(userId, notebookId, id)
		const query = this.generateUpdateContentQuery(updatedContent!, id)
		await this.resource.update({ data: { updatedAt: new Date() }, where: { notebookId, id } })
		await this.prisma.$queryRawUnsafe(query);
	}

	async update(userId: number, notebookId: number, id: number, updateDto: UpdateNoteDto) {
		await this.itemIsExist(userId, notebookId, id)
		const { name, tags } = updateDto

		await this.resource.update({
			where: { id, notebookId, Notebook: { userId } },
			data: {
				name,
				tags: {
					set: [],
					connect: tags?.filter(e => e.id).map(e => ({ id: e.id, userId })),
					create: tags?.filter(e => !e.id).map(e => ({ userId, name: e.name! }))
				}
			}
		})

		return `This action updates a #${id} note`;
	}

	async remove(userId: number, notebookId: number, id: number) {
		await this.itemIsExist(userId, notebookId, id)

		return `This action removes a #${id} note`;
	}

	private generateUpdateContentQuery(
		difference: Difference[],
		noteId: number
	) {
		let query = `UPDATE ${this.contentTableName} SET content = CONCAT(`;
		let previousEndIndex = 0;
		const parts: string[] = [];

		if (!difference.length) throw new BadRequestException()

		difference.forEach((change) => {
			if (change.removed) {
				if (previousEndIndex < change.index!) {
					parts.push(
						`SUBSTRING(content, ${previousEndIndex + 1}, ${change.index! - previousEndIndex - 1})`
					);
				}
				previousEndIndex = change.index! + change.count! - 1;
			}
			if (change.added) {
				if (previousEndIndex < change.index!) {
					parts.push(
						`SUBSTRING(content, ${previousEndIndex + 1}, ${change.index! - previousEndIndex - 1})`
					);
				}
				parts.push(`'${change.value!}'`);
				previousEndIndex = change.index! - 1;
			}
		});

		if (previousEndIndex > 0) {
			parts.push(`SUBSTRING(content, ${previousEndIndex + 1})`);
		}

		query += parts.join(', ') + `) WHERE noteId = ${noteId};`;
		return query;
	}
}
