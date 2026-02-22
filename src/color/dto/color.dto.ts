import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({
    message: 'Обязательное поле!',
  })
  name: string;

  @IsString({
    message: 'Обязательное поле!',
  })
  value: string;
}
