let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
// let logger = require('morgan');
let fs = require('fs');
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = "debug";


let indexRouter = require('./routes/index');
let app = express();
app.set('logger', logger);
let jwt=require('jsonwebtoken');
app.set('jwt', jwt);
let expressSession = require('express-session');

app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized : true
}))

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let crypto = require('crypto');
//W1-singup
const { MongoClient } = require("mongodb");

//---------------------------Connection to MongoDB------------------------------
const url = 'mongodb+srv://admin:sdi@socialnetwork.ddcue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
app.set('connectionStrings', url);
//---------------------------Connection to MongoDB------------------------------

//W1-signup
app.set("pageLimit", 5)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type , token
  next();
});

const userRouterLog = require("./routes/userRouter");
app.use("/users/signup", userRouterLog);
app.use("/users/login", userRouterLog);
app.use("/users/logout", userRouterLog);

const userSessionRouter = require("./routes/userSessionRouter");
app.use("/users", userSessionRouter);
app.use("/publications/add", userSessionRouter);
app.use("/publications/listown", userSessionRouter);
app.use("/friends", userSessionRouter);
app.use("/request/list", userSessionRouter);


const adminUserRouter = require("./routes/adminUserRouter");
app.use("/admin/list", adminUserRouter);
app.use("/admin/delete", adminUserRouter);

const userTokenRouter = require("./routes/userTokenRouter");
app.use("/api/v1.0/messages/add", userTokenRouter);
//app.use("/api/v1.0/messages/conversation", userTokenRouter);
app.use("/api/v1.0/messages/setAsRead/:id", userTokenRouter);
app.use("/api/v1.0/friends/list", userTokenRouter);


//--------------------------Repositories----------------------------------------
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);
const friendsRepository = require("./repositories/friendsRepository.js");
friendsRepository.init(app, MongoClient);

require("./routes/users.js")(app, usersRepository, friendsRepository);

require("./routes/friends.js")(app, usersRepository, friendsRepository);

const publicationsRepository = require("./repositories/publicationsRepository.js");
publicationsRepository.init(app, MongoClient);
require("./routes/publications.js")(app, publicationsRepository, friendsRepository);

const messagesRepository = require("./repositories/messajesRepository.js");
messagesRepository.init(app,MongoClient);
require("./routes/api/socialNetworkApi")(app, messagesRepository, usersRepository, friendsRepository);

require("./routes/admin.js")(app, usersRepository, friendsRepository, publicationsRepository, messagesRepository);
//--------------------------Repositories----------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//----------------------------- Logger --------------------------
/**
app.use(logger('common', {
  stream: fs.createWriteStream('logs.txt')
}));
app.use(logger('dev')); */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
