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
    const user = await this.authService.registerUser(registerdto);
    return {
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async loginUser(@Body() loginDto: LoginDto): Promise<ResDto> {
    const user = await this.authService.loginUser(loginDto);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ResDto> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AuthGuard)
  @Post('resend-email-verify')
  async resendEmailVerify(@Req() req): Promise<ResDto> {
    await this.authService.resendEmailVerify(req.userId);
    return {
      statusCode: HttpStatus.OK,
    };
  }

  @Post('email-verify')
  async emailVerify(@Body() emailVerifyDto: EmailVerifyDto): Promise<ResDto> {
    await this.authService.emailVerify(emailVerifyDto);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
