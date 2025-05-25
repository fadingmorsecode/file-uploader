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

module.exports = { getFiles, uploadFile };
