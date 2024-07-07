import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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
import { UseItemDto } from './dto/useitem.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('/')
  async getUser(@Req() req): Promise<ResDto> {
    const user = await this.usersService.getUserById(req.userId);
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
    await this.usersService.updateClicks(req.userId, updateClicksDto.clicks);
    return { statusCode: HttpStatus.OK };
  }

  @UseGuards(AuthGuard)
  @Post('/useitem/:inventoryId')
  async useItem(@Req() req, @Param() useItemDto: UseItemDto): Promise<ResDto> {
    await this.usersService.useItem(req.userId, useItemDto.inventoryId);
    return { statusCode: HttpStatus.OK };
  }
}
