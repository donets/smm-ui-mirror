'use strict';

/**
 * @ngdoc service
 * @name boltApp.suppliers
 * @description
 * # suppliers
 * Service in the boltApp.
 */
angular.module('boltApp.services.suppliers', [])
    .factory('Suppliers', ['$resource', '$window', function($resource, $window) {
        return $resource($window.smmConfig.restUrlBaseOld + '/api/rest/supplier/:supplierId', {eventId: '@id'}, {
            'query': {method: 'GET', url: $window.smmConfig.restUrlBaseOld + '/api/rest/supplier/list', isArray: true, cache: true},
            'get': {method: 'GET', cache: true}
        });
    }]);