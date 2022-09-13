import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindTodoOptionDto } from './dto/find-todo-option.dto';
import {
  Between,
  DeleteResult,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(data: CreateTodoDto & { user_id: string }) {
    const todo = this.todoRepository.create({ ...data, user_id: data.user_id });
    await this.todoRepository.save(todo);
    return todo;
  }

  async findAll(data: FindTodoOptionDto, user: User): Promise<Todo[]> {
    const { now, page, count, sort, userid, onlyMine, from, to } = data;
    const date = new Date();
    return await this.todoRepository.find({
      order: {
        created: sort,
      },
      where: {
        ...(userid && { user_id: userid }),
        ...(onlyMine == 'true' && { user_id: user.id }),
        created:
          now == 'true'
            ? Between(
                new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1,
                ),
              )
            : from && to
            ? Between(new Date(+from), new Date(+to))
            : from
            ? MoreThanOrEqual(new Date(+from))
            : to
            ? LessThanOrEqual(new Date(+to))
            : undefined,
      },
      skip: (+page - 1) * +count,
      take: +count,
    });
  }

  async find(id: string): Promise<Todo | null> {
    return await this.todoRepository.findOneBy({ id: id });
  }

  async update(id: string, data: UpdateTodoDto): Promise<UpdateResult> {
    return await this.todoRepository.update({ id: id }, { ...data });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.todoRepository.delete({ id: id });
  }
}
