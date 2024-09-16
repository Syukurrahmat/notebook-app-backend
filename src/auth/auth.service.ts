import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findEmailAndPass(email);
        if (user && bcrypt.compareSync(pass, user.password)) {
            return { id : user.id }
        }
        return null;
    }
}
