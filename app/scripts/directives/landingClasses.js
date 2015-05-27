'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:landingClasses
 * @description
 * # landingClasses
 */
angular.module('boltApp')
    .directive('landingClasses', function () {
        return {
            templateUrl: 'app/views/landingClasses.html',
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

            }
        };
    });
