const dotenv = require('dotenv');  //abstracting sensitive data
dotenv.config();

const express = require('express'); //server
const mongoose = require('mongoose');  //connects node.js to MongoDb 

const app = express();  //server on
app.use(express.json()); //parse json data in http req

const authRoutes = require('./routes/authRoutes');  //for mounting the auth routes
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Health check route
app.get('/', (req, res) => {
  res.send('Book Review API is running');
});

app.use('/auth', authRoutes);

app.use('/books', bookRoutes);

app.use('/reviews', reviewRoutes);


// Connect DB & Start Server

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {  //either PORT or 3000
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.error(err));
