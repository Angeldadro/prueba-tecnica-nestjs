import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { USER_REPOSITORY } from '@users/domain/repos/user.repository';
import { AuthController } from '@users/infraestructure/controllers/auth.controller';
import { JwtStrategy } from '@users/strategies/jwt.strategy';
import { LocalStrategy } from '@users/strategies/local.strategy';
import { LoginUseCase } from '@users/application/login.usecase';
import { RegisterUseCase } from '@users/application/register.usecase';
import { VerifyUseCase } from '@users/application/verify.usecase';
import { PrismaService } from '@shared/persistance/prisma.service';
import { UserRepositoryAdapter } from '@users/infraestructure/adapters/user.repository';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryAdapter,
    },
    LoginUseCase,
    RegisterUseCase,
    VerifyUseCase,
    JwtStrategy,
    LocalStrategy,
    PrismaService,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {} 