import { Module } from '@nestjs/common';
import { ClicksController } from './clicks.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ClicksController],
  imports: [UsersModule],
})
export class ClicksModule {}
