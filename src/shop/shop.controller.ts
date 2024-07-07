import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { ResDto } from 'src/dto/res.dto';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('shop')
@UseInterceptors(CacheInterceptor)
export class ShopController {
  constructor(
    private shopService: ShopService,
    private usersService: UsersService,
  ) {}

  @Get('items')
  async getItems() {
    return await this.shopService.getItems();
  }

  @Get('chests')
  async getChests() {
    return await this.shopService.getChests();
  }

  @UseGuards(AuthGuard)
  @Post('chests/:chestId/purchase')
  async purchaseChest(
    @Param() purchaseDto: PurchaseDto,
    @Req() req,
  ): Promise<ResDto> {
    const itemFromChest = await this.shopService.purchaseChest(
      purchaseDto.chestId,
      req.userId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: itemFromChest,
    };
  }
}
