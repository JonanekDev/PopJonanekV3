import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpasssword.dto';
import { EmailVerifyDto } from './dto/emailverify.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async registerUser(@Body() registerdto: RegisterDto) {
    return await this.authService.registerUser(registerdto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Post('resend-email-verify')
  async resendEmailVerify(@Req() req) {
    return await this.authService.resendEmailVerify(req.userId);
  }

  @Post('email-verify')
  async emailVerify(@Body() emailVerifyDto: EmailVerifyDto) {
    return await this.authService.emailVerify(emailVerifyDto);
  }
}
