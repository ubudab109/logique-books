import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'books'})
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  published_year: number;

  @Column('text', { array: true })
  genres: string[];

  @Column()
  stock: number;
}
