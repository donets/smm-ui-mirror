'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.events', [])
    .factory('Events', ['$resource', '$window', function($resource, $window) {
        return $resource($window.smmConfig.restUrlBase + '/api/occurrence/:eventId', {eventId: '@id'}, {
            'query': {method: 'GET', isArray: false, cache: true},
            'get': {method: 'GET', cache: true},
            'getOrder': {method: 'GET', cache: false, url: $window.smmConfig.restUrlBase + '/api/eventbrite/:eventId/order'},
            'all': {method: 'GET', cache: true, url: $window.smmConfig.restUrlBase + '/api/event'}
        });
    }]);
