'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:resizable
 * @description
 * # resizable
 */
angular.module('boltApp')
    .directive('resizable', function($window) {
        return function($rootScope) {
            $rootScope.initializeWindowSize = function() {
                $rootScope.windowWidth = $window.innerWidth;
                $rootScope.windowHeight = $window.innerHeight;
                $rootScope.documentWidth = $window.innerWidth - getScrollbarWidth(); // jshint ignore:line
                if($window.innerWidth > 1080) {
                    $rootScope.desktop = true;
                    $rootScope.mobile = false;
                    $rootScope.offset = 60;
                } else {
                    $rootScope.desktop = false;
                    $rootScope.mobile = true;
                    $rootScope.offset = $window.innerWidth > 640 ? 120 : 60;
                }
                if ($window.innerWidth <= 640) {
                    $rootScope.resolution = 1080;
                    $rootScope.fblikeboxWidth = 285;
                } else if ($window.innerWidth <= 1080) {
                    $rootScope.resolution = 1080;
                    $rootScope.fblikeboxWidth = 560;
                } else if ($window.innerWidth <= 1440) {
                    $rootScope.resolution = 1440;
                    $rootScope.fblikeboxWidth = 820;
                } else if ($window.innerWidth <= 2880) {
                    $rootScope.resolution = 2880;
                }
            };
            $rootScope.initializeWindowSize();
            return angular.element($window).bind('resize', function() {
                $rootScope.initializeWindowSize();
                return $rootScope.$apply();
            });
        };
    });
