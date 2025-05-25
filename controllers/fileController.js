const prisma = require('../prisma');

async function getFiles(userId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
    },
  });
  return files;
}

module.exports = { getFiles };
