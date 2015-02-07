'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudioCtrl
 * @description
 * # StudioCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studio', ['uiGmapgoogle-maps'])
    .controller('StudioCtrl', function ($scope, $rootScope, $q, $modal, getStudio, RestApi, uiGmapGoogleMapApi) {
        $scope.coverMain = $rootScope.windowWidth > 1080 ? '/images/landing-2880.jpg' : '/images/landing-1080.jpg';
        $scope._ = _;
        getStudio.$promise.then(function () {
            $scope.studio = getStudio;
            $scope.studio.locationsFull = [];
            $q.all([RestApi.query({route: 'locations'}).$promise, RestApi.query({route: 'events'}).$promise]).then(function (res) {
                _.each($scope.studio.locations, function (locationId) {
                    $scope.studio.locationsFull.push(_.findWhere(res[0], {id: locationId}));
                });
                $scope.classes = res[1];
                $scope.setLocation($scope.studio.locationsFull[0]);
            });
        });

        $scope.showDescription = false;

        $scope.weekdays = [];
        $scope.today = moment();
        $scope.changeDay = function (day) {
            $scope.currDay = day;
        };
        $scope.changeDay($scope.today);
        for (var d = 0; d < 7; d++) {
            $scope.weekdays.push(moment().add(d, 'day'));
        }

        $scope.setLocation = function (location) {
            $scope.currLocation = location;
            RestApi.query({route: 'occurrences', forDurationOfDays: 7, withActiveParent: true, locationId: location.id}).$promise.then(function (response) {
                $scope.events = _.each(response, function (event) {
                    event.start_date = moment(event.start_date);
                    event.end_date = moment(event.end_date);
                    event.class = _.findWhere($scope.classes, {id: event.parent_event_id});
                });
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
