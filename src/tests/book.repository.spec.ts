import { Repository } from 'typeorm';
import { Book } from '../entities/book';
import { BookRepository } from '../repositories/book.repository';

class MockQueryBuilder<T> {
  where = jest.fn().mockReturnThis();
  andWhere = jest.fn().mockReturnThis();
  skip = jest.fn().mockReturnThis();
  take = jest.fn().mockReturnThis();
  getMany = jest.fn();
  getCount = jest.fn();
}

// Mock the Repository class
class MockRepository<T> {
  create = jest.fn();
  save = jest.fn();
  find = jest.fn();
  findOneBy = jest.fn();
  merge = jest.fn();
  delete = jest.fn();
  createQueryBuilder = jest.fn().mockReturnValue(new MockQueryBuilder<T>());
}

describe('BookRepository', () => {
  let bookRepository: BookRepository;
  let repository: MockRepository<Book>;

  beforeEach(() => {
    repository = new MockRepository<Book>();
    bookRepository = new BookRepository();
    (bookRepository as any).repository = repository; // Inject mock repository
  });

  describe('createBook', () => {
    it('should create and save a book', async () => {
      const bookData: Partial<Book> = { title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 };
      const createdBook = { ...bookData, id: 1 } as Book;

      repository.create.mockReturnValue(createdBook);
      repository.save.mockResolvedValue(createdBook);

      const result = await bookRepository.createBook(bookData);
      expect(result).toEqual(createdBook);
      expect(repository.create).toHaveBeenCalledWith(bookData);
      expect(repository.save).toHaveBeenCalledWith(createdBook);
    });
  });

  describe('getBooks', () => {
    it('should return a paginated list of books with search functionality', async () => {
      const search = 'Test';
      const page = 1;
      const limit = 10;
      const books: Book[] = [
        { id: 1, title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
        { id: 2, title: 'Another Test Book', author: 'Another Author', published_year: 2023, genres: ['Adventure'], stock: 5 },
      ];

      const mockQueryBuilder = repository.createQueryBuilder() as MockQueryBuilder<Book>;
      mockQueryBuilder.getMany.mockResolvedValue(books);
      mockQueryBuilder.getCount.mockResolvedValue(50); // Simulate a total count for pagination

      await bookRepository.getBooks({ search, page, limit });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'book.title ILIKE :search OR book.author ILIKE :search OR EXISTS (SELECT 1 FROM unnest(book.genres) AS genre WHERE genre ILIKE :search)',
        { search: `%${search}%` }
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith((page - 1) * limit);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const search = '';
      const page = 2;
      const limit = 5;
      const books: Book[] = [
        { id: 6, title: 'Paged Book', author: 'Paged Author', published_year: 2022, genres: ['Science Fiction'], stock: 8 },
      ];

      const mockQueryBuilder = repository.createQueryBuilder() as MockQueryBuilder<Book>;
      mockQueryBuilder.getMany.mockResolvedValue(books);
      mockQueryBuilder.getCount.mockResolvedValue(20); // Simulate a total count for pagination

      await bookRepository.getBooks({ search, page, limit });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith((page - 1) * limit);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
    });

    it('should return empty books list if no books match the search criteria', async () => {
      const search = 'Nonexistent';
      const page = 1;
      const limit = 10;

      const mockQueryBuilder = repository.createQueryBuilder() as MockQueryBuilder<Book>;
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getCount.mockResolvedValue(0);

      await bookRepository.getBooks({ search, page, limit });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'book.title ILIKE :search OR book.author ILIKE :search OR EXISTS (SELECT 1 FROM unnest(book.genres) AS genre WHERE genre ILIKE :search)',
        { search: `%${search}%` }
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
    });
  });


  describe('getBookById', () => {
    it('should return a book by ID', async () => {
      const book = { id: 1, title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 } as Book;

      repository.findOneBy.mockResolvedValue(book);

      const result = await bookRepository.getBookById(1);
      expect(result).toEqual(book);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if the book is not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await bookRepository.getBookById(1);
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('updateBook', () => {
    it('should update and return a book', async () => {
      const existingBook = { id: 1, title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 } as Book;
      const updateData: Partial<Book> = { title: 'Updated Title' };
      const updatedBook = { ...existingBook, ...updateData };

      repository.findOneBy.mockResolvedValue(existingBook);
      repository.merge.mockReturnValue(updatedBook);
      repository.save.mockResolvedValue(updatedBook);

      const result = await bookRepository.updateBook(1, updateData);
      expect(result).toEqual(updatedBook);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.merge).toHaveBeenCalledWith(existingBook, updateData);
      expect(repository.save).toHaveBeenCalledWith(updatedBook);
    });

    it('should return null if the book is not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await bookRepository.updateBook(1, { title: 'Updated Title' });
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return true', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      const result = await bookRepository.deleteBook(1);
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if the book was not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      const result = await bookRepository.deleteBook(1);
      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
