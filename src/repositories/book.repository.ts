import { Repository } from "typeorm";
import { AppDataSource } from "../configs/ormconfig";
import { Book } from "../entities/book";
import { BookGetI } from "../interface/book-get.interface";

export class BookRepository {
  private repository: Repository<Book>;

  constructor() {
    this.repository = AppDataSource.getRepository(Book);
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    const book = this.repository.create(bookData);
    return await this.repository.save(book);
  }

  /**
   * This TypeScript function retrieves a list of books based on search criteria with pagination
   * support.
   * @param {BookGetI} - The `getBooks` function is an asynchronous function that retrieves a list of books based
   * on the provided parameters. Here's a breakdown of the parameters:
   * @returns The `getBooks` function returns a Promise that resolves to an object with two properties:
   * `books` which is an array of Book objects, and `totalBooks` which is the total number of books
   * that match the search criteria.
   */
  async getBooks({
    search = "",
    page = 1,
    limit = 10,
  }: BookGetI): Promise<{ books: Book[]; totalBooks: number }> {
    const query = this.repository.createQueryBuilder("book");

    // Add search functionality
    if (search) {
      query.andWhere(
        "book.title ILIKE :search OR book.author ILIKE :search OR EXISTS (SELECT 1 FROM unnest(book.genres) AS genre WHERE genre ILIKE :search)",
        {
          search: `%${search}%`,
        }
      );
    }

    // Count total books before applying pagination
    const totalBooks = await query.getCount();

    // Apply pagination
    const books = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { books, totalBooks };
  }

  /**
   * This TypeScript function asynchronously retrieves a book by its ID from a repository and returns
   * it as a Promise, or null if not found.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * book.
   * @returns The `getBookById` function is returning a Promise that resolves to either a `Book` object
   * if found, or `null` if no book with the specified `id` is found.
   */
  async getBookById(id: number): Promise<Book | null> {
    return await this.repository.findOneBy({ id });
  }

  /**
   * The `updateBook` function updates a book record with the provided data if the book exists in the
   * repository.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the
   * book that you want to update.
   * @param updateData - The `updateData` parameter in the `updateBook` function is of type
   * `Partial<Book>`, which means it is an object containing partial data of a `Book` entity. This
   * allows you to update only specific properties of a `Book` entity without having to provide values
   * for all properties.
   * @returns The `updateBook` function returns a Promise that resolves to either the updated `Book`
   * object if the book with the specified `id` is found and updated successfully, or `null` if the
   * book is not found.
   */
  async updateBook(
    id: number,
    updateData: Partial<Book>
  ): Promise<Book | null> {
    let book = await this.repository.findOneBy({ id });
    if (book) {
      book = this.repository.merge(book, updateData);
      return await this.repository.save(book);
    }
    return null;
  }

  /**
   * This TypeScript function deletes a book from a repository and returns a boolean indicating whether
   * the deletion was successful.
   * @param {number} id - The `id` parameter in the `deleteBook` function is a number that represents
   * the unique identifier of the book that needs to be deleted from the repository.
   * @returns The `deleteBook` function is returning a Promise that resolves to a boolean value. The
   * boolean value indicates whether the deletion operation was successful or not. It checks if the
   * `affected` property of the result object is not equal to 0, which implies that at least one record
   * was affected by the deletion operation.
   */
  async deleteBook(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
