import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import LocalAuthGuard from './auth/auth.guard';
import { UserId } from './common/decorator/user.decorator';

@Controller()
@UseGuards(LocalAuthGuard)
export class AppController {
    constructor(private service : AppService) { }

    @Get('/app')
    getHello(@UserId() userId: number) {
        return this.service.getApplication(userId)
    }
}
