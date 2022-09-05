import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<any> {
    const user = this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
    try {
      await this.userRepository.save(user);
      user.password = undefined;
      return user;
    } catch (e) {
      if (/Duplicate/.test(e.message))
        throw new HttpException(
          'Email is already exists',
          HttpStatus.BAD_REQUEST,
        );
      console.error(e);
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async find(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user)
      throw new HttpException(
        '사용자가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async update(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update({ id: id }, { ...data });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: id });
  }
}
