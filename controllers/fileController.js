const prisma = require('../prisma');

async function getFiles(userId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
    },
  });
  return files;
}

async function uploadFile(userId, name, link, folderId, size) {
  await prisma.file.create({
    data: {
      name: name,
      link: link,
      folderId: folderId,
      userId: userId,
      size: size,
    },
  });
}

deleteFilePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.file.delete({
      where: {
        id: id,
      },
    });
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
};

module.exports = { getFiles, uploadFile, deleteFilePost };
