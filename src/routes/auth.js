const router = require('express').Router();
const { User } = require('../models/user');
const validation = require('../validation/authValidation');
const { auth } = require('../middleware/auth');

router.get('/active', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.isAdmin,
    isAuth: true,
    email: req.user.email,
    username: req.user.username,
  });
});

router.post('/register', validation.registerValidation(), (req, res) => {
  User.findOne({ email: req.body.email }, (err, check_user) => {
    if (check_user) {
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email already exist',
      });
    }
    const user = new User(req.body);
    user.save((err, doc) => {
      if (err) {return res.json({ success: false, err });}
      return res.status(200).json({
        success: true,
        doc,
      });
    });
  });
});

router.post('/login', validation.loginValidation(), (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: 'Wrong password' });
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});


router.post('/change_password', (req, res,next) =>{
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;  
  
  User.findById(userId).then( user => {
    user.comparePassword(oldPassword, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ success: false, message: 'Wrong password' });
      }else{
        user.password = newPassword;
        user.save().then( saved=> {
          return res.status(200).json({
            success: true,
            data: saved
          })
        }).catch(err => {
          return res.json({ success: false, err });
        })
      }
    })
    
  }).catch( err => {
    return res.json({ success: false, err });
  })
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) {
        return res.json({ success: false, err });
      }
      return res.status(200).send({
        success: true,
      });
    },
  );
});
module.exports = router;
