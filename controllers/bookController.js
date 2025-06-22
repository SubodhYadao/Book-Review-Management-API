const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res) => {  //Create a Book
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBooks = async (req, res) => { //GET books
  try {
    const { page = 1, limit = 5, author, genre } = req.query;  //5 Books per page (pagination eff.)
    const query = {};
    if (author) query.author = new RegExp(author, 'i');  //opt. query for author
    if (genre) query.genre = new RegExp(genre, 'i'); //opt. query for genre

    const books = await Book.find(query)
      .skip((page - 1) * limit)  //skip all previous n-1 docs (only desired page onwards)
      .limit(parseInt(limit));  //further applying a 5 lim for a single page eff.
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const totalReviews = await Review.countDocuments({ book: book._id });

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const ratings = await Review.find({ book: book._id }).select('rating');
    const avgRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 'No ratings yet';

    res.json({
      ...book.toObject(),
      avgRating,
      reviews,
      pagination: {
        total: totalReviews,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Use case-insensitive regex to search title or author
    const regex = new RegExp(query, 'i');

    const books = await Book.find({
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } }
      ]
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
