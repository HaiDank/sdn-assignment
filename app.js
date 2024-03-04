var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const adminRouter = require('./routes/admins')
const authRouter = require('./routes/auth')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const expressLayouts = require('express-ejs-layouts');

const url = 'mongodb://localhost:27017/assignment3';
mongoose.connect(url).then((db) => {
	console.log('mongodb connected');
});

require('./config/passport')(passport);

var app = express();

app.use(
	session({
		secret: 'dangvnhse170225',
		resave: false,
		saveUninitialized: false,
		cookie: {secure: false}
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(passport.authenticate('session'));

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});


// view engine setup
app.use(expressLayouts);
app.set('layout', './layouts/main');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


//routes

app.use('/', indexRouter);
app.use('/auth/google', authRouter)
app.use('/users', usersRouter);
app.use('/admin', adminRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
