import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  //mock service
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const userData = {
    id: '1233-wqwew-222',
    name: 'minh',
    email: 'test1@gmail.com',
    password: 'hash-password',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Auth Service', () => {
    //Login
    it('Login success and return userData', async () => {
      //gia dinh
      mockPrismaService.user.findUnique.mockResolvedValue(userData);
      mockPrismaService.refreshToken.create.mockResolvedValue({
        id: '123',
        token: 'hash_refresh_Token',
      });

      //Check mk
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        return 'valid_password';
      });
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => 'hashed_refresh_token');

      //gia lap sinh ma token
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_Token')
        .mockResolvedValueOnce('refresh_Token');

      //chya thu ham that

      const result = await service.login({
        email: 'test12@gmail.com',
        password: '12345678',
      });

      //expect check kq
      expect(result).toEqual({
        access_Token: 'access_Token',
        refresh_Token: 'refresh_Token',
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
      });
    });

    it('Login fail when user is not found', async () => {
      //gia dinh
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'Notfoundemail@gmail.com',
          password: '12345678',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'Notfoundemail@gmail.com' },
      });
    });

    it('Login fil when user is not active', async () => {
      //Gia dinh
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1233-wqwew-222',
        name: 'minh',
        email: 'test1@gmail.com',
        password: 'hash-password',
        role: 'EMPLOYEE',
        status: 'INACTIVE',
      });

      await expect(
        service.login({
          email: 'inactive@gmail.com',
          password: '12345678',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw when password is Invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(userData);
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as never);

      await expect(
        service.login({
          email: 'test1@gmail.com',
          password: 'loginpassword',
        }),
      ).rejects.toThrow('Invalid Credentials');

      expect(compareSpy).toHaveBeenCalledWith(
        'loginpassword',
        userData.password,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test1@gmail.com' },
      });
    });

    //Logout
    it('Logout success with refresh_Token and delete in Database ', async () => {
      const refreshToken = 'refresh_Token';

      mockJwtService.verifyAsync.mockResolvedValue({
        sub: '123-qq-222',
        role: ['ADMIN'],
        jti: '1220444-222',
      });

      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({
        count: 5,
      });

      //Goi that
      const result = await service.logout(refreshToken);

      expect(result).toBeUndefined();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          id: '1220444-222',
        },
      });
    });

    it('logout success but no  refresh_Token', async () => {
      const refreshToken = null;
      const result = await service.logout(refreshToken);
      expect(result).toBeUndefined();
      expect(mockJwtService.verifyAsync).not.toHaveBeenCalledWith();
      expect(
        mockPrismaService.refreshToken.deleteMany,
      ).not.toHaveBeenCalledWith();
    });

    it('logout success but wrong refresh_Token', async () => {
      const refreshToken = 'wrong_token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));
      const result = await service.logout(refreshToken);
      expect(result).toBeUndefined();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
      expect(
        mockPrismaService.refreshToken.deleteMany,
      ).not.toHaveBeenCalledWith();
    });

    //refresh
    it('should refresh tokens successfully when refresh token is valid', async () => {
      const refreshToken = 'valid_token';
      // const newTokenId = crypto.randomUUID();
      //mock tokenID
      jest
        .spyOn(crypto, 'randomUUID')
        .mockReturnValue(
          'new_refresh_token_id' as `${string}-${string}-${string}-${string}-${string}`,
        );

      //mock payload
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['ADMIN'],
        jti: 'refreshToken_id',
      });
      //mock storedToken trog Db
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: '123123-33',
        token: 'hash_token_in_db',
        userId: 'userId',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      //mock delete va create trog transaction
      mockPrismaService.refreshToken.delete.mockResolvedValue({
        id: 'old_refresh_token_id',
        token: 'old_hash_refresh_token',
        userId: 'userId',
        expiresAt: new Date(),
      });

      mockPrismaService.refreshToken.create.mockResolvedValue({
        id: 'new_refresh_token_id',
        token: 'new_hash_refresh_token',
        userId: 'userId',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      //gia dinh bcrypt compare va hash thanh cong
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      //hash thanh cong tra ve token moi da hash
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return 'new_hash_refresh_token';
      });

      //mock tao 2 token access va refresh moi
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_Token_sach')
        .mockResolvedValueOnce('refresh_Token_sach');

      //mock transaction
      mockPrismaService.$transaction.mockImplementation(async (queries) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return Promise.all(queries);
      });

      //goi service that
      const result = await service.refresh(refreshToken);

      //expect return 2 token
      expect(result).toEqual({
        access_Token: 'access_Token_sach',
        refresh_Token: 'refresh_Token_sach',
      });
      //expect bcrypt compare va hash goi voi token va dung format
      expect(compareSpy).toHaveBeenCalledWith(refreshToken, 'hash_token_in_db');
      expect(hashSpy).toHaveBeenCalledWith('refresh_Token_sach', 10);

      //expect tao 2 token dung format giong service
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'userId',
          role: ['ADMIN'],
        },
        {
          secret: process.env.ACCESS_TOKEN,
          expiresIn: 15 * 60,
        },
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'userId',
          role: ['ADMIN'],
          jti: 'new_refresh_token_id',
        },
        {
          secret: process.env.REFRESH_TOKEN,
          expiresIn: 7 * 24 * 60 * 60,
        },
      );
    });

    it('should throw no refresh_token when refresh_token is invalid', async () => {
      const refreshToken = null;

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'No refresh token',
      );
    });

    it('should throw Invalid refresh token when refresh token is invalid', async () => {
      const refreshToken = 'invalid_token';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('jwt invalid'));

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
    });

    it('should throw when refresh Token not found in database', async () => {
      const refreshToken = 'valid_token';

      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['ADMIN'],
        jti: 'refreshToken_id',
      });

      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Refresh token not found',
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
    });

    it('should throw when storedToken userId is not match the payload userId', async () => {
      const refreshToken = 'valid_token';

      //payload mock
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['ADMIN'],
        jti: 'refreshToken_id',
      });

      //mock token findUnique
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 'refreshToken_id',
        token: 'hash_token',
        userId: 'different_userId',
      });

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Invalid refresh token owner',
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
      expect(mockPrismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { id: 'refreshToken_id' },
      });
    });

    it('should throw token expired when storedToken expired date < right now data ', async () => {
      const refreshToken = 'valid_token';

      //mock payload
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['ADMIN'],
        jti: 'refreshToken_id',
      });
      //mock token trog db
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 'refreshToken_id',
        token: 'hash_token',
        userId: 'userId',
        //assume no het han
        expiresAt: new Date(Date.now() - 1000),
      });

      //neu token het han thi xoa token day trog db
      mockPrismaService.refreshToken.delete.mockResolvedValue({
        id: 'refreshToken_id',
        token: 'hash_token',
        userId: 'userId',
      });

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Refresh token expired',
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
      expect(mockPrismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'refreshToken_id',
        },
      });
      expect(mockPrismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: {
          id: 'refreshToken_id',
        },
      });
    });

    it('should throw when compare token from request and hashed_token in DB is not match', async () => {
      const refresh_token = 'valid_token';

      //mock payload
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['ADMIN'],
        jti: 'refreshToken_id',
      });

      //mock token trog db
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 'refreshToken_id',
        token: 'hash_token',
        userId: 'userId',
        //assume no het han
        expiresAt: new Date(Date.now() - 1000),
      });

      //mock token trog db
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 'refreshToken_id',
        token: 'hash_token',
        userId: 'userId',
        //assume no con han
        expiresAt: new Date(Date.now() + 1000),
      });

      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as never);

      await expect(service.refresh(refresh_token)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refresh_token, {
        secret: process.env.REFRESH_TOKEN,
      });
      expect(mockPrismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { id: 'refreshToken_id' },
      });
      expect(compareSpy).toHaveBeenCalledWith(refresh_token, 'hash_token');
    });

    //get User
    it('should getUser success with valid accessToken', async () => {
      const accessToken = 'valid_token';
      //mock date assume bang nhau
      const createdAt = new Date('2026-06-27T10:00:00.000Z');

      //mock payload
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['EMPLOYEE'],
        jti: 'accessToken_id',
      });

      //mock user
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'userId',
        name: 'Minh',
        email: 'test@gmail.com',
        role: ['EMPLOYEE'],
        status: 'ACTIVE',
        createdAt: createdAt,
      });

      const result = await service.getUser(accessToken);
      expect(result).toEqual({
        user: {
          id: 'userId',
          name: 'Minh',
          email: 'test@gmail.com',
          role: ['EMPLOYEE'],
          status: 'ACTIVE',
          createdAt: createdAt,
        },
      });
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken, {
        secret: process.env.ACCESS_TOKEN,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'userId' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
    });

    it('should throw when accessToken is falsy', async () => {
      const accessToken = null;

      await expect(service.getUser(accessToken)).rejects.toThrow(
        'Access token not found',
      );
      expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw when accessToken is Invalid ', async () => {
      const accessToken = 'invalid_token';

      //fail payload
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.getUser(accessToken)).rejects.toThrow(
        'Invalid or expired access token',
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken, {
        secret: process.env.ACCESS_TOKEN,
      });
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw when there is no User', async () => {
      const accessToken = 'valid_token';
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'notFound_userId',
        role: ['EMPLOYEE'],
        jti: 'accessToken_id',
      });

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUser(accessToken)).rejects.toThrow(
        'User not found',
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken, {
        secret: process.env.ACCESS_TOKEN,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'notFound_userId' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
    });

    it('should throw when user status !== "ACTIVE', async () => {
      const accessToken = 'valid_token';
      //payload
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'userId',
        role: ['EMPLOYEE'],
        jti: 'accessToken_id',
      });

      //mock user
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'userId',
        name: 'Minh',
        email: 'test@gmail.com',
        role: ['EMPLOYEE'],
        status: 'INACTIVE',
        createdAt: new Date(Date.now()),
      });

      await expect(service.getUser(accessToken)).rejects.toThrow(
        'Account is inactive',
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken, {
        secret: process.env.ACCESS_TOKEN,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'userId' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
    });
  });
});
