require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`${process.env.URL}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to db"));

db.once('open', function(){
    console.log("connected to MongoDB"); 
})

module.exports=db;
