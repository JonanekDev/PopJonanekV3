import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('clicks')
export class ClicksController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/total')
  async getTotalClicks() {
    return await this.usersService.getGlobalTotalClicks();
  }
}
