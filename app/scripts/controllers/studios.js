'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudiosCtrl
 * @description
 * # StudiosCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studios', [])
    .controller('StudiosCtrl', function ($scope, $rootScope, $q, RestApi, $window) {
        var fetchStudios = function (city) {
            $scope.clearFilters();
            $scope.showSpinner = true;
            $q.all([RestApi.query({route: 'studios',cityId: city}).$promise,
                RestApi.query({route: 'locations',cityId: city}).$promise,
                RestApi.query({route: 'districts',cityId: city}).$promise
            ]).then(function (resolve) {
                _.map(resolve[0], function (obj) {
                    obj.locationsFull = [];
                    _.each(obj.locations, function (locationId) {
                        var location = _.findWhere(resolve[1], {id: locationId});
                        if (locationId && location) {
                            obj.locationsFull.push(location);
                        }
                    });
                    obj.neigbourhood = _.pluck(obj.locationsFull, 'neigbourhood');
                });
                $scope.neigbourhood = resolve[2];
                $scope.studios = resolve[0];
                $scope.showSpinner = false;
                console.log($scope.studios);
            });
        };
        $scope.changeCity = function(cityId) {
            $scope.cityId = cityId;
            var selectedCity = _.findWhere($scope.cities, {id: cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
            $rootScope.$state.go('allstudios', {city: cityId});
        };
        $scope.init = function () {
            $scope.cities = $rootScope.configCities;
            $scope.cityId = parseInt($rootScope.$stateParams.city);
            if (! _.findWhere($scope.cities, {id: $scope.cityId})) {
                $scope.cityId = $scope.cities[0].id;
            }
            fetchStudios($scope.cityId);
        };
        $scope.$on('configLoaded', $scope.init);

        $scope._ = $window._;
        $scope.filtersMobile = false;
        $scope.filtersMobileShow = function () {
            $scope.filtersMobile = !$scope.filtersMobile;
        };
        $scope.clearFilters = function () {
            $scope.search = {
                class: {

                }
            };
        };
        $scope.clearFilters();

    });
