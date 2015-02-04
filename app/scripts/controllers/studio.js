'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudioCtrl
 * @description
 * # StudioCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studio', ['uiGmapgoogle-maps'])
    .controller('StudioCtrl', function ($scope, $rootScope, getStudio, RestApi, uiGmapGoogleMapApi) {
        $scope.coverMain = $rootScope.windowWidth > 1080 ? '/images/landing-2880.jpg' : '/images/landing-1080.jpg';

        getStudio.$promise.then(function () {
            $scope.studio = getStudio;
            $scope.studio.locationsFull = [];
            RestApi.query({route: 'locations'}).$promise.then(function (response) {
                _.each($scope.studio.locations, function (locationId) {
                    $scope.studio.locationsFull.push(_.findWhere(response, {id: locationId}));
                });
            });
        });

        $scope.showDescription = false;

        uiGmapGoogleMapApi.then(function() {

            $scope.map = {
                center: {
                    latitude: $scope.studio.locationsFull[0].latitude,
                    longitude: 	$scope.studio.locationsFull[0].longitude
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
                    latitude: $scope.studio.locationsFull[0].latitude,
                    longitude: 	$scope.studio.locationsFull[0].longitude
                },
                icon: '/images/marker.svg'
            };

        });

    });
