import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodayService } from './today.service';
import { CreateTodayDto } from './dto/create-today.dto';
import { UpdateTodayDto } from './dto/update-today.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindTodayOptionDto } from './dto/find-today-option.dto';

@Controller('today')
export class TodayController {
  constructor(private readonly todayService: TodayService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() data: CreateTodayDto) {
    return await this.todayService.create({
      ...data,
      user_id: req.user.id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req, @Body() data: FindTodayOptionDto) {
    return await this.todayService.findAll(data, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.todayService.find(id);
    if (data) return data;
    else return {};
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTodayDto) {
    return await this.todayService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todayService.remove(id);
  }
}
