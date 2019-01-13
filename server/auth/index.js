const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const db = require("../db/connection");
const users = db.get("users");
users.createIndex("username", { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required()
});

// any route in here is pre-pended with /auth
router.get("/", (req, res) => {
  res.json({
    message: ""
  });
});

router.post("/signup", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    // make sure username is unique
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        // if user is undefined, username is not in the db, otherwise, dubplicate user
        // respond with an error!
        if (user) {
          // there is already a user in the db with the username
          res.status(409);
          next(error);
        } else {
          // hash the password
          // insert the user with the has password
          bcrypt.hash(req.body.password, 15).then(hashedPassword => {
            const newUser = {
              username: req.body.username,
              password: hashedPassword
            };

            users.insert(newUser).then(insertedUser => {
              delete insertedUser.password;
              // delete the passowrd from the resposne so when the user gets the post request
              // they cant see the PS but will still be in the db
              // sneding back the hased PS is bad... obviously
              res.json(insertedUser);
            });
          });
        }
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

module.exports = router;
