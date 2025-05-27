const { Router } = require('express');
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const { isAuth } = require('./authMiddleware');
const getUserUploads = require('../controllers/driveController');
const path = require('path');
const streamifier = require('streamifier');
const { v4: uuidv4 } = require('uuid');
const {
  createFolderPost,
  deleteFolder,
  editFolderPost,
  editFolderGet,
} = require('../controllers/folderController');
const {
  uploadFile,
  deleteFilePost,
  viewFileDetailsGet,
  fileDownloadPost,
} = require('../controllers/fileController');
const cloudinary = require('../utils/cloudinaryConfig');
const upload = require('../utils/multer');

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
    res.redirect('/');
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
      return res.status(400).json({
        error:
          'A user with that username already exists. Please choose a different username.',
      });
    }
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

router.get('/upload', isAuth, async (req, res, next) => {
  try {
    const { folders } = await getUserUploads(req.user.id);
    res.render('upload', { folders: folders });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/upload',
  isAuth,
  upload.single('filename'),
  async (req, res, next) => {
    console.log(req.file);
    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: path.parse(req.file.originalname).name,
        },
        async (error, result) => {
          if (error) {
            return next(error);
          }
          console.log(result);
          const user = req.user;
          const filename = req.file.originalname;
          const link = result.secure_url;
          const sizeMB = parseFloat((result.bytes / (1024 * 1024)).toFixed(2));
          console.log(sizeMB);
          let folderId = req.body.folderId;
          await uploadFile(
            user.id,
            filename,
            link,
            folderId || null,
            sizeMB,
            result.public_id
          );
          res.redirect('/drive');
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (err) {
      next(err);
    }
  }
);

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

router.get('/share/:id', isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const generatedShareId = uuidv4();
    const folder = await prisma.folder.findUnique({
      where: { id: req.params.id },
    });
    const updated = await prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        shareId: folder.shareId || generatedShareId,
      },
    });
    const shareLink = `${req.protocol}://${req.get('host')}/shared/folder/${
      updated.shareId
    }`;
    res.render('shareLink', { folder: updated, shareLink: shareLink });
  } catch (err) {
    next(err);
  }
});

router.get('/shared/folder/:id', async (req, res, next) => {
  const shareId = req.params.id;
  const folder = await prisma.folder.findFirst({
    where: {
      shareId: shareId,
    },
    include: {
      files: true,
    },
  });
  console.log(folder);
  res.render('sharedFolder', { folder: folder });
});

router.get('/edit-folder/:id', isAuth, editFolderGet);

router.post('/edit-folder/:id', isAuth, editFolderPost);

router.post('/create-folder', isAuth, createFolderPost);

router.post('/delete-file/:id', isAuth, deleteFilePost);

router.get('/file/:id', viewFileDetailsGet);

router.post('/download/:id', fileDownloadPost);

module.exports = router;
