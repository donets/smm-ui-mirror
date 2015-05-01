/*! angular-csv-import - v0.0.14 - 2015-02-10
 * Copyright (c) 2015 ; Licensed  */
'use strict';

angular.module('boltApp')
    .directive('ngCsvImport', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                content: '=',
                header: '=',
                headers: '=',
                separator: '=',
                entity: '=',
                result: '=',
                ignoredColumns: '=',
                missingColumns: '=',
                importErrors: '=',
                importError: '='
            },
            template: '<div><input class="btn cta gray" type="file"/></div>',
            link: function (scope, element) {
                element.on('click', function (e) {
                    e.target.value = '';
                });

                element.on('change', function (onChangeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            var content = {
                                csv: onLoadEvent.target.result.replace(/\r\n|\r/g, '\n'),
                                header: scope.header,
                                separator: scope.separator,
                                entity: scope.entity
                            };

                            scope.content = content.csv;
                            scope.headers = getHeaders(content);
                            scope.result = csvToJSON(content);
                        });
                    };
                    if ((onChangeEvent.target.type === 'file') && (onChangeEvent.target.files !== null || onChangeEvent.srcElement.files !== null)) {
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                    } else {
                        if (scope.content !== null) {
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

                var csvToJSON = function (content) {
                    scope.importErrors = {};
                    scope.importError = false;
                    scope.ignoredColumns = [];
                    scope.missingColumns = [];
                    var lines = content.csv.csvToArray({head:!content.header, rSep:'\n', fSep: content.separator});
                    var result = [];
                    var start = 0;
                    var columnCount = lines[0].length;

                    var headers = [];
                    if (content.header) {
                        headers = lines[0];
                        start = 1;
                        if (!validateHeaders(headers)) {
                            return null;
                        }
                    }

                    for (var i = start; i < lines.length; i++) {
                        var obj = {};
                        var currentline = lines[i];
                        if (currentline.length === columnCount) {
                            if (content.header) {
                                for (var j = 0; j < headers.length; j++) {
                                    var currentField = content.entity[headers[j]];
                                    // ignore column unless currentField present
                                    if (_.isObject(currentField)) {
                                        // parse column value
                                        var parsedValue;
                                        switch (content.entity[headers[j]].type) {
//                                            case 'integer':
//                                                var parsedInt = parseInt(currentline[j].replace(/^"(.*)"$/, '$1'));
//                                                parsedValue = _.isFinite(parsedInt) ? parsedInt : currentline[j].replace(/^"(.*)"$/, '$1');
//                                                break;
//                                            case 'string':
//                                                parsedValue = currentline[j].replace(/^"(.*)"$/, '$1');
//                                                break;
//                                            case 'boolean':
//                                                parsedValue = currentline[j].replace(/^"(.*)"$/, '$1');
//                                                break;
//                                            case 'float':
//                                                var parsedFloat = parseFloat(currentline[j].replace(/^"(.*)"$/, '$1'));
//                                                parsedValue = _.isFinite(parsedFloat) ? parsedFloat : currentline[j].replace(/^"(.*)"$/, '$1');
//                                                break;
                                            case 'strings':
                                                parsedValue = currentline[j].replace(/^"(.*)"$/, '$1').split(',');
                                                break;
                                            case 'integers':
                                                parsedValue = _.map(currentline[j].replace(/^"(.*)"$/, '$1').split(','), function (str) {
                                                    var parsedInt = parseInt(str);
                                                    return _.isFinite(parsedInt) ? parsedInt : str;
                                                });
                                                break;
                                            default:
                                                parsedValue = currentline[j].replace(/^"(.*)"$/, '$1');
                                                break;
                                        }
                                        obj[headers[j]] = parsedValue;
                                        //validate column
                                        for (var method in currentField.rules) {
                                            var rule = { method: method, parameters: currentField.rules[ method ] };
                                            var valid = Validator.methods[ rule.method ].call(this, parsedValue, rule.parameters);
                                            if (!valid) {
                                                obj.errors = obj.errors || {};
                                                obj.errors[headers[j]] = true;
                                                scope.importErrors[i] = scope.importErrors[i] || [];
                                                scope.importErrors[i].push(headers[j]);
                                                scope.importError = true;
                                            }
                                        }

                                    } else {
                                        if (!_.contains(scope.ignoredColumns, headers[j])) {
                                            scope.ignoredColumns.push(headers[j]);
                                        }
                                    }
                                }
                            } else {
                                for (var k = 0; k < currentline.length; k++) {
                                    obj[k] = currentline[k].replace(/^"(.*)"$/, '$1');
                                }
                            }
                            result.push(obj);
                        }
                    }
                    return result;
                };

                var getHeaders = function (content) {
                    return _.keys(content.entity);
                };

                var Validator = {
                    methods: {
                        required: function (value, param) {
                            return value.length > 0;
                        },
                        number: function (value, param) {
                            return Validator.methods.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
                        },
                        min: function (value, param) {
                            return Validator.methods.optional(value) || value >= param;
                        },
                        max: function (value, param) {
                            return Validator.methods.optional(value) || value <= param;
                        },
                        format: function (value, param) {
                            return Validator.methods.optional(value) || new RegExp(param).test(value);
                        },
                        inclusion: function (value, param) {
                            var allowedValues = param.split(',');
                            return Validator.methods.optional(value) || _.contains(allowedValues, value.toLowerCase());
                        },
                        optional: function (value) {
                            return !Validator.methods.required(value);
                        }
                    }
                };

                var validateHeaders = function(headers) {
                    var valid = true;
                    _.each(scope.entity, function (value, key) {
                        if (_.contains(_.keys(value.rules), 'required')) {
                            if (!_.contains(headers, key)) {
                                valid = false;
                                scope.missingColumns.push(key);
                            }
                        }
                    });
                    return valid;
                };
            }
        };
    });
