import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { MailModule } from './mail/mail.module';
import { mailCodes } from './mail/entities/mailcodes.entity';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { ClicksModule } from './clicks/clicks.module';
import { Item } from './shop/entitities/item.entity';
import { ShopModule } from './shop/shop.module';
import { Chest } from './shop/entitities/chest.entity';
import { Inventory } from './users/entities/inventory.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [User, mailCodes, Item, Chest, Inventory],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: 60000,
          limit: configService.get<number>('rateLimits.global'),
        },
      ],
    }),
    UsersModule,
    AuthModule,
    MailModule,
    ClicksModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
