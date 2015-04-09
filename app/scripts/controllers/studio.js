'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudioCtrl
 * @description
 * # StudioCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studio', ['uiGmapgoogle-maps'])
    .controller('StudioCtrl', function ($scope, $rootScope, $q, $modal, getStudio, $http, $window, RestApi, uiGmapGoogleMapApi) {
        $scope.coverMain = $rootScope.windowWidth > 1080 ? '/images/landing-2880.jpg' : '/images/landing-1080.jpg';
        $scope._ = _;
        getStudio.$promise.then(function () {
            $scope.studio = getStudio;
            $scope.studio.locationsFull = [];
            RestApi.query({route: 'locations'}).$promise.then(function (res) {
                _.each($scope.studio.locations, function (locationId) {
                    $scope.studio.locationsFull.push(_.findWhere(res, {id: locationId}));
                });
                $scope.currDay = moment();
                $scope.setLocation($scope.studio.locationsFull[0]);
            });
        });

        $scope.showDescription = false;

        $scope.weekdays = [];
        $scope.today = moment();
        $scope.changeDay = function (day) {
            $scope.currDay = day;
            $scope.setLocation($scope.currLocation);
        };
        for (var d = 0; d < 7; d++) {
            $scope.weekdays.push(moment().add(d, 'day'));
        }

        $scope.setLocation = function (location) {
            $scope.currLocation = location;
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/get/all', {locationId: location.id, date: $scope.currDay.format('YYYY-MM-DD')}).success(function (res) {
                $scope.events = _.each(res.classes.occurenceAccesses, function (event) {
                    event.start_date = moment(event.date + 'T' + event.startTime);
                    event.end_date = moment(event.date + 'T' + event.endTime);
                    event.startTime = event.startTime.slice(0,5);
                    event.endTime = event.endTime.slice(0,5);
                    event.class = _.findWhere(res.classes.classAccesses, {id: event.classId});
                });
                $scope.showSpinner = false;
            });
            uiGmapGoogleMapApi.then(function() {

                $scope.map = {
                    center: {
                        latitude: $scope.currLocation.latitude,
                        longitude: 	$scope.currLocation.longitude
                    },
                    zoom: 16,
                    options: {
                        mapTypeControl: false,
                        overviewMapControl: false,
                        panControl: false,
                        zoomControl : true,
                        streetViewControl : true,
                        scrollwheel: false
                    }
                };

                $scope.marker = {
                    id: 1,
                    coords: {
                        latitude: $scope.currLocation.latitude,
                        longitude: 	$scope.currLocation.longitude
                    },
                    icon: '/images/marker.svg'
                };

            });
        };

        $scope.attend = function (event) {
            $modal.open({
                templateUrl: 'views/modalAttend.html',
                controller: ['$scope', '$modalInstance', 'event',

                    function ($scope, $modalInstance, event) {

                        $scope.event = event;

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                resolve: {
                    event: function () {
                        return event;
                    }
                },
                windowClass: 'modal-attend'
            });
        };

    });
