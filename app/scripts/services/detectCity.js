'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.detectCity', [])
    .factory('DetectCity', ['RestApi', '$location', '$cookieStore', '$rootScope', '$http', '$q', 'mapStudios',
        function(RestApi, $location, $cookieStore, $rootScope, $http, $q, mapStudios) {

            var getCityFromParams = function() {
                if ($location.search().city) {
                    return {field:'shortCode',value:$location.search().city};
                }
                if ($cookieStore.get('cityId')) {
                    return {field:'id',value:$cookieStore.get('cityId')};
                }
                return null;
            };

            return {
                getCityFromParams: getCityFromParams
            };
        }
    ]);
