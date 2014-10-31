'use strict';

/**
 * @ngdoc service
 * @name uiApp.session
 * @description
 * # session
 * Factory in the boltApp.
 */
angular.module('boltApp.services.session', [])
    .factory('session', ['$cookies', function($cookies) {
        // read Play session cookie
        var rawCookie = $cookies['PLAY_SESSION']; // jshint ignore:line
        var session = {};
        if (rawCookie) {
            var rawData = rawCookie.substring(rawCookie.indexOf('-') + 1, rawCookie.length - 1);
            _.each(rawData.split('&'), function (rawPair) {
                var pair = rawPair.split('=');
                session[pair[0]] = pair[1];
            });
        }
        return session;
    }]);
