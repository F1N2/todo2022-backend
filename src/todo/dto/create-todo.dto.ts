import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  content: string;

  @IsString()
  description: string;

  @IsBoolean()
  complete: boolean;
}
