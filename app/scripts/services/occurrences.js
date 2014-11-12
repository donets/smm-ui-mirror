'use strict';

/**
 * @ngdoc service
 * @name boltApp.occurrences
 * @description
 * # occurrences
 * Factory in the boltApp.
 */
angular.module('boltApp.services.occurrences', [])
    .factory('Occurrences', ['$resource', '$window', function($resource, $window) {
        return $resource($window.smmConfig.restUrlBase + '/api/occurrence/:occurrenceId', {occurrenceId: '@id'}, {
            'query': {method: 'GET', isArray: false, cache: true},
            'get': {method: 'GET', cache: true},
            'getOrder': {method: 'GET', cache: false, url: $window.smmConfig.restUrlBase + '/api/eventbrite/:eventId/order'}
        });
    }]);
