import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/transformInterceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 3600000 }
        }),
    );

    app.use(passport.initialize())
    app.use(passport.session())

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.useGlobalInterceptors(new ResponseInterceptor())

    

    app.use((req, res, next) => {
        req.user = { id: 1235 }
        next()
    })

    await app.listen(3000);
}

bootstrap();