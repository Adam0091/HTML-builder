const fs = require('fs');
const path = require('path');

const slylesFolder = path.join(__dirname, 'styles');
const bundleCssPath = fs.createWriteStream( 
  path.join(__dirname, 'project-dist', 'bundle.css'),
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