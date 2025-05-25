const { getFiles } = require('./fileController');
const { getFolders } = require('./folderController');

module.exports = async function getUserUploads(userId) {
  const userFiles = await getFiles(userId);
  const userFolders = await getFolders(userId);
  return { files: userFiles, folders: userFolders };
};
