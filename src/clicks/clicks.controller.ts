import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ResDto } from 'src/dto/res.dto';
import { UsersService } from 'src/users/users.service';

@Controller('clicks')
export class ClicksController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/total')
  async getTotalClicks(): Promise<ResDto> {
    const clicks = await this.usersService.getGlobalTotalClicks();
    return {
      statusCode: HttpStatus.OK,
      data: clicks,
    };
  }
}
