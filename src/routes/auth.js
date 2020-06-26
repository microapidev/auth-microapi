const router = require('express').Router();
const { User } = require('../models/user');
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

router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) { return res.json({ success: false, err }); }
    return res.status(200).json({
      success: true,
      doc,
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) { return res.json({ loginSuccess: false, message: 'Wrong password' }); }

      user.generateToken((err, user) => {
        if (err) { return res.status(400).send(err); }
        res.cookie('w_authExp', user.tokenExp);
        res
          .cookie('w_auth', user.token)
          .status(200)
          .json({
            loginSuccess: true, userId: user._id,
          });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '', tokenExp: '' }, (err, doc) => {
    if (err) { return res.json({ success: false, err }); }
    return res.status(200).send({
      success: true,
    });
  });
});
module.exports = router;
