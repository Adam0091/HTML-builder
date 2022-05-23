const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

(function copyDir(folderPath, folderCopyPath) {
  fs.rm(folderCopyPath, { recursive: true, force: true }, (err) => {
    if (err) console.error(err);

    fs.mkdir(
      folderCopyPath,
      { recursive: true },
      (err) => err && console.error(err)
    );
    fs.readdir(folderPath, { withFileTypes: true }, (err, result) => {
      if (err) console.error(err);

      for (const file of result) {
        const filePath = path.join(folderPath, file.name);
        const fileCopyPath = path.join(folderCopyPath, file.name);

        if (file.isFile())
          fs.copyFile(
            filePath,
            fileCopyPath,
            (err) => err && console.error(err)
          );

        if (file.isDirectory()) copyDir(filePath, fileCopyPath);
      }
    });
  });
})(folderPath, folderCopyPath);
