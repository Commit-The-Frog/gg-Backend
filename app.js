const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const { connectMongoDB } = require('./config/mongodbConfig');
const { swaggerUi, specs } = require('./swagger/swagger');

const indexRouter = require('./controller/index');
const usersRouter = require('./controller/users');
const authRouter = require('./controller/auth');
const bookRouter = require('./controller/book');
const sseRouter = require('./controller/sse');
const tournamentRouter = require('./controller/tournament');
const adminRouter = require('./controller/admin');
const reportRouter = require('./controller/reportPost');
const cors = require('cors');

// CORS 미들웨어 추가
const app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/sse', sseRouter);
app.use('/tournament', tournamentRouter);
app.use('/reports', reportRouter);
app.use(`/${process.env.ADMIN_PAGE_ENDPOINT}`, adminRouter)

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// connect MongoDB
connectMongoDB();

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
