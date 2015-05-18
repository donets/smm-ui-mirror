'use strict';

var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var modRewrite = require('connect-modrewrite');
var swig = require('swig');
var app = express();

// read json to be available in all functions
var config = require('./nodeapp/config/config');
config.read(__dirname + '/nodeapp/config/config.json');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/nodeapp');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);

// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!
swig.setDefaults({
  // because of angular js tags {{}} I need to change the default
  // swig tags
  varControls: ['<%=', '=%>'],
  tagControls: ['<%', '%>'],
  locals: {
    florian: 'florianss'
  }
});

app.use(morgan('dev'));
app.use(modRewrite(['^[^\\.]*$ /index.html [L]']));
app.get('/index.html', require('./nodeapp/index/index'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);
