# Link Aggregator

## Description

Create a link aggregator site (like reddit, hacker news, etc.) that supports user registration and login… along with the ability to post articles (links).

Registering or logging in will create an authenticated session that contains all of the logged in user's information. Some elements on pages will only appear when a user is logged in. Some pages will redirect to login if a user arrives unauthenticated.

### Goals

* use bcrypt.js to salt and hash a password and to compare a hash to a plain text password
* use the slides on authentication to implement login and registration
* use express-session to store user data / an authenticated session
* use embedded or related documents to model users and posted articles
* extract path components to determine what data to use to render a page

### Features

1. register a new account
2. login using an existing account
3. add a new article
4. view all posted articles
5. show a single article's details
6. prevent / allow access to certain ui elements or pages based on authenticated status

### Routes

/ - lists all articles
/register - register form
/login - login form
/article/add - add new article form
/article/:slug - detail page for a specific article

## Built With

* MongoDB
* NodeJS
    * express-session
    * express
    * Handlebars
    * Mongoose
    * mongoose-url-slugs
    * bcryptjs

## Run Instructions

```
git clone <GIT REPO URL>
cd <GIT REPO NAME>/link-aggregator
npm install
npm start
```

**NOTE**: Make sure to set up a MongoDB instance
go to your browser at type in `localhost:3000`