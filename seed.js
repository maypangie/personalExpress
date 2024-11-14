const MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://earth2may:ufICcWxG08TQLZqK@mymovierater.wc7nv.mongodb.net/movieRatings?retryWrites=true&w=majority&appName=myMovieRater";
const dbName = "movieRater";

const movies = [
    { title: 'The Substance', star: 0 },
    { title: 'Smile 2', star: 0 },
    { title: 'Longlegs', star: 0 }
];

async function seedDatabase() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        await db.collection('movies').deleteMany({});
        await db.collection('movies').insertMany(movies);
        console.log('Database seeded successfully!');
    } finally {
        await client.close();
    }
}

seedDatabase().catch(console.error);
