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
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindTodoOptionDto } from './dto/find-todo-option.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() data: CreateTodoDto) {
    return await this.todoService.create({
      ...data,
      user_id: req.user.id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req, @Query() data: FindTodoOptionDto) {
    return await this.todoService.findAll(data, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.todoService.find(id);
    if (data) return data;
    else return {};
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTodoDto) {
    return await this.todoService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todoService.remove(id);
  }
}
