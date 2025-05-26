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

viewFileDetailsGet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileDetails = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });
    console.log(fileDetails);
    res.render('fileDetails', { details: fileDetails });
  } catch (err) {
    next(err);
  }
};

fileDownloadPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });
    const downloadLink = file.link;
    console.log(downloadLink);
    // do something with downloadLink...
    res.redirect('/drive');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFiles,
  uploadFile,
  deleteFilePost,
  viewFileDetailsGet,
  fileDownloadPost,
};
