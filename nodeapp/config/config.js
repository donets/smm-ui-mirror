var config,
    fs = require('fs');

module.exports = {
  get: function(key) {
    var currentConfigObj, i, keyParts, throwKeyNotExists;

    if (!config) {
      throw new Error('config not exists');
    }

    throwKeyNotExists = function(key) {
      throw new Error("config key " + key + " not exists");
    };

    if (key.indexOf('.') !== -1) {
      keyParts = key.split('.');
      currentConfigObj = config;
      for (i in keyParts) {
        key = keyParts[i];
        if (currentConfigObj[key] == null) {
          throwKeyNotExists(key);
        }
        if (keyParts.length - 1 === parseInt(i)) {
          return currentConfigObj[key];
        }
        currentConfigObj = currentConfigObj[key];
      }
      throwKeyNotExists(key);
    }
    if (config[key] == null) {
      throwKeyNotExists(key);
    }
    return config[key];
  },
  read: function(file) {
    config = JSON.parse(fs.readFileSync(file).toString('utf-8'));
    return this;
  }
};
