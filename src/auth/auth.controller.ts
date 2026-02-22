import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';
import { type Request, type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Вход============================================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  //Регистрация======================================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  public async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  //Генерация токенов из refresh токена================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  public async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('RefreshToken not found');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      refreshTokenFromCookies,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  //Выход===============================================================
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

  //Авторизация через google============================================
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  //Перенапрвление через google==========================================
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`,
    );
  }

  //Авторизация через yandex==============================================
  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async yandexAuth(@Req() _req) {}

  //Перенапрвление через yandex============================================
  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`,
    );
  }
}
