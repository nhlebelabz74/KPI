require('dotenv').config(); // Import the dotenv module to read environment variables

// Import the mongoose module
const mongoose = require("mongoose");

// clientOptions for the MongoDB connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

/**
 * @description Asynchronously connects to the MongoDB database using the connection URI from the environment variables.
 * @returns {Promise<void>} A promise that resolves when the database connection is established.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the database
        await mongoose.connect(process.env.CONNECTION_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 }); // Ping the database to check if the connection is successful
    } catch (error) {
        // If an error occurred, log it to the console
        console.log(error);
        await mongoose.connection.close(); // Close the connection
    }
}

// Export the connectDB function as a module
module.exports = connectDB;