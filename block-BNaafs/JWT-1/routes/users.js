var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ msg: 'JWT' });
});

router.post('/register', async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);
    if (!result) {
      res.status(400).json({ error: 'Invalid Password' });
    }
    var token = await user.signToken();
    console.log(token);
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
