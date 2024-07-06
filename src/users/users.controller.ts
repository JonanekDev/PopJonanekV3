import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
    const user = await this.usersService
      .getUserById(req.userId)
      .catch((err) => {
        throw err;
      });
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  //TODO: RATE LIMIT nemam na to nervy teď
  @Post('/clicks')
  async updateClicks(
    @Req() req,
    @Body() updateClicksDto: UpdateClicksDto,
  ): Promise<ResDto> {
    await this.usersService
      .updateClicks(req.userId, updateClicksDto.clicks)
      .catch((err) => {
        throw err;
      });
    return { statusCode: HttpStatus.OK };
  }

  @UseGuards(AuthGuard)
  @Post('/useitem/:itemId')
  async useItem(@Req() req, @Param() useItemDto): Promise<ResDto> {
    await this.usersService.useItem(req.userId, useItemDto.itemId).catch((err) => {
      throw err;
    });
    return { statusCode: HttpStatus.OK };
  }
}
