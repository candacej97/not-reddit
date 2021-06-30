const express = require('express');
const mongoose = require('mongoose');

require('./db');

const Article = mongoose.model('Article');
const User = mongoose.model('User');

const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();

// change views directory
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    Article.find({}, (err, result) => {
        if (!err) {
            res.render('index', { result: result });
        } 
        else {
            console.log(`ERROR ON ARTICLES FIND: ${err}`);
        }
    });
});

app.get('/article/add', (req, res) => {
    if (req.session.user) {
        res.render('article-add');
    }
    else {
        res.redirect('/login');
    }
});

app.post('/article/add', (req, res) => {
    if (req.session.user) {
        const {title, url, description} = req.body;
        // add new article
        new Article({ title: title, url: url, description: description, postedBy: req.session.user.username }).save((err, savedArticle) => {
            if (savedArticle) {
                // console.log(`Saved Article ._id: ${savedArticle._id}`);
                // console.log(`Current User: ${JSON.stringify(req.session.user)}`);

                const usersArticles = req.session.user['articles'];
                usersArticles.push(savedArticle._id);
                
                // add new article id to user's props
                User.findOneAndUpdate({ username: req.session.user.username }, { articles: usersArticles }, { new: true }, (err, doc) => {
                    if (!err) {
                        console.log(`NEW DOCUMENT: ${doc}`);
                    }
                    else {
                        console.log(`ERROR ON DOCUMENT UPDATE: ${err}`);
                    }
                });
                // redirect after adding article
                res.redirect('/');
            }
            else {
                res.render('article-add', { message: "Could not save the article." });
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

app.get('/article/:slug', (req, res) => {
    Article.findOne({slug: req.params.slug}, (err, result) => {
        if (!err) {            
            res.render('article-detail', { result: result });
        }
        else {
            console.log(`ERROR ON ARTICLES FIND: ${err}`);
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    auth.register(username, email, password, (err) => {
        res.render('register', err);
    }, (user) => {
        auth.startAuthenticatedSession(req, user, (err) => {
            if (!err) {
                res.redirect('/');
            }
        });
    });
});
        

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    auth.login(username, password, (err) => {
        res.render('login', err);
    }, (user) => {        
        auth.startAuthenticatedSession(req, user, (err) => {
            if (!err) {
                res.redirect('/');
            }
        });        
    });
});

// Extra Credit Route - Show all entries made by a specific user
app.get('/:username', (req, res) => {    
    User.findOne({username: req.params.username}, (err, result) => {
    
        const arrObjIds = [];
        for (const val of result.articles) {
            arrObjIds.push(mongoose.Types.ObjectId(val));
        }

        Article.find({ '_id': { $in: arrObjIds } }, (err, usersArticles) => {
            if (!err) {
                res.render('index', {username: req.params.username, result: usersArticles});
            }
            else {
                console.log(`ERROR RETRIEVING USER ARTICLES: ${err}`);  
            }
        });
    });
});

app.listen(3000);
