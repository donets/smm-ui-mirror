'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:BookingCtrl
 * @description
 * # BookingCtrl
 * Controller of the boltApp
 */

/* jshint undef:false */

angular.module('boltApp.controllers.Booking', [])
    .controller('BookingCtrl', function ($scope, $rootScope, getBooking, RestApi) {

        $scope.booking = getBooking;
        console.log($scope.booking);
        RestApi.get({route: 'occurrences'},{id: getBooking.occurrenceId}).$promise.then(function(res){
            $scope.occurence = res;
            console.log($scope.occurence)
            RestApi.get({route:'events'},{id: $scope.occurence.parent_event_id}).$promise.then(function(res){
                console.log(res)
                $scope.class = res;
            })
        })
    });
