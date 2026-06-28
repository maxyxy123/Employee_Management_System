import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    getUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login success and return response', async () => {
      const loginInput = {
        email: 'test@gmail.com',
        password: 'test1234',
      };
      const serviceResult = {
        access_Token: 'access_token',
        refresh_Token: 'refresh_token',
        user: {
          id: 'userId',
          name: 'Minh',
          email: 'test@gmail.com',
          role: 'EMPLOYEE',
        },
      };

      const cookieMock = jest.fn();
      const jsonMock = jest.fn();

      const mockRes = {
        cookie: cookieMock,
        json: jsonMock,
      } as unknown as Response;

      mockAuthService.login.mockResolvedValue(serviceResult);

      await controller.login(loginInput, mockRes);

      //dat 2 token vao cookie
      expect(cookieMock).toHaveBeenNthCalledWith(
        1,
        'access_Token',
        'access_token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000,
        },
      );
      expect(cookieMock).toHaveBeenNthCalledWith(
        2,
        'refresh_Token',
        'refresh_token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );

      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Successfully Logging In',
        user: {
          id: 'userId',
          name: 'Minh',
          email: 'test@gmail.com',
          role: 'EMPLOYEE',
        },
      });
    });
  });

  describe('logout', () => {
    type RequestWithCookies = Request & {
      cookies: {
        refresh_Token?: string;
        access_Token?: string;
      };
    };
    it('should logout success', async () => {
      const mockReq = {
        cookies: {
          refresh_Token: 'fake-refresh-token',
        },
      } as unknown as RequestWithCookies;

      const clearCookieMock = jest.fn();
      const statusMock = jest.fn();
      const jsonMock = jest.fn();

      const mockRes = {
        clearCookie: clearCookieMock,
        status: statusMock,
        json: jsonMock,
      } as unknown as Response;

      statusMock.mockReturnValue(mockRes);

      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(mockRes, mockReq);

      expect(mockAuthService.logout).toHaveBeenCalledWith('fake-refresh-token');

      expect(clearCookieMock).toHaveBeenNthCalledWith(1, 'access_Token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      expect(clearCookieMock).toHaveBeenNthCalledWith(2, 'refresh_Token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      expect(statusMock).toHaveBeenCalledWith(200);

      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Logout successfully',
      });
    });
  });

  describe('refresh', () => {
    it('should refresg tokens success and return response', async () => {
      type RequestWithCookies = Request & {
        cookies: {
          refresh_Token: string;
        };
      };

      const cookieMock = jest.fn();
      const jsonMock = jest.fn();

      const mockRes = {
        cookie: cookieMock,
        json: jsonMock,
      } as unknown as Response;

      const mockReq = {
        cookies: {
          refresh_Token: 'fake_refresh_token',
        },
      } as unknown as RequestWithCookies;

      const mockServiceResult = {
        access_Token: 'new_access_token',
        refresh_Token: 'new_refresh_token',
      };
      mockAuthService.refresh.mockResolvedValue(mockServiceResult);

      await controller.refresh(mockRes, mockReq);

      expect(mockAuthService.refresh).toHaveBeenCalledWith(
        'fake_refresh_token',
      );

      expect(cookieMock).toHaveBeenNthCalledWith(
        1,
        'access_Token',
        'new_access_token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000,
          path: '/',
        },
      );

      expect(cookieMock).toHaveBeenNthCalledWith(
        2,
        'refresh_Token',
        'new_refresh_token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/',
        },
      );

      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Successfully refreshed tokens',
      });
    });
  });

  describe('get user', () => {
    it('should get user and return response', async () => {
      type RequestWithCookies = Request & {
        cookies: {
          access_Token: string;
        };
      };

      const mockReq = {
        cookies: {
          access_Token: 'fake_access_token',
        },
      } as unknown as RequestWithCookies;

      const mockUser = {
        id: '123-qwqwq',
        name: 'test',
        email: 'test12@gmail.com',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        createdAt: new Date(Date.now()),
      };

      mockAuthService.getUser.mockResolvedValue({
        user: {
          id: '123-qwqwq',
          name: 'test',
          email: 'test12@gmail.com',
          role: 'EMPLOYEE',
          status: 'ACTIVE',
          createdAt: new Date(Date.now()),
        },
      });

      const result = await controller.getUser(mockReq);

      expect(mockAuthService.getUser).toHaveBeenCalledWith('fake_access_token');
      expect(result).toEqual({
        message: 'Successfully found user',
        data: mockUser,
      });
    });
  });
});
