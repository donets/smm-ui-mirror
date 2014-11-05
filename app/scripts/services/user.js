'use strict';

/**
 * @ngdoc service
 * @name boltApp.session
 * @description
 * # session
 * Factory in the boltApp.
 */
angular.module('boltApp.services.user', [])
    .factory('User', ['$resource', '$window', function($resource, $window) {

        return $resource($window.smmConfig.restUrlBase + '/api/auth/status', {
            'get': {method: 'GET', cache: false}
        });

//        var user = {};
//
//        user.checkStatus = function() {
//            var deferred = $q.defer();
//            $http.get($window.smmConfig.restUrlBase + '/api/auth/status').success(function (response) {
//                console.log(response);
//                user = response.currentUser;
//                deferred.resolve();
//            }).error(function (response, status) {
//                console.error(response);
//                console.error(status);
//                deferred.reject();
//            });
//            return deferred.promise;
//        };
//
//        return user;

    }]);
