import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import config from '../config';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  AppError,
} from '../utils/errors';
import { Role } from '@prisma/client';
import emailService from './email.service';

interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private generateAccessToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);
  }

  private generateRefreshToken(): string {
    return uuidv4();
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  async register(dto: RegisterDto): Promise<{ user: object; tokens: TokenPair }> {
    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictError(
        existingUser.email === dto.email
          ? 'Email already registered'
          : 'Phone number already registered'
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(user.id, refreshToken);

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(user.email, user.firstName).catch(() => {});

    return { user, tokens: { accessToken, refreshToken } };
  }

  async login(dto: LoginDto): Promise<{ user: object; tokens: TokenPair }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (!stored.user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const newAccessToken = this.generateAccessToken({
      id: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    });
    const newRefreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(stored.user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new AppError('Current password is incorrect', 400);

    const newHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) return; // Don't reveal if email exists

    // Generate reset token (simple approach using JWT)
    const resetToken = jwt.sign(
      { id: user.id, action: 'password_reset' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );

    const resetUrl = `${config.app.frontendUrl}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded: { id: string; action: string };
    try {
      decoded = jwt.verify(token, config.jwt.accessSecret) as typeof decoded;
    } catch {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (decoded.action !== 'password_reset') {
      throw new AppError('Invalid reset token', 400);
    }

    const newHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { passwordHash: newHash },
    });

    await prisma.refreshToken.deleteMany({ where: { userId: decoded.id } });
  }
}

export default new AuthService();
