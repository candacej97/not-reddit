const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
  // if the username or password is too short, call the errorCallback
  if (username.length < 8 || password.length < 8) {
    errorCallback({ message: "USERNAME/PASSWORD TOO SHORT" });
  }

  // check if the user already exists
  User.findOne({ username: username }, (err, result) => {
    if (result) {
      errorCallback({ message: "USERNAME ALREADY EXISTS" });
    }
    else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          new User({ username: username, password: hash, email: email }).save((err, savedUser) => {
            if (err) {
              errorCallback({ message: "DOCUMENT SAVE ERROR" });
            }
            if (savedUser) {
              successCallback(savedUser);
            }
          });    
        });
      });
    }
  });
}

function login(username, password, errorCallback, successCallback) {
  User.findOne({ username: username }, (err, user) => {
    if (!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (passwordMatch) {
          successCallback(user);
        }
        else {
          errorCallback({ message: "PASSWORDS DO NOT MATCH" });
        }
      });
    }
    else {
      errorCallback({ message: "USER NOT FOUND" });
    }
  });
}

function startAuthenticatedSession(req, user, cb) {
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user;
      cb();
    }
    else {
      console.log(`ERROR: ${err}`);
      cb(err);
    }
  });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
