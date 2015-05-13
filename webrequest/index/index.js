var swig = require('swig');

module.exports = function(indexTemplatePath) {
  var tpl = swig.compileFile(__dirname + '/index.html', {
    varControls: ['<%=', '=%>'], tagControls: ['<%', '%>']
  });

  return function(req, res, next) {
    return res.send(tpl());
  };
};
