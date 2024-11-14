const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

let db;
const url = "mongodb+srv://earth2may:ufICcWxG08TQLZqK@mymovierater.wc7nv.mongodb.net/movieRatings?retryWrites=true&w=majority&appName=myMovieRater";
const dbName = "movieRater";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    db = client.db(dbName);
    console.log("Connected to database: " + dbName);

    // Start the server only after connecting to the database
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to fetch movies and render index.ejs
app.get('/', async (req, res) => {
    try {
        const movies = await db.collection('movies').find().toArray();
        const messages = await db.collection('messages').find().toArray();
        res.render('index.ejs', { movies, messages });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
});

// Route to add a new comment
app.post('/messages', (req, res) => {
    db.collection('messages').insertOne(
        { msg: req.body.msg, star: 0, thumbDown: 0 },
        (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err });
            console.log('Comment saved to database');
            res.json({ success: true, message: result.ops[0] });
        }
    );
});

// Route to like a comment
app.put('/messages', (req, res) => {
    db.collection('messages').findOneAndUpdate(
        { msg: req.body.msg },
        { $inc: { star: 1 } },
        { returnDocument: 'after' },
        (err, result) => {
            if (err) {
                console.error('Error updating like count:', err);
                return res.status(500).send({ success: false });
            }
            res.send({ success: true, updatedStar: result.value.star });
        }
    );
});

// Route to like a movie
app.put('/movies/like', (req, res) => {
    db.collection('movies').findOneAndUpdate(
        { title: req.body.title },
        { $inc: { star: 1 } },
        { returnDocument: 'after' },
        (err, result) => {
            if (err) {
                console.error('Error updating movie star count:', err);
                return res.status(500).send({ success: false });
            }
            res.send({ success: true, updatedStar: result.value.star });
        }
    );
});

// Route to delete a comme


app.delete('/messages', (req, res) => {
    const { msg } = req.body;

    db.collection('messages').findOneAndDelete(
        { msg: msg },
        (err, result) => {
            if (err) {
                console.error('Error deleting comment:', err);
                return res.status(500).send({ success: false });
            }

            if (!result.value) {
                // If no document was found to delete
                return res.status(404).send({ success: false, message: 'Comment not found' });
            }

            res.send({ success: true });
        }
    );
});

