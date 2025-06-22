const Review = require('../models/Review');
const Book = require('../models/Book');

// POST /books/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;
    const { rating, comment } = req.body;

    // Check if review already exists for this user & book (1 Review/user)
    const existingReview = await Review.findOne({ user: userId, book: bookId });
    if (existingReview) return res.status(400).json({ message: 'Review already exists' });

    const review = await Review.create({ user: userId, book: bookId, rating, comment });

    // Add review ref to book
    const book = await Book.findById(bookId);
    book.reviews.push(review._id);
    await book.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user._id;  //picking user id (who wrote the review)
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (!review.user.equals(userId)) return res.status(403).json({ message: 'Not authorized' });

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (!review.user.equals(userId)) return res.status(403).json({ message: 'Not authorized' });

    await review.remove();

    // Remove review from book.reviews array
    await Book.findByIdAndUpdate(review.book, { $pull: { reviews: reviewId } });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
