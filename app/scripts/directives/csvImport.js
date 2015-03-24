/*! angular-csv-import - v0.0.14 - 2015-02-10
 * Copyright (c) 2015 ; Licensed  */
'use strict';

angular.module('boltApp')
    .directive('ngCsvImport', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope:{
                content:'=',
                header: '=',
                headers: '=',
                separator: '=',
                entity: '=',
                result: '='
            },
            template: '<div><input class="btn cta gray" type="file"/></div></div>',
            link: function(scope, element) {
                element.on('keyup', function(e){
                    if ( scope.content !== null ) {
                        var content = {
                            csv: scope.content,
                            header: scope.header,
                            separator: e.target.value,
                            entity: scope.entity
                        };
                        scope.headers = getHeaders(content);
                        scope.result = csvToJSON(content);
                        scope.$apply();
                    }
                });

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();
                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            var content = {
                                csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
                                header: scope.header,
                                separator: scope.separator,
                                entity: scope.entity
                            };

                            scope.content = content.csv;
                            scope.headers = getHeaders(content);
                            scope.result = csvToJSON(content);
                        });
                    };
                    if ( (onChangeEvent.target.type === 'file') && (onChangeEvent.target.files !== null || onChangeEvent.srcElement.files !== null) )  {
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                    } else {
                        if ( scope.content !== null ) {
                            var content = {
                                csv: scope.content,
                                header: !scope.header,
                                separator: scope.separator,
                                entity: scope.entity
                            };
                            scope.headers = getHeaders(content);
                            scope.result = csvToJSON(content);
                        }
                    }
                });

                var csvToJSON = function(content) {
                    var lines=content.csv.split('\n');
                    var result = [];
                    var start = 0;
                    var columnCount = lines[0].split(content.separator).length;

                    var headers = [];
                    if (content.header) {
                        headers=lines[0].split(content.separator);
                        start = 1;
                    }

                    for (var i=start; i<lines.length; i++) {
                        var obj = {};
                        var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                        if ( currentline.length === columnCount ) {
                            if (content.header) {
                                for (var j=0; j<headers.length; j++) {
                                    switch (content.entity[headers[j]]) {
                                        case 'integer':
                                            obj[headers[j]] = parseInt(currentline[j].replace(/^"(.*)"$/, '$1'));
                                            break;
                                        case 'string':
                                            obj[headers[j]] = currentline[j].replace(/^"(.*)"$/, '$1');
                                            break;
                                        case 'boolean':
                                            obj[headers[j]] = currentline[j].replace(/^"(.*)"$/, '$1');
                                            break;
                                        case 'float':
                                            obj[headers[j]] = parseFloat(currentline[j].replace(/^"(.*)"$/, '$1'));
                                            break;
                                        case 'strings':
                                            obj[headers[j]] = currentline[j].replace(/^"(.*)"$/, '$1').split(',');
                                            break;
                                        case 'integers':
                                            obj[headers[j]] = _.map(currentline[j].replace(/^"(.*)"$/, '$1').split(','), function(str){ return parseInt(str); });
                                            break;
                                        default:
                                            obj[headers[j]] = currentline[j].replace(/^"(.*)"$/, '$1');
                                            break;
                                    }
                                }
                            } else {
                                for (var k=0; k<currentline.length; k++) {
                                    obj[k] = currentline[k].replace(/^"(.*)"$/, '$1');
                                }
                            }
                            result.push(obj);
                        }
                    }
                    return result;
                };

                var getHeaders = function(content) {
                    var lines=content.csv.split('\n');
                    var headers = [];
                    if (content.header) {
                        headers=lines[0].split(content.separator);
                    }

                    return headers;
                };
            }
        };
    });
