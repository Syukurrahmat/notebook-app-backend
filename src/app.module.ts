import { Module } from '@nestjs/common';
import { NotebooksModule } from './api/notebooks/notebooks.module';
import { NotesModule } from './api/notes/notes.module';
import { UsersModule } from './api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { TagsModule } from './api/tags/tags.module';

@Module({
    imports: [
        UsersModule,
        NotebooksModule,
        NotesModule,
        TagsModule,
        PrismaModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})


export class AppModule { }
