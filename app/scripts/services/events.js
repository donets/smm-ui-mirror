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
        return $resource('http://stage-smm-api.herokuapp.com/api/occurrence/:eventId', {eventId: '@id'}, {
            'query': {method: 'GET', isArray: false, cache: true},
            'get': {method: 'GET', cache: true},
            'getOrder': {method: 'GET', cache: false, url: 'http://stage-smm-api.herokuapp.com/api/eventbrite/:eventId/order'}
        });
    }]);
