import { Module } from '@nestjs/common';
import { TodayService } from './today.service';
import { TodayController } from './today.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Today } from './today.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Today])],
  controllers: [TodayController],
  providers: [TodayService],
  exports: [TodayService],
})
export class TodayModule {}
