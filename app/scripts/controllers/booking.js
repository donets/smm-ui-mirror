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
    .controller('BookingCtrl', function ($scope, $rootScope, getBooking, RestApi, $q, $http, $modal, $window) {

        $scope.booking = getBooking;
        RestApi.get({route: 'occurrences'},{id: getBooking.occurrenceId}).$promise.then(function(res){
            $scope.event = res;
            RestApi.get({route:'events'},{id: $scope.event.parent_event_id}).$promise.then(function(res){
                $scope.class = res;
                $scope.event.class = $scope.class;

                $q.all([RestApi.get({route: 'studios',id: $scope.class.studioId}).$promise,
                        RestApi.get({route: 'locations',id: $scope.class.locationId}).$promise
                    ]).then(function (resolve) {
                        $scope.event.class.studio = resolve[0];
                        $scope.event.location = resolve[1];
                    });
            })
        });

        $scope.accept = function() {
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/rest/bookings/' + $scope.booking.id + '/manage/confirm', {}).success(function (res) {
                $scope.showSpinner = false;
                $http.get($window.smmConfig.restUrlBase + '/api/bookings/' + $scope.booking.id).then(function(res) {
                    $scope.booking = res.data.bookings;
                })
            });
        };

        $scope.decline = function() {
            $scope.showSpinner = true;
            $modal.open({
                templateUrl: 'app/views/modalDecline.html',
                controller: ['$scope', '$modalInstance', 'booking',

                    function ($scope, $modalInstance, booking) {

                        $scope.close = function () {
                            $modalInstance.close(false);
                        };

                        $scope.loading = false;
                        $scope.booking = booking;

                        $scope.declineBook = function (reason) {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/rest/bookings/' + $scope.booking.id + '/manage/decline?reasonId=' + reason).success(function (res) {
                                console.log(res);
                                $scope.loading = false;
                                $scope.success = true;
                            }).error(function (res) {
                                console.log(res);
                                $scope.loading = false;
                            });
                        };

                    }],
                resolve: {
                    booking: function() {
                        return $scope.booking;
                    }
                },
                backdrop: 'static',
                windowClass: 'modal-cancel'
            }).result.then(function () {
                    $scope.showSpinner = false;
                    $http.get($window.smmConfig.restUrlBase + '/api/bookings/' + $scope.booking.id).then(function(res) {
                        $scope.booking = res.data.bookings;
                    })
                });
        }
    });
