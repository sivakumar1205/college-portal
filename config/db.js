const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI;

    if(!MONGO_URI) {
        console.error('Error: Neither MONGO_URL nor MONGO_URI is defined in the environment (.env file).');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected TO MONGODB Successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;