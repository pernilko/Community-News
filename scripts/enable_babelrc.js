// @flow

// Workaround for buggy transform of uninitialized class properties in react-scripts

const path = require('path');
const fs = require('fs');

const webpack_config_path = path.join(__dirname, '../node_modules/react-scripts/config/webpack.config.js');

fs.readFile(webpack_config_path, 'utf8', (error, data) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  let result = data.replace(/babelrc: false/g, 'babelrc: true');
  fs.writeFile(webpack_config_path, result, 'utf8', error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
