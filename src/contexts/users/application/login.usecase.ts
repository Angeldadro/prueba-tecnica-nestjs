import { Injectable } from '@nestjs/common';
import { failure, success, Result } from '@shared/ROP/result';
import { UserRepository } from '@users/domain/repos/user.repository';
import { USER_REPOSITORY } from '@users/domain/repos/user.repository';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from '@shared/persistance/transactions';
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string, tx?: Transaction): Promise<Result<{ access_token: string }, Error>> {
    try {
      const user = await this.userRepository.findByEmail(email, tx);
      if (!user) {
        return failure(new Error('Invalid credentials'));
      }

      const isValidPassword = await bcrypt.compare(password, user.getPassword());
      if (!isValidPassword) {
        return failure(new Error('Invalid credentials'));
      }

      const payload = { 
        email: user.getEmail(), 
        sub: user.getId(),
        role: user.getRole().getValue() 
      };
      
      const access_token = this.jwtService.sign(payload);
      return success({ access_token });
    } catch (error) {
      return failure(error as Error);
    }
  }
} 