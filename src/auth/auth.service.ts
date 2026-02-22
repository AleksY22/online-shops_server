import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { UserService } from '../user/user.service.js';
import { AuthDto } from './dto/auth.dto.js';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from '../libs/utils/is-dev.util.js';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  //Вход==============================================================
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  //Регистрация=======================================================
  async register(dto: AuthDto) {
    const isExistUser = await this.userService.getByEmail(dto.email);

    if (isExistUser)
      throw new BadRequestException(
        'Пользователь с таким email уже существует!',
      );

    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  //Генерация токенов из refresh токена===========================
  async getNewTokens(refreshToken: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Невалидный токен');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userService.getById(result.id);

    if (!user) throw new NotFoundException('Пользователь не найден!');

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  //Генерация токенов===========================================
  issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }

  //Проверка существования пользователя===========================
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('Пользователь не найден!');

    const isValidPassword = await verify(user.password!, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль! Попробуйте еще раз!');
    }

    return user;
  }

  //Создание пользователя при авторизации через аккаунты==========
  async validateOAuthLogin(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    let user = await this.userService.getByEmail(req.user.email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          email: req.user.email,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          name: req.user.name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  //Добавление refresh токена в ответ============================
  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: this.configService.get('SAME_SATE'),
    });
  }

  //Удаление refresh токена======================================
  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: IS_DEV_ENV ? 'none' : 'lax',
    });
  }
}
