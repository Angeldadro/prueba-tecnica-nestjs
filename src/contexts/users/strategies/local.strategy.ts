import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../application/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const result = await this.loginUseCase.execute(email, password);
    if (!result.isSuccess) {
      throw new UnauthorizedException(result.error.message);
    }
    return result.value;
  }
} 