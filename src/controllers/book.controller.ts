import { Request, Response } from 'express';
import { BookRepository } from '../repositories/book.repository';
import { sendResponse } from '../utils/helper';

export class BookController {
  private bookRepo: BookRepository;

  constructor() {
    this.bookRepo = new BookRepository();
  }

  /**
   * The function `createBook` asynchronously creates a new book using data from the request body and
   * sends a response with the created book or an error message.
   * @param {Request} req - Request object containing information about the incoming HTTP request.
   * @param {Response} res - Response object from Express.js that represents the HTTP response that an
   * Express app sends when it gets an HTTP request.
   */
  async createBook(req: Request, res: Response): Promise<void> {
    try {
      const { title, author, published_year, genres, stock } = req.body;
      const newBook = await this.bookRepo.createBook({ title, author, published_year, genres, stock });
      sendResponse(res, 201, 'Data Book Created Successfully', newBook);
    } catch (error) {
      sendResponse(res, 500, 'Internal Server Error', null);
    }
  }

  /**
   * The function `getBooks` is an asynchronous function in TypeScript that retrieves a list of books
   * based on search criteria, page number, and limit, and sends a response with the fetched data.
   * @param {Request} req - Request object containing query parameters for searching books, specifying
   * page number, and setting a limit for the number of books per page.
   * @param {Response} res - The `res` parameter in the `getBooks` function represents the response
   * object in Express.js. It is used to send a response back to the client making the request. In this
   * function, the response object is used to send the fetched books data back to the client with
   * appropriate status codes and messages
   */
  async getBooks(req: Request, res: Response): Promise<void> {
    let search: string = '';
    let page: number = 1;
    let limit: number = 10;
    if (req && req.query) {
      search = (req.query.search as string) || '';
      page = parseInt(req.query.page as string, 10) || 1;
      limit = parseInt(req.query.limit as string, 10) || 10;
    }
    
    const { books, totalBooks } = await this.bookRepo.getBooks({
      search: search,
      page: page,
      limit: limit,
    });

    const totalPages = Math.ceil(totalBooks / limit);

    sendResponse(res, 200, 'Data Book Fetched Successfully', {
      page,
      totalPages,
      totalBooks,
      books,
    });
  }

  /**
   * The function `getBookById` fetches a book by its ID and sends a response with the book data or an
   * error message.
   * @param {Request} req - Request object containing information about the HTTP request
   * @param {Response} res - The `res` parameter in the `getBookById` function is an instance of the
   * Express Response object. It is used to send the HTTP response back to the client with the data or
   * error message.
   * @returns In the `getBookById` function, a response is being sent based on the outcome of the
   * asynchronous operation. If the book is found, a success response with status code 200 and the book
   * data is sent. If the book is not found, a response with status code 404 and a message indicating
   * data not found is sent. If an error occurs during the process, a response with status
   */
  async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const book = await this.bookRepo.getBookById(id);

      if (!book) {
        sendResponse(res, 404, 'Data not found', null);
        return;
      }
      sendResponse(res, 200, 'Data Book Fetched Successfully', book);
    } catch (error) {
      sendResponse(res, 500, 'Internal Server Error', null);
    }
  }

  /**
   * This TypeScript function updates a book record in a database and sends appropriate responses based
   * on the outcome.
   * @param {Request} req - The `req` parameter in the `updateBook` function stands for the request
   * object. It contains information about the incoming HTTP request such as headers, parameters, body,
   * and more. In this context, it is used to extract the book details (title, author, published year,
   * genres, stock
   * @param {Response} res - The `res` parameter in the `updateBook` function is an instance of the
   * Express Response object. It is used to send the HTTP response back to the client after processing
   * the request. The response object contains methods and properties that allow you to send data, set
   * headers, and control the response status
   * @returns The `updateBook` function is returning a Promise with a void type. This means that it
   * does not explicitly return a value, but it indicates that the function will eventually complete
   * with no specific return value.
   */
  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { title, author, published_year, genres, stock } = req.body;

      const updatedBook = await this.bookRepo.updateBook(id, { title, author, published_year, genres, stock });

      if (!updatedBook) {
        sendResponse(res, 404, 'Data not found', null);
        return;
      }

      sendResponse(res, 201, 'Data book updated successfully', updatedBook);
    } catch (error) {
      sendResponse(res, 500, 'Internal Server Error', null);
    }
  }

  /**
   * The function `deleteBook` asynchronously deletes a book from a repository based on the provided ID
   * and sends an appropriate response.
   * @param {Request} req - Request object containing information about the HTTP request
   * @param {Response} res - The `res` parameter in the `deleteBook` function is an instance of the
   * Express Response object. It is used to send the HTTP response back to the client with the
   * appropriate status code, headers, and data.
   * @returns In the `deleteBook` function, a response is being sent back to the client based on the
   * outcome of the deletion operation. If the deletion is successful, a response with status code 201
   * and message 'Book deleted successfully' is sent. If the deletion operation fails (e.g., data not
   * found), a response with status code 404 and message 'Data not found' is sent. In
   */
  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const success = await this.bookRepo.deleteBook(id);

      if (!success) {
        sendResponse(res, 404, 'Data not found', null)
        return;
      }
      sendResponse(res, 201, 'Book deleted successfully', null)
    } catch (error) {
      sendResponse(res, 500, 'Internal Server Error', null);
    }
  }
}
