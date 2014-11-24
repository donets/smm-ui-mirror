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
        return $resource($window.smmConfig.restUrlBase + '/api/rest/events/:eventId', {eventId: '@id'}, {
            'query': {method: 'GET', isArray: true, cache: true},
            'get': {method: 'GET', cache: true}
        });
    }]);
