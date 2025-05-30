const { getFiles } = require('./fileController');
const { getFolders } = require('./folderController');

module.exports = async function getUserUploads(userId) {
  const userFiles = await getFiles(userId);
  userFiles.sort((a, b) => a.name.localeCompare(b.name));
  const userFolders = await getFolders(userId);
  userFolders.sort((a, b) => a.name.localeCompare(b.name));
  return { files: userFiles, folders: userFolders };
};
