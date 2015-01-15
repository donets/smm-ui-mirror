'use strict';

/**
 * @ngdoc service
 * @name boltApp.RestApi
 * @description
 * # restApi
 * Factory in the boltApp.
 */
angular.module('boltApp.services.restApi', [])
    .factory('RestApi', ['$resource', '$window', 'resourceInterceptor', function($resource, $window, resourceInterceptor) {
        return $resource($window.smmConfig.restUrlBase + '/api/rest/:route/:id', {route: '@route', id: '@id'}, {
            'query': {method: 'GET', cache: false, isArray: true},
            'get': {method: 'GET', cache: false},
            'update': {method: 'PUT', cache: false, interceptor: resourceInterceptor},
            'save': {method: 'POST', cache: false, interceptor: resourceInterceptor},
            'delete': {method: 'DELETE', cache: false, interceptor: resourceInterceptor},
            'saveList': {method: 'POST', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/:route/bulk', interceptor: resourceInterceptor },
            'deleteList': {method: 'POST', isArray: false, cache: false, url: $window.smmConfig.restUrlBase + '/api/rest/:route/bulk/delete', interceptor: resourceInterceptor }
        });
    }]);
