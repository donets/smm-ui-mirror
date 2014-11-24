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
                $rootScope.windowWidthScroll = 2*$window.innerWidth - $window.outerWidth;
                $rootScope.documentWidth = $window.document.body.clientWidth;
                if($window.innerWidth > 1080) {
                    $rootScope.desktop = true;
                    $rootScope.mobile = false;
                    $rootScope.offset = 60;
                } else {
                    $rootScope.desktop = false;
                    $rootScope.mobile = true;
                    $rootScope.offset = $window.innerWidth > 640 ? 120 : 60;
                }
            };
            $rootScope.initializeWindowSize();
            return angular.element($window).bind('resize', function() {
                $rootScope.initializeWindowSize();
                return $rootScope.$apply();
            });
        };
    });
