import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { UpdateClicksDto } from './dto/updateclicks.dto';
import { ResDto } from 'src/dto/res.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('/')
  async getUser(@Req() req): Promise<ResDto> {
    const user = await this.usersService.getUserById(req.userId);
    return {
      status: 'ok',
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/clicks')
  async updateClicks(@Req() req, @Body() updateClicksDto: UpdateClicksDto) {
    return await this.usersService.updateClicks(
      req.userId,
      updateClicksDto.clicks,
    );
  }
}
