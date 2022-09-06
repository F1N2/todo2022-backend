import { IsString } from 'class-validator';

export class CreateTodayDto {
  @IsString()
  content: string;
}
