import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        throw new HttpException(
          '잘못된 인증 정보입니다.',
          HttpStatus.BAD_REQUEST,
        );
      user.password = undefined;
      return user;
    } catch (e) {
      throw new HttpException(
        '잘못된 인증 정보입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
