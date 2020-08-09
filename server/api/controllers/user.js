const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = require('../../nodemon.json');
const User = require('../models/user');

exports.users_create_user = (req, res, next) => {
User.find({ email: req.body.email })
.exec()
.then(user => {
  if (user.length >= 1) {
    return res.status(409).json({
      message: "Mail exists"
    });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      } else {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          mblno: req.body.mblno,
          pic: req.file
          //for multiple files 
          //pic: req.files
        });
        user
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "User created",
              result
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          })}
    });}
});}

exports.users_get_user = (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          key.env.JWT_KEY,
          {
            expiresIn: "1h"
          } 
        );
        return  res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
  };

  exports.users_update_user = (req, res, next) => {
    User.findByIdAndUpdate({_id: req.params._id}, req.body).then(function(){
         User.findOne({_id: req.params._id}).then(function(ninja){
             res.send(ninja);
         });
     }).catch(next);
 };

  exports.users_delete_user = (req, res, next) => {
    User.findByIdAndDelete({ _id: req.params._id })
    .exec()
    .then(result => {
    res.status(200).json({
        message: "Order deleted",
        result
    });
    })
    .catch(err => {
    res.status(500).json({
        error: err
    });
    });
};

exports.get_users = (req, res, next) => {
  User.findById(req.params._id)
    //.populate("product")
    .exec()
    .then(docs => {
     // if (!order) {
       // return res.status(404).json({
         // message: "Name not found"
        //});
      //}
      res.status(200).json({
        docs,
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
