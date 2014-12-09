'use strict';

/**
 * @ngdoc service
 * @name boltApp.RestApi
 * @description
 * # restApi
 * Factory in the boltApp.
 */
angular.module('boltApp.services.restApi', [])
    .factory('RestApi', ['$resource', '$window', function($resource, $window) {
        return $resource($window.smmConfig.restUrlBase + '/api/rest/:route/:id', {route: '@route', id: '@id'}, {
            'query': {method: 'GET', isArray: true, cache: false},
            'get': {method: 'GET', cache: false},
            'update': {method: 'PUT', cache: false},
            'save': {method: 'POST', cache: false},
            'delete': {method: 'DELETE', cache: false },
            'saveList': {method: 'POST', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/:route/bulk' },
            'deleteList': {method: 'POST', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/:route/bulk/delete' }
        });
    }]);
