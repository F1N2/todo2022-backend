import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    const result = await this.userService.create(data);
    return {
      statusCode: 201,
      result: result,
    };
  }

  @Get()
  async findAll() {
    const user = await this.userService.findAll();
    return {
      statusCode: 200,
      result: user,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.find(id);
    return {
      statusCode: 200,
      result: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const result = await this.userService.update(id, data);
    return {
      statusCode: 200,
      result: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return {
      statusCode: 200,
      result: result,
    };
  }
}
