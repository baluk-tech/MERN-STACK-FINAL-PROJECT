const mongoose = require('mongoose');
mongoose.connect( process.env.MONGODB_URI );
var db = mongoose.connection

db.on("error", (error) => {
    console.log("Error connecting to the DataBase: ", error);
});

db.once("open", () => {
    console.log("Connected to the DataBase successfully!");
});

module.exports = db;