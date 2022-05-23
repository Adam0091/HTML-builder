const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(__dirname, 'project-dist/assets');
const slylesFolder = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const indexPath  = path.join(__dirname, 'index.html');

fs.mkdir(
  path.join(__dirname, 'project-dist'), 
  {recursive: true}, 
  (err) => err && console.error(err)
);

copyDir(assetsPath, copyAssetsPath);

const bundleCssPath = fs.createWriteStream( 
  path.join(__dirname, 'project-dist', 'style.css'),
  (err) => err && console.error(err) 
);
fs.readdir(slylesFolder, { withFileTypes: true}, (err, files) => {
  if(err) console.error(err);

  for(const file of files) {
    if (file.isFile()){
      const filePath = path.join(slylesFolder, file.name);
      const fileExt = path.extname(filePath).slice(1);

      if(fileExt === 'css'){
        const readStream = fs.createReadStream(filePath, 'utf-8');
        let bundleStyles = '';

        readStream.on('data', (style) => bundleStyles += style);
        readStream.on('end', () => {
          bundleCssPath.write(bundleStyles);
        });
        readStream.on('error', (err) => err && console.error(err));
      }
    }
  }
});


fs.copyFile(templatePath, indexPath, (err) => err && console.error(err));
fs.readFile(templatePath, 'utf-8', (err, data) => {
  if (err) console.log(err);

  let templateData = data;
  const templateTags = data.match(/{{\w+}}/gm);

  for (let tag of templateTags) {
    const tagPath = path.join(
      __dirname,
      '/components',
      `${tag.slice(2, -2)}.html`,
    );

    fs.readFile(tagPath, 'utf-8', (err, dataTag) => {
      if (err) return console.error(err);

      templateData = templateData.replace(tag, dataTag);

      fs.rm(indexPath, { recursive: true, force: true }, (err) => {
        if (err) return console.error(err);
        const index = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        index.write(templateData);
      });
    });
  }
});


function copyDir(folderPath, folderCopyPath) {
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
}
