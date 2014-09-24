'use strict';

/**
 * @ngdoc service
 * @name boltApp.navigator
 * @description
 * # navigator
 * Service in the boltApp.
 */
angular.module('boltApp.navigator', [])
    .service('navigator', ['$window', function($window) {

        return {
            browser: function() {

                var userAgent = $window.navigator.userAgent;

                var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

                for(var key in browsers) {
                    if (browsers[key].test(userAgent)) {
                        return key;
                    }
                }

                return 'unknown';
            },
            platform: function() {

                var userAgent = $window.navigator.userAgent;

                var mobile = {android: /Android/i, webOS: /webOS/i, iPhone: /iPhone/i, iPad: /iPad/i, iPod: /iPod/i, blackBerry: /BlackBerry/i, winPhone: /Windows Phone/i};

                for(var key in mobile) {
                    if (mobile[key].test(userAgent)) {
                        return 'mobile';
                    }
                }

                return 'desktop';
            }
        };
    }]);