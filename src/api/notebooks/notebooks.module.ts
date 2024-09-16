import { Module } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebooksController } from './notebooks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [PrismaModule],
  controllers: [NotebooksController],
  providers: [NotebooksService],
})
export class NotebooksModule {}
