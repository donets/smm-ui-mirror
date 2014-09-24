'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:disableAnimate
 * @description
 * # disableAnimate
 */
angular.module('boltApp')
    .directive('disableAnimate', ['$animate', function($animate) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $animate.enabled(false, element);
            }
        };
    }]);
