const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => res.render('index'));

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/sign', (req, res, next) => {
  try {
    // insertion query

    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
