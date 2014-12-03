'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SocialCtrl
 * @description
 * # SocialCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Social', [])
  .controller('SocialCtrl', ['$rootScope', '$scope', '$http', 'ezfb', '$window', function ($rootScope, $scope, $http, ezfb, $window) {

        $scope.getLikes = function () {

            return $http.get('//graph.facebook.com/somuchmoredeutsch', {cache: false, withCredentials: false}).success(function (res) {

                $rootScope.likes = res.likes;

            });

        };

        $scope.getLikes();

        ezfb.Event.subscribe('edge.create', function(targetUrl) {
            $window.ga('set', 'dimension3', '1');
            $window.ga('send', 'social', 'facebook', 'like', targetUrl);
            $scope.getLikes();
        });

        ezfb.Event.subscribe('edge.remove', function(targetUrl) {
            $window.ga('set', 'dimension3', '0');
            $window.ga('send', 'social', 'facebook', 'unlike', targetUrl);
            $scope.getLikes();
        });

  }]);
