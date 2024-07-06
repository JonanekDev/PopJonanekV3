import { Module } from '@nestjs/common';
import { ClicksController } from './clicks.controller';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('cache.clicks') * 1000,
      }),
    }),
    UsersModule,
  ],
  controllers: [ClicksController],
})
export class ClicksModule {}
