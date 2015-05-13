'use strict';

var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var modRewrite = require('connect-modrewrite');
var swig = require('swig');
var app = express();

require('./nodeapp/config/config').read(__dirname + '/nodeapp/config/config.json');

swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/') });

app.use(morgan('dev'));
app.use(modRewrite(['^[^\\.]*$ /index.html [L]']));
app.get('/index.html', require('./nodeapp/index/index'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);
