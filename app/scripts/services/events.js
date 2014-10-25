'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.events', [])
    .factory('Events', ['$resource', function($resource) {
        return $resource('/api/events/:eventId', {eventId: '@id'}, {
            'query': {method: 'GET', isArray: false, cache: true},
            'get': {method: 'GET', cache: true},
            'getOrder': {method: 'GET', cache: false, url: '/api/events/:eventId/order_details'}
        });
    }]);
