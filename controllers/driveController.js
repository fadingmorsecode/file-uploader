const { getFiles } = require('./fileController');
const { getFolders } = require('./folderController');

module.exports = async function getUserUploads(userId) {
  const userFiles = await getFiles(userId);
  const userFolders = await getFolders(userId);
  console.log(userFiles);
  console.log(userFiles);
  return { files: userFiles, folders: userFolders };
};
