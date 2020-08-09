const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, 'profilePic' + req.body._id + file.originalname);
    }
  });
  
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter
});
  
const userController = require('../controllers/user');

router.post('/login', userController.users_get_user)

router.get('/getuser/:_id', userController.get_users)

router.post('/signup', upload.single('pic') , userController.users_create_user)
//router.post('/signup', upload.array('pic', 12) , userController.users_create_user)

router.patch('/:_id', checkAuth, userController.users_update_user)

router.delete('/:_id', checkAuth, userController.users_delete_user)

module.exports = router;