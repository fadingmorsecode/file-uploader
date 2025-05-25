const { Router } = require('express');
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const { isAuth } = require('./authMiddleware');
const getUserUploads = require('../controllers/driveController');
const {
  createFolderPost,
  deleteFolder,
} = require('../controllers/folderController');
const { uploadFile } = require('../controllers/fileController');

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
  try {
    const user = req.user;
    const filename = req.body.filename;
    await uploadFile(user.id, filename, 'placeholder link', null, 0);
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
});

router.get('/drive', isAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const uploads = await getUserUploads(user.id);
    res.render('drive', { user: user, uploads: uploads });
  } catch (err) {
    next(err);
  }
});

router.post('/delete-folder/:id', isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteFolder(id);
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
});

router.post('/create-folder', isAuth, createFolderPost);

module.exports = router;
