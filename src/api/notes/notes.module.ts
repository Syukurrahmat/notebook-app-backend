import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotebooksService } from 'src/api/notebooks/notebooks.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService, PrismaService, NotebooksService],
})
export class NotesModule {}
