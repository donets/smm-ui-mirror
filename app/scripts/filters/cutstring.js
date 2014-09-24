'use strict';

/**
 * @ngdoc filter
 * @name boltApp.filter:cutString
 * @function
 * @description
 * # cutString
 * Filter in the boltApp.
 */
angular.module('boltApp')
    .filter('cutString', function () {
        return function (value, max, wordwise, end) {
            if (!value) {
                    return '';
                } else {
                    end = end || '...';
                    max = parseInt(max, 10);
                    if (!max) { return value; }
                    if (value.length <= max) { return value; }
                    value = value.slice(0, max - end.length);
                    if (wordwise) {
                        var lastspace = value.lastIndexOf(' ');
                        if (lastspace !== -1) {
                            value = value.slice(0, lastspace);
                            end = ' ...';
                        }
                    }
                    return value + end;
            }

        };
    });
