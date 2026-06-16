import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body, Res } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import type { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  login(@Body() registerInput: RegisterDto) {
    console.log(process.env.DATABASE_URL);
    return this.authService.register(registerInput);
  }

  @Post('login')
  register(@Body() loginInput: LoginDto, @Res() res) {
    return this.authService.login(loginInput, res);
  }

  @Post('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refresh_Token = req.cookies.refresh_Token as string;
    return this.authService.logout(res, refresh_Token);
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
