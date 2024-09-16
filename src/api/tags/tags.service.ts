import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';


function getRandomItems<T>(arr: T[]) {
	// Tentukan jumlah item yang ingin diambil secara acak, dengan maksimal 3
	const itemCount = Math.floor(Math.random() * 3) + 1; // Random antara 1 dan 3
	const shuffled = arr.sort(() => 0.5 - Math.random()); // Acak urutan array
	return shuffled.slice(0, itemCount); // Ambil itemCount pertama dari array yang sudah diacak
}



@Injectable()
export class TagsService {
	private readonly resource: Prisma.TagsDelegate<DefaultArgs>

	constructor(private prisma: PrismaService) {
		this.resource = prisma.tags
	}

	async itemIsExist(userId: number, id: number) {
		const yes = await this.resource.count({ where: { id, userId: userId, } })
		if (!yes) throw new NotFoundException(`Sumber daya tidak ditemukan`);
	}

	// async create(notebookId: number) {
	// 	return await this.resource.create({ data: { notebookId }, select: { id: true } })
	// }

	async findAll(userId: number, query?: string) {
		let result = await this.resource.findMany({
			where: {
				userId,
				name: query ? { contains: query } : undefined
			},
			omit: { userId: true },
			orderBy: { Notes: { _count: 'desc' } },
			take: 20,
		})

		return result
	}

	// async findALl(userId: number, id: number, pagination: PaginationQueryDto) {
	// 	await this.notebookService.itemIsExist(userId, id)

	// 	const { paginationObj, getMetaData } = pagination

	// 	const queryOptions = {
	// 		where: { notebookId: id, isArchived: false },
	// 	}

	// 	const [total, rows] = await Promise.all([
	// 		this.prisma.notes.count({ where: queryOptions.where }),
	// 		this.prisma.notes.findMany({
	// 			...paginationObj,
	// 			...queryOptions,
	// 			omit: {
	// 				isPinned: true,
	// 				isArchived: true,
	// 			},
	// 			include: {
	// 				tags: { omit: { usersId: true } },
	// 			}
	// 		}),
	// 	])

	// 	const excerptContents: { excerpt: string, id: number }[] = []

	// 	if (rows.length) {
	// 		const excerpt: typeof excerptContents = await this.prisma.$queryRaw`
	// 			SELECT SUBSTRING(content, 1, 100) AS excerpt, id FROM Contents WHERE noteId in (${Prisma.join(rows.map(e => e.id))})
	// 		`;
	// 		excerptContents.push(...excerpt)
	// 	}

	// 	return {
	// 		rows: rows.map(e => ({
	// 			...e,
	// 			content: excerptContents.find(f => f.id == e.id)?.excerpt
	// 		})),
	// 		meta: getMetaData(pagination, total)
	// 	};
	// }


	// async findOne(userId: number, notebookId: number, id: number) {
	// 	console.log(222);

	// 	await this.itemIsExist(userId, notebookId, id)

	// 	return await this.resource
	// 		.findFirst({
	// 			where: { id, Notebook: { userId } },
	// 			omit: { notebookId: true },
	// 			include: {
	// 				Notebook: { select: { name: true, id: true } },
	// 				tags: { omit: { usersId: true } },
	// 				Contents: { select: { content: true } }
	// 			}
	// 		})
	// 		.then(({ Contents, ...e }: any) => ({
	// 			...e,
	// 			content: Contents?.content
	// 		}))

	// }

	// async update(userId: number, notebookId: number, id: number, updateNoteDto: UpdateNoteDto) {
	// 	await this.itemIsExist(userId, notebookId, id)
	// 	console.log('ejeej', updateNoteDto)
	// 	// this.resource.update({
	// 	// 	where: { id, notebookId, Notebook: { userId } },
	// 	// 	data: {
	// 	// 		tags: {
	// 	// 			connectOrCreate: [
	// 	// 				{
	// 	// 					where: { usersId: userId, id: 2 },
	// 	// 					create: { usersId: userId, name: 'sss', color: 'd' }
	// 	// 				}
	// 	// 			]
	// 	// 		}
	// 	// 	}
	// 	// })
	// 	return `This action updates a #${id} note`;
	// }

	// async remove(userId: number, notebookId: number, id: number) {
	// 	await this.itemIsExist(userId, notebookId, id)

	// 	return `This action removes a #${id} note`;
	// }
}
