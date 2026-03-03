import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  //=====================================================
  @IsString({ message: 'Название должно быть строкой!' })
  @IsNotEmpty({ message: 'Обязательное поле!' })
  title: string;

  //======================================================
  @IsString({ message: 'Описание должно быть строкой!' })
  @IsNotEmpty({ message: 'Обязательное поле!' })
  description: string;

  //======================================================
  @IsNumber({}, { message: 'Цена должна быть числом!' })
  @IsNotEmpty({ message: 'Обязательное поле!' })
  price: number;

  //======================================================
  @IsString({
    message: 'Ссылка на картинку должна быть строкой!',
    each: true,
  })
  @ArrayMinSize(1, { message: 'Должна быть хотя бы одна картинка!' })
  @IsNotEmpty({
    message: 'Путь к картине не может быть пустым!',
    each: true,
  })
  images: string[];

  //=======================================================
  @IsString({ message: 'Категория должна быть строкой!' })
  @IsNotEmpty({ message: 'Обязательное поле!' })
  categoryId: string;

  //=======================================================
  @IsString({ message: 'Цвет должен быть строкой!' })
  @IsNotEmpty({ message: 'Обязательное поле!' })
  colorId: string;
}
