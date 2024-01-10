const { composePlugins, withNx } = require('@nx/webpack');
const crypto = require('crypto')

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  process.env['JWT_TOKEN'] = process.env['JWT_TOKEN'] || crypto.randomBytes(256).toString('hex');
  return config;
});
