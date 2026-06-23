import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body, Res } from '@nestjs/common';
import { LoginDto } from 'src/dto/auth.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginInput: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginInput);
    res.cookie('access_Token', data.access_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_Token', data.refresh_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ message: 'Successfully Logging In', user: data.user });
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    const refresh_Token = req.cookies.refresh_Token as string;
    await this.authService.logout(refresh_Token);
    res.clearCookie('access_Token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refresh_Token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return res.status(200).json({
      message: 'Logout successfully',
    });
  }

  @Post('refresh')
  refresh(@Res() res: Response, @Req() req: Request) {
    const refresh_Token = req.cookies.refresh_Token as string;
    return this.authService.refresh(res, refresh_Token);
  }

  @Get('me')
  getUser(@Req() req: Request) {
    const refresh_Token = req.cookies.refresh_Token as string;
    return this.authService.getUser(req, refresh_Token);
  }
}
