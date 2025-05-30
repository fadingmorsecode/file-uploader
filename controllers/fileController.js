const prisma = require('../prisma');
const cloudinary = require('../utils/cloudinaryConfig');

async function getFiles(userId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
    },
  });
  return files;
}

async function uploadFile(userId, name, link, folderId, size, publicId) {
  const data = {
    name: name,
    link: link,
    size: size,
    author: {
      connect: { id: userId },
    },
    publicId: publicId,
  };

  if (folderId) {
    data.Folder = {
      connect: { id: folderId },
    };
  }
  await prisma.file.create({ data });
}

cloudinaryDelete = async (id) => {
  await cloudinary.api.delete_resources([id], {
    resource_type: 'raw',
  });
};

deleteFilePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });
    await prisma.file.delete({
      where: {
        id: id,
      },
    });
    cloudinaryDelete(file.publicId);
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
    res.render('fileDetails', { details: fileDetails, user: req.user });
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
    res.redirect(downloadLink);
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
  cloudinaryDelete,
};
