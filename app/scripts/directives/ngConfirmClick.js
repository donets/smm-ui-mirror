'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:ngConfirmClick
 * @description
 * # ngConfirmClick
 */
angular.module('boltApp')
    .directive('ngConfirmClick', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var message = attrs.ngConfirmMessage || 'Are you sure?';
                    if (confirm(message)) {
                        scope.$apply(attrs.ngConfirmClick);
                    }
                });
            }
        }
    });
