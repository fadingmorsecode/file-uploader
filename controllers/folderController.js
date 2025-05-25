const prisma = require('../prisma');

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
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
  });
  return folders;
}

async function deleteFolder(folderId) {
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
}

module.exports = { createFolderPost, getFolders, deleteFolder };
