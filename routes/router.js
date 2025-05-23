const { Router } = require('express');
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const { isAuth } = require('./authMiddleware');

const router = Router();

router.get('/', (req, res) =>
  res.render('index', {
    message: req.flash('error'),
    user: req.user,
  })
);

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    console.log(user);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/upload', isAuth, (req, res, next) => {
  res.render('upload');
});

router.post('/upload', isAuth, async (req, res, next) => {
  const { filename } = req.body;
  console.log('upload:', filename);
  res.redirect('upload');
});

module.exports = router;
