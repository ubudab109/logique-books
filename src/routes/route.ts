import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { validationHandler } from '../middlewares/validationHandler';
import { BookDto } from '../dto/book.dto';

const router = Router();
const bookController = new BookController();

router.post('/books', validationHandler(BookDto), bookController.createBook.bind(bookController));
router.get('/books', bookController.getBooks.bind(bookController));
router.get('/books/:id', bookController.getBookById.bind(bookController));
router.put('/books/:id', validationHandler(BookDto), bookController.updateBook.bind(bookController));
router.delete('/books/:id', bookController.deleteBook.bind(bookController));

export default router;
