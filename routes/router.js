const { Router } = require('express');
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');

const router = Router();

router.get('/', (req, res) => res.render('index'));

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

module.exports = router;
