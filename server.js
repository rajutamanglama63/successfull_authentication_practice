const express = require("express");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const postRoutes = require("./routes/authenticatedRouter");
const { ensureAuthenticated } = require("./config/auth");


const app = express();

// Passport Config
require('./config/passport')(passport);


dotenv.config();
const Port = process.env.PORT || 4040;

// connection DB
connectDB();

// setting view engine
app.use(expressLayouts);
app.set("view engine", "ejs");

// express bodyParser
app.use(express.urlencoded({extended:true}));

// session middleware
app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// embedding assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));

// static routes
app.get('/', (req, res) => {
    res.render("welcome");
})

// app.get('/register', (req, res) => {
//     res.render("register");
// })

// app.get('/login', (req, res) => {
//     res.render("login");
// })

app.get('/dashbord', ensureAuthenticated, (req, res) => {
    res.render("dashbord", {
        username: req.user.username
    });
})

// post routers of mongodb
app.use('/users', postRoutes);

app.listen(Port, () => {
    console.log(`Server running on port http://localhost:${Port}`);
})