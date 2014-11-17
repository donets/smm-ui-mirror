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
        return $resource($window.smmConfig.restUrlBase + '/api/rest/occurrences/:occurrenceId', {occurrenceId: '@id'}, {
            'query': {method: 'GET', isArray: true, cache: false},
            'get': {method: 'GET', cache: false},
            'update': {method: 'PUT', cache: false},
            'save': {method: 'POST', cache: false},
            'delete': {method: 'DELETE', cache: false },
            'saveList': {method: 'POST', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/occurrences/bulk' },
            'deleteList': {method: 'DELETE', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/occurrences/bulk' },
            'getOrder': {method: 'GET', cache: false, url: $window.smmConfig.restUrlBase + '/api/eventbrite/:eventId/order'}
        });
    }]);
