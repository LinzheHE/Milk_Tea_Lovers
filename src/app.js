if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require("connect-mongo")(session);
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// require error handlers
const ExpressError = require('./utils/ExpressError');

// require the routers
const userRoutes = require('./routes/users');
const shopRoutes = require('./routes/shops');
const reviewRoutes = require('./routes/reviews');

// require the user model for authentication
const User = require('./models/user');


// connect to the database (mongoDB, using mongoose); local: 'mongodb://127.0.0.1:27017/yelp-camp'
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


// implement the express framework
const app = express();

// implement the ejs-mate engine for ejs
app.engine('ejs', ejsMate);

// implement templating (using ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//------------------- Middlewares -------------------//
// global middlewares (run on every request)
app.use(express.urlencoded({ extended: true })); //parse the POST request body
app.use(methodOverride('_method')); //allow method override

// middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// session middleware for cookie and flash
const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeabettersecret',
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expire in one week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// flash middlewares
app.use(flash());

// authentication and authorization middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set the messages in req.flash as local variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//-------------- build the RESTful APIs for CRUD --------------//

// use the routers for shops and reviews
app.use('/', userRoutes);
app.use('/shops', shopRoutes);
app.use('/shops/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
})


//-------------- error handler --------------//
// when no previous routes is matched
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404)) //the ExpressError will hit next middleware
})

app.use((err, req, res, next) => {
    // deconstruct statusCode from the err (ExpressError), set default statusCode to 500
    const { statusCode = 500 } = err;
    // check and define the message in err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    // pass err to the error template
    res.status(statusCode).render('error', { err });
})


//-------------- set the server --------------//
app.listen(3000, () => {
    console.log('Serving on port 3000');
})