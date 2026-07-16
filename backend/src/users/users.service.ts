import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NewProfileInputType,
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateStatusDto,
  User,
} from 'src/dto/user.dto';
import bcrypt from 'bcrypt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllUser() {
    const cached_key = 'user:all';

    const cachedUsers = await this.cacheManager.get<User[]>(cached_key);

    if (cachedUsers !== undefined && cachedUsers !== null) {
      console.log('CACHE HIT');
      return cachedUsers;
    }

    const allUser = await this.prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (allUser.length === 0)
      throw new NotFoundException('No active user found');

    await this.cacheManager.set(cached_key, allUser, 60000);

    return allUser;
  }

  async getOneUser(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const cached_key = `user:id:${userId}`;
    const cacheUser = await this.cacheManager.get(cached_key);

    if (cacheUser !== undefined && cacheUser !== null) {
      console.log('CACHE HIT');
      return cacheUser;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.cacheManager.set(cached_key, user, 60000);
    return user;
  }

  async updateRole(userId: string, updateRole: UpdateRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const updatedRoleForUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: updateRole.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //Vi thay doi ca user nen xoa ca cache cua allUser
    await this.cacheManager.del(`user:id:${userId}`);
    await this.cacheManager.del('users:all');

    return {
      updatedRoleForUser,
    };
  }

  async updateStatus(userId: string, updateStatus: UpdateStatusDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const updatedUserStatus = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: updateStatus.status,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheManager.del(`user:id:${userId}`);
    await this.cacheManager.del('users:all');

    return {
      updatedUserStatus,
    };
  }

  async updatePassword(userId: string, updatePassword: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const isHashOldPasswordValid = await bcrypt.compare(
      updatePassword.currentPassword,
      user.password,
    );

    if (!isHashOldPasswordValid) {
      throw new ConflictException('Password is not match');
    }

    const hashPassword = await bcrypt.hash(updatePassword.newPassword, 12);

    const updatePasswordForUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheManager.del(`user:id:${userId}`);

    return {
      updatePasswordForUser,
    };
  }

  // async register(input: { name: string; email: string; password: string }) {
  //   const hashPassword = await bcrypt.hash(input.password, 10);
  //   const registered = await this.prisma.user.create({
  //     data: {
  //       name: input.name,
  //       email: input.email,
  //       password: hashPassword,
  //     },
  //   });
  //   return registered;
  // }

  async updateUserProfile(
    userId: string,
    newProfileInput: NewProfileInputType,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        employee: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.employee) {
      throw new NotFoundException('Employee not found');
    }

    const normalizedEmail = newProfileInput.email?.trim().toLowerCase();

    const normalizedName = newProfileInput.name?.trim().replace(/\s+/g, ' ');

    const normalizedPosition = newProfileInput.position
      ?.trim()
      .replace(/\s+/g, ' ');

    // Chỉ kiểm tra khi có email mới và email đó khác email hiện tại
    if (normalizedEmail && normalizedEmail !== user.email.toLowerCase()) {
      const existUserWithEmail = await this.prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
        select: {
          id: true,
        },
      });

      // Email tồn tại và thuộc về user khác
      if (existUserWithEmail && existUserWithEmail.id !== user.id) {
        throw new ConflictException('Email is already registered');
      }
    }

    const updatedUserProfile = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...(normalizedName !== undefined && {
          name: normalizedName,
        }),

        ...(normalizedEmail !== undefined && {
          email: normalizedEmail,
        }),

        ...(normalizedPosition !== undefined && {
          employee: {
            update: {
              position: normalizedPosition,
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        employee: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    return {
      updatedUserProfile,
    };
  }
}
