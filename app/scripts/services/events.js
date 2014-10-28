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
        return $resource('//' + $window.smm_config.rest_url + '/api/occurrence/:eventId', {eventId: '@id'}, {
            'query': {method: 'GET', isArray: false, cache: true},
            'get': {method: 'GET', cache: true},
            'getOrder': {method: 'GET', cache: false, url: '//' + $window.smm_config.rest_url + '/api/eventbrite/:eventId/order'}
        });
    }]);
