const prisma = require('../prisma');
const { cloudinaryDelete } = require('./fileController');

createFolderPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
      },
    });
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
};

async function getFolders(userId) {
  console.log(userId);
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
  });
  return folders;
}

async function deleteFolder(folderId) {
  const filesToDelete = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });
  filesToDelete.forEach((file) => {
    cloudinaryDelete(file.publicId);
  });
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
}

async function getFolder(folderId) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  return folder;
}

async function getFolderContents(folderId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });
  return files;
}

editFolderGet = async (req, res, next) => {
  try {
    const folderId = req.params.id;
    const folder = await getFolder(folderId);
    const files = await getFolderContents(folderId);
    const folders = await getFolders(req.user.id);
    console.log(folder);
    console.log(files);
    res.render('editFolder', {
      folder: folder,
      files: files,
      folders: folders,
    });
  } catch (err) {
    next(err);
  }
};

editFolderPost = async (req, res, next) => {
  try {
    const name = req.body['folder-name'];
    const { id } = req.params;
    await prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFolderPost,
  getFolders,
  deleteFolder,
  editFolderPost,
  editFolderGet,
};
