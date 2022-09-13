import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindTodayOptionDto {
  @IsIn(['true', 'false'])
  @IsOptional()
  onlyMine: 'true' | 'false' = 'true';

  @IsIn(['true', 'false'])
  @IsOptional()
  now: 'true' | 'false' = 'true';

  @IsString()
  @IsOptional()
  page = '1';

  @IsString()
  @IsOptional()
  count = '10';

  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC' = 'DESC';

  @IsString()
  @IsOptional()
  userid: string;

  @IsString()
  @IsOptional()
  from: string;

  @IsString()
  @IsOptional()
  to: string;
}
