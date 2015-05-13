'use strict';

var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var modRewrite = require('connect-modrewrite');
var swig = require('swig');
var app = express();

swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/') });

app.use(morgan('dev'));
app.use(modRewrite(['^[^\\.]*$ /index.html [L]']));
app.get('/index.html', require('./webrequest/index/index')(__dirname + '/dist/index.html'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);
