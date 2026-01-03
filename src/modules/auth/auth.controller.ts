import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  RefreshTokenDto,
  PasswordResetDto,
  ResetPasswordDto,
} from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'login new users' })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthCredentialsDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'refresh the  access token' })
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'logout users' })
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('password-forgot')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'forgot password' })
  @HttpCode(HttpStatus.OK)
  requestPasswordReset(@Body() dto: PasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'reset password' })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
