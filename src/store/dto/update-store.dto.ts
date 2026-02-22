import { IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto.js';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({
    message: 'Обязательное поле',
  })
  description: string;
}
