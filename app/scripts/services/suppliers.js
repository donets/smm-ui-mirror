'use strict';

/**
 * @ngdoc service
 * @name boltApp.suppliers
 * @description
 * # suppliers
 * Service in the boltApp.
 */
angular.module('boltApp.services.suppliers', [])
    .factory('Suppliers', ['$resource', function($resource) {
        return $resource('//smm-dev.herokuapp.com/api/rest/supplier/:supplierId', {eventId: '@id'}, {
            'query': {method: 'GET', url: '//smm-dev.herokuapp.com/api/rest/supplier/list', isArray: true, cache: true},
            'get': {method: 'GET', cache: true}
        });
    }]);

