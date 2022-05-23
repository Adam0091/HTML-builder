const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) return console.error(err);

    for (let file of files) {
      if (file.isFile()) {
        const fileName = file.name.split('.')[0];
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileExtension = path.extname(filePath).slice(1);

        fs.stat(filePath, (err, file) => {
          if (err) return console.error(err);
          const fileSize = (file.size / 1024).toFixed(2);
          console.log(`${fileName} - ${fileExtension} - ${fileSize}KB`);
        });
      }
    }
  }
);
