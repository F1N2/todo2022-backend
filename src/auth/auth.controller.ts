import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async info(@Req() req) {
    const user = req.user;
    user.password = null;
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res() res) {
    const user = req.user;
    const token = this.jwtService.sign({ id: user.id });
    res.setHeader(
      'Set-Cookie',
      `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRE',
      )}`,
    );
    user.password = undefined;
    return res.send({
      ...user,
      accessToken: token,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    res.setHeader('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
    return res.sendStatus(200);
  }
}
