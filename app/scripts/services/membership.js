'use strict';

/**
 * @ngdoc service
 * @name boltApp.Membership
 * @description
 * # Membership
 * Factory in the boltApp.
 */
angular.module('boltApp.services.membership', [])
    .factory('Membership', ['$resource', '$window', function($resource, $window) {

        return $resource($window.smmConfig.restUrlBase + '/api/membership', {
            'get': {method: 'GET', cache: false},
            'save': {method: 'POST', url: '/api/membership/order', cache: false}
        });

    }]);
