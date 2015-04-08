'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.countryConfig', [])
    .factory('CountryConfig', ['$resource', '$window', function($resource, $window) {
        return $resource($window.smmConfig.restUrlBase + '/api/country/guess/config', {}, {
            'get': {method: 'GET', cache: true},
            'guessCity': {method: 'GET', cache: true, url: $window.smmConfig.restUrlBase + '/api/country/guess/config?guessCity=true'}
        });
    }]);
