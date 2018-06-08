var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors')

var app = express();
app.use(cors());

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

mongoose.connect("mongodb://localhost:27017/myshoppingdb");

var products = require("./models/products");

// GET - get product
app.get("/wsproducts", (req, res) => {
  products.find((err, data) => {
    if (err) {
      throw err;
    }
    res.json(data);
  })
});

// POST - create a new product
app.post("/wsproducts", (req, res) => {
  let newproduct = req.body;
  products.create(newproduct, (err, data) => {
    if (err) {
      throw err;
    }
    res.json(data);
  })
})

// DELETE - DELETE AN EXISTING product
app.delete("/wsproducts/:id", (req, res) => {  
  let query = {_id: req.params.id};
  products.remove(query, (err, data) => {
    if (err) {
      throw err;
    }
    res.json(data);
  })
})

// Update - Update AN EXISTING product
app.put("/wsproducts/:id", (req, res) => {
  let query = {_id: req.params.id};
  let modifiedProduct = req.body;
  let update = {'$set': {
    name: modifiedProduct.name,
    price: modifiedProduct.price
  }}
  let options = {new : true};
  products.findOneAndUpdate(query, update, options, (err, data) => {
    if (err) {
      throw err;
    }
    res.json(data);
  })
})

app.get("*", (req,res) => {
  res.send("my shopping products web service API");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
