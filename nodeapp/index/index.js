var swig = require('swig'),
    config = require('../config/config');

module.exports = function(req, res, next) {
  var tpl = swig.compileFile(__dirname + '/index.html', {
    varControls: ['<%=', '=%>'], tagControls: ['<%', '%>']
  });

  return res.send(tpl({
    restUrlBaseOld: config.get('restUrlBaseOld'),
    restUrlBase: config.get('restUrlBase'),
    fbClientId: config.get('fbClientId')
  }));
};
