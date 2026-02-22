import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({
    message: 'Обязательное поле!',
  })
  title: string;

  @IsString({
    message: 'Обязательное поле!',
  })
  description: string;
}
