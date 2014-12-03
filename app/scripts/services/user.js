'use strict';

/**
 * @ngdoc service
 * @name boltApp.session
 * @description
 * # session
 * Factory in the boltApp.
 */
angular.module('boltApp.services.user', [])
    .factory('User', ['$resource', '$window', function($resource, $window) {

        return $resource($window.smmConfig.restUrlBase + '/api/auth/status', {
            'get': {method: 'GET', cache: false}
        });

    }]);
