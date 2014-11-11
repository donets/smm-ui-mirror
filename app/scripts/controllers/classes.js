'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classes', [])
    .controller('ClassesCtrl', function ($scope, Events) {
        Events.all().$promise.then(function (res) {
            $scope.classes = _.uniq(res.events);
            console.log($scope.classes);
        });
    });
