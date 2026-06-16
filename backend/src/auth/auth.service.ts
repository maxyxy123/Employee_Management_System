import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(registerInput: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    });
    if (user) throw new ConflictException('Email is already registered');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(registerInput.password, salt);

    const createdUser = await this.prisma.user.create({
      data: {
        name: registerInput.name,
        email: registerInput.email,
        password: hashPassword,
      },
    });

    return {
      message: 'Successfully create account',
      data: {
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        status: createdUser.status,
        createdAt: createdUser.createdAt,
      },
    };
  }

  async login(loginInput: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.status !== 'ACTIVE')
      throw new ConflictException('User is not ACTIVE');
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) throw new ConflictException('Invalid Credentials');

    //Tao Payload
    const payload = {
      sub: user.id,
      role: [user.role],
    };

    //Tao token
    const access_Token = await this.jwt.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
      },
      {
        secret: process.env.ACCESS_TOKEN,
        expiresIn: 15 * 60,
      },
    );
    const tokenId = crypto.randomUUID();
    const refresh_Token = await this.jwt.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
        jti: tokenId,
      },
      {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: 7 * 24 * 60 * 60, // 7 days, in seconds,
      },
    );

    //hashRefreshToken
    const hash_refresh_Token = await bcrypt.hash(refresh_Token, 10);

    //save hash_refresh_Token trong DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: hash_refresh_Token,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    res.cookie('access_Token', access_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_Token', refresh_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    return res.json({
      message: 'Successfully Logging In',
      user: {
        id: user?.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
  async logout(res: Response, refershToken: string) {
    if (refershToken) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const payload: {
          sub: string;
          role: string[];
          jti: string;
        } = await this.jwt.verifyAsync(refershToken, {
          secret: process.env.JWT_REFRESH_SECRET as string,
        });

        await this.prisma.refreshToken.deleteMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          where: { id: payload.jti },
        });
      } catch (error: any) {
        console.log(error);
      }
    }

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

  //Refresh token cũ hợp lệ →
  // xoá token cũ → tạo access token mới + refresh token mới
  // → lưu hash refresh token mới vào DB → set lại cookie.
  async refresh(res: Response, refreshToken: string) {
    //check xem co token hay k
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    let payload: { sub: string; role: string[]; jti: string };

    try {
      //verify refreshTOken
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    //tim Refreshtoken trog db
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: {
        id: payload.jti,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    //so sanh userId cua token trog db voi cai token lay tu request
    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token owner');
    }

    //so sanh han
    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });

      throw new UnauthorizedException('Refresh token expired');
    }

    //so sanh token tu req vs token da hash trog db
    const isMatch = await bcrypt.compare(refreshToken, storedToken.token);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //match thi tao token moi
    const newTokenId = crypto.randomUUID();

    const access_Token = await this.jwt.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: 15 * 60,
      },
    );

    const refresh_Token = await this.jwt.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
        jti: newTokenId,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: 7 * 24 * 60 * 60,
      },
    );

    //hash va luu lai vao db
    const hash_refresh_Token = await bcrypt.hash(refresh_Token, 10);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    //refresh token rotation. ca 2 phai cug xay ra 1 trog 2 fail => rollback
    await this.prisma.$transaction([
      this.prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      }),

      this.prisma.refreshToken.create({
        data: {
          id: newTokenId,
          token: hash_refresh_Token,
          userId: payload.sub,
          expiresAt,
        },
      }),
    ]);

    res.cookie('access_Token', access_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_Token', refresh_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      message: 'Successfully refreshed tokens',
    });
  }

  async getUser(req: Request, refresh_Token: string) {
    if (!refresh_Token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: { sub: string; role: string[]; jti: string };

    try {
      payload = await this.jwt.verifyAsync(refresh_Token, {
        secret: process.env.REFRESH_TOKEN,
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const savedToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
    });

    if (!savedToken) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const isTokenMatch = await bcrypt.compare(refresh_Token, savedToken.token);

    if (!isTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (savedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is inactive');
    }

    return {
      message: 'Successfully found user',
      data: user,
    };
  }
}
