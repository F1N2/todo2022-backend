import { Injectable } from '@nestjs/common';
import { CreateTodayDto } from './dto/create-today.dto';
import { UpdateTodayDto } from './dto/update-today.dto';
import {
  Between,
  DeleteResult,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Today } from './today.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTodayOptionDto } from './dto/find-today-option.dto';
import { User } from '../user/user.entity';

@Injectable()
export class TodayService {
  constructor(
    @InjectRepository(Today)
    private readonly todayRepository: Repository<Today>,
  ) {}

  async create(data: CreateTodayDto & { user_id: string }): Promise<Today> {
    const today = this.todayRepository.create({
      ...data,
      user_id: data.user_id,
    });
    await this.todayRepository.save(today);
    return today;
  }

  async findAll(data: FindTodayOptionDto, user: User): Promise<Today[]> {
    const { now, page, count, sort, userid, onlyMine, from, to } = data;
    const date = new Date();
    return await this.todayRepository.find({
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

  async find(id: string): Promise<Today | null> {
    return await this.todayRepository.findOneBy({ id: id });
  }

  async update(id: string, data: UpdateTodayDto): Promise<UpdateResult> {
    return await this.todayRepository.update({ id: id }, { ...data });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.todayRepository.delete({ id: id });
  }
}
