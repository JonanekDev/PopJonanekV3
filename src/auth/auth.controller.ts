import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
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
import { ResDto } from 'src/dto/res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async registerUser(@Body() registerdto: RegisterDto): Promise<ResDto> {
    try {
      const user = await this.authService.registerUser(registerdto);
      return {
        statusCode: HttpStatus.CREATED,
        data: user,
      };
    } catch (err) {
      throw err;
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async loginUser(@Body() loginDto: LoginDto): Promise<ResDto> {
    try {
      const user = await this.authService.loginUser(loginDto);
      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResDto> {
    try {
      await this.authService.forgotPassword(forgotPasswordDto);
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(AuthGuard)
  @Post('resend-email-verify')
  async resendEmailVerify(@Req() req): Promise<ResDto> {
    try {
      await this.authService.resendEmailVerify(req.userId);
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('email-verify')
  async emailVerify(@Body() emailVerifyDto: EmailVerifyDto): Promise<ResDto> {
    try {
      await this.authService.emailVerify(emailVerifyDto);
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw err;
    }
  }
}
