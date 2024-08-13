import { Request, Response } from 'express';
import { BookRepository } from '../repositories/book.repository';
import { sendResponse } from '../utils/helper';
import { BookController } from '../controllers/book.controller';

jest.mock('../repositories/book.repository');
jest.mock('../utils/helper');

describe('BookController', () => {
  let bookController: BookController;
  let mockBookRepo: jest.Mocked<BookRepository>;
  let mockSendResponse: jest.MockedFunction<typeof sendResponse>;

  beforeEach(() => {
    mockBookRepo = new BookRepository() as jest.Mocked<BookRepository>;
    mockSendResponse = sendResponse as jest.MockedFunction<typeof sendResponse>;
    bookController = new BookController();
    (bookController as any).bookRepo = mockBookRepo; // Inject mock repository
  });

  describe('createBook', () => {
    it('should create a book and send a response', async () => {
      const req = {
        body: { title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const createdBook = { id: 1, ...req.body };
      mockBookRepo.createBook.mockResolvedValue(createdBook);

      await bookController.createBook(req, res);

      expect(mockBookRepo.createBook).toHaveBeenCalledWith(req.body) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 201, 'Data Book Created Successfully', createdBook);
    });

    it('should handle error and send 500 response', async () => {
      const req = {
        body: { title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.createBook.mockRejectedValue(new Error('Error'));

      await bookController.createBook(req, res); // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 500, 'Internal Server Error', null);
    });
  });

  describe('getBooks', () => {
    it('should get all books and send a response', async () => {
      const req = {} as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const books = [{ id: 1, title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 }];
      const totalBooks = 1;

      mockBookRepo.getBooks.mockResolvedValue({ books, totalBooks });
      await bookController.getBooks(req, res);
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, 'Data Book Fetched Successfully', {
        page: 1,
        totalPages: 1,
        totalBooks,
        books,
      });
    });
  });

  describe('getBookById', () => {
    it('should get a book by ID and send a response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const book = { id: 1, title: 'Test Book', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 };
      mockBookRepo.getBookById.mockResolvedValue(book);

      await bookController.getBookById(req, res);

      expect(mockBookRepo.getBookById).toHaveBeenCalledWith(1) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, 'Data Book Fetched Successfully', book);
    });

    it('should handle not found and send 404 response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.getBookById.mockResolvedValue(null);

      await bookController.getBookById(req, res);

      expect(mockBookRepo.getBookById).toHaveBeenCalledWith(1) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 404, 'Data not found', null);
    });

    it('should handle error and send 500 response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.getBookById.mockRejectedValue(new Error('Error'));

      await bookController.getBookById(req, res); // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 500, 'Internal Server Error', null);
    });
  });

  describe('updateBook', () => {
    it('should update a book and send a response', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Title', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const updatedBook = { id: 1, ...req.body };
      mockBookRepo.updateBook.mockResolvedValue(updatedBook);

      await bookController.updateBook(req, res);

      expect(mockBookRepo.updateBook).toHaveBeenCalledWith(1, req.body) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 201, 'Data book updated successfully', updatedBook);
    });

    it('should handle not found and send 404 response', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Title', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.updateBook.mockResolvedValue(null);

      await bookController.updateBook(req, res);

      expect(mockBookRepo.updateBook).toHaveBeenCalledWith(1, req.body) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 404, 'Data not found', null);
    });

    it('should handle error and send 500 response', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Title', author: 'Test Author', published_year: 2024, genres: ['Fiction'], stock: 10 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.updateBook.mockRejectedValue(new Error('Error'));

      await bookController.updateBook(req, res); // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 500, 'Internal Server Error', null);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and send a response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.deleteBook.mockResolvedValue(true);

      await bookController.deleteBook(req, res);

      expect(mockBookRepo.deleteBook).toHaveBeenCalledWith(1) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 201, 'Book deleted successfully', null);
    });

    it('should handle not found and send 404 response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.deleteBook.mockResolvedValue(false);

      await bookController.deleteBook(req, res);

      expect(mockBookRepo.deleteBook).toHaveBeenCalledWith(1) // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 404, 'Data not found', null);
    });

    it('should handle error and send 500 response', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockBookRepo.deleteBook.mockRejectedValue(new Error('Error'));

      await bookController.deleteBook(req, res); // Ensure it's called once
      expect(mockSendResponse).toHaveBeenCalledWith(res, 500, 'Internal Server Error', null);
    });
  });
});
