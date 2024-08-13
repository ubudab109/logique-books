import { 
  IsString, 
  IsNumber, 
  IsArray, 
  ArrayNotEmpty, 
  ArrayMinSize, 
  Min, 
  Max, 
  IsInt 
} from 'class-validator';

export class BookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  published_year: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  genres: string[];

  @IsNumber()
  @IsInt()
  @Min(0)
  stock: number;
}
