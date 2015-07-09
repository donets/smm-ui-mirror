'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudiosCtrl
 * @description
 * # StudiosCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studios', [])
    .controller('StudiosCtrl', function ($scope, $rootScope, $q, RestApi, $window, $document) {
        var fetchStudios = function (city) {
            $scope.clearFilters();
            $scope.showSpinner = true;
            $q.all([RestApi.query({route: 'studios',cityId: city}).$promise,
                RestApi.query({route: 'locations',cityId: city}).$promise,
                RestApi.query({route: 'districts',cityId: city, showAreas: true}).$promise
            ]).then(function (resolve) {
                _.map(resolve[0], function (obj) {
                    obj.locationsFull = [];
                    _.each(obj.locations, function (locationId) {
                        var location = _.findWhere(resolve[1], {id: locationId});
                        if (locationId && location) {
                            obj.locationsFull.push(location);
                        }
                    });
                    obj.neigbourhood = _.compact(_.uniq(_.flatten(_.pluck(obj.locationsFull, 'districts'))));
                });
                _.map(resolve[2], function (item) {
                    item.disabled = !_.include(_.compact(_.uniq(_.flatten(_.pluck(resolve[0], 'neigbourhood')))), item.id);
                });
                $scope.neigbourhood = _.sortBy(resolve[2], 'id');
                $scope.studios = resolve[0];
                $scope.showSpinner = false;
            });
        };
        $scope.changeCity = function(cityId) {
            $scope.cityId = cityId;
            var selectedCity = _.findWhere($scope.cities, {id: cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
            $rootScope.supportEmail = selectedCity.supportEmail;
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
        $scope.expandFilters = false;
        $scope.expandFiltersClick = function () {
            if(!$scope.expandFilters) {
                $scope.expandFilters = true;
            }
        };
        $document.on('scroll', function() {
            if ($rootScope.desktop) {
                if ($scope.expandFilters && $document.scrollTop() > 60) {
                    $scope.expandFilters = false;
                }
            } else {
                if ($scope.filtersMobile && $document.scrollTop() > 90) {
                    $scope.filtersMobile = false;
                }
            }
            $scope.$apply();
        });
        $scope.clearFilters = function () {
            $scope.search = {
                class: {

                }
            };
        };
        $scope.clearFilters();

        $scope.show = {
            limit: 9
        };

        $scope.showMore = function () {
            $scope.show.limit += 3;
        };

    });
