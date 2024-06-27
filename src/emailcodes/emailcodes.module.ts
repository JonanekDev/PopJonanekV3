import { Module } from '@nestjs/common';
import { EmailcodesService } from './emailcodes.service';
import { EmailcodesController } from './emailcodes.controller';

@Module({
  providers: [EmailcodesService],
  controllers: [EmailcodesController]
})
export class EmailcodesModule {}
