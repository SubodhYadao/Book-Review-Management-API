const express = require('express');
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  searchBooks
} = require('../controllers/bookController');

const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchBooks);  //for the search query (search by auth and title)

router.post('/', protect, createBook); //Only Auth users can access
router.get('/', getAllBooks);
router.get('/:id', getBookById);

router.post('/:id/reviews', protect, addReview);  //spec. for adding a review

module.exports = router;
