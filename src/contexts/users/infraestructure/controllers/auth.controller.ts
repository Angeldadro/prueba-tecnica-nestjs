import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/login.usecase';
import { RegisterUseCase } from '../../application/register.usecase';
import { VerifyUseCase } from '../../application/verify.usecase';
import { Result } from '@shared/ROP/result';

class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'password123' })
  password: string;
}

class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'password123' })
  password: string;
}

class VerifyDto {
  @ApiProperty({ example: 'token123' })
  token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyUseCase: VerifyUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto?.email || !loginDto?.password) {
      throw new UnauthorizedException('Email and password are required');
    }
    const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);
    if (!result.isSuccess) {
      throw new UnauthorizedException(result.error.message);
    }
    return result.value;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    if (!registerDto?.email || !registerDto?.password) {
      throw new UnauthorizedException('Email and password are required');
    }
    const result = await this.registerUseCase.execute(registerDto.email, registerDto.password);
    if (!result.isSuccess) {
      throw new UnauthorizedException(result.error.message);
    }
    return result.value;
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async verify(@Body() verifyDto: VerifyDto) {
    if (!verifyDto?.token) {
      throw new UnauthorizedException('Token is required');
    }
    return this.verifyUseCase.execute(verifyDto.token);
  }
} 