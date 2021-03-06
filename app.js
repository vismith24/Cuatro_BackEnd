var createError = require("http-errors");
const express = require('express');
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require('cookie-parser');
const config = require("./config");
//const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const connectionString = config.MONGO_DB_CONN_STRING;   // Connection String for MongoDB Atlas
var indexRoutes = require("./Routers/index");
var authRoutes = require("./Routers/auth");
var userRoutes = require("./Routers/users");
var orderRoutes = require("./Routers/order");
var musicRoutes = require("./Routers/music");
var storeRoutes = require('./Routers/store');
var cartRoutes = require('./Routers/cart');
var playlistRoutes = require('./Routers/playlist');
var searchRoutes = require('./Routers/search');

/*
mongoose.connection.on('connected', function() {
    // Hack the database back to the right one, because when using mongodb+srv as protocol.
    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mongoose.connection.db = mongoose.connection.client.db('NAMAHA');
    }
    console.log('Connection to MongoDB established.')
});
*/

const InitiateMongoServer = async () => {
    try {
      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      console.log('Connection to MongoDB established.');
    } 
    catch (e) {
      console.log(e);
      throw e;
    }
  };
  

InitiateMongoServer();     // Connect to the MongoDB Server 

const app = express();

const corsOptions = {
    origin: true,
    credentials: true
};
app.options("*", cors(corsOptions));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
next(createError(404));
});
*/

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get("env") === "development" ? err : {};

// render the error page
res.status(err.status || 500);
res.render("error");
}); 

app.use('/', indexRoutes);
app.use('/users/', userRoutes);
app.use('/auth/', authRoutes);
app.use('/order/', orderRoutes);
app.use('/music/', musicRoutes);
app.use('/store/', storeRoutes);
app.use('/cart', cartRoutes);
app.use('/playlist', playlistRoutes);
app.use('/search', searchRoutes);

module.exports = app;