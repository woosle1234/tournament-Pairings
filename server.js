const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const routes = require('./routes')
var path    = require("path");
require('dotenv').config();


 //import mongoose
 const mongoose = require('mongoose');

 //establish connection to database
 mongoose.connect(
    process.env.MONGODB_URI,
     { useUnifiedTopology: true, useNewUrlParser: true},
     (err) => {
         if (err) return console.log("Error: ", err);
         console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
     }
 );
 

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/uploads', express.static('./uploads'));
app.use(express.static(path.join(__dirname, 'html'))); 


app.use("/",routes);

app.listen(PORT, function() {
    console.log('listening on '+PORT)
  })