import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateStatusDto,
} from 'src/dto/user.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUser() {
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

    return {
      allUser,
    };
  }

  async getOneUser(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
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
    return {
      user,
    };
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
    return {
       updatedUserStatus,
    };
  }

  async updatePassword(userId: string, updatePassword: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const hashPassword = await bcrypt.hash(updatePassword.password, 12);

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
    return {
     updatePasswordForUser,
    };
  }
}
