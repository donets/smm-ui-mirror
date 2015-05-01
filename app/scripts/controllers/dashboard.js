'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, $rootScope, $q, RestApi, $cookieStore, $modal, gettextCatalog, $http, $window) {
        var fetchClasses = function (city, date) {
            /*$scope.clearFilters();*/
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/get/all', {cityId: city, date: date.format('YYYY-MM-DD')}).success(function (res) {
                $q.all([RestApi.query({route: 'studios',cityId: city}).$promise,
                        RestApi.query({route: 'locations',cityId: city}).$promise,
                        RestApi.query({route: 'districts',cityId: city}).$promise
                    ]).then(function (resolve) {
                    _.map(res.classes.classAccesses, function (obj) {
                        var studio = _.findWhere(resolve[0], {id: obj.studioId});
                        obj.studio = obj.studioId && studio ? studio : '';
                        obj.disciplinestyle = [obj.discipline, obj.style];
                    });
                    _.map(res.classes.occurenceAccesses, function (obj) {
                        var location = _.findWhere(resolve[1], {id: obj.locationId});
                        obj.location = obj.locationId && location ? location : '';
                    });
                    $scope.neigbourhood = resolve[2];
                    $scope.events = _.each(res.classes.occurenceAccesses, function (event) {
                        event.start_date = moment(event.date + 'T' + event.startTime);
                        event.end_date = moment(event.date + 'T' + event.endTime);
                        event.startTime = event.startTime.slice(0,5);
                        event.endTime = event.endTime.slice(0,5);
                        event.class = _.findWhere(res.classes.classAccesses, {id: event.classId});
                    });
                    $scope.events = _.filter($scope.events, function (event) {
                        return moment(event.start_date).isAfter(moment());
                    });
                    $scope.disciplines = _.uniq(_.pluck(res.classes.classAccesses, 'discipline'));
                    $scope.styles = _.uniq(_.pluck(res.classes.classAccesses, 'style'));
                    $scope.mergeDS = _.union($scope.disciplines, $scope.styles);
                    $scope.studios = _.uniq(_.pluck(res.classes.classAccesses, 'studio'));
                    $scope.showSpinner = false;
                });
            });
        };
        $scope.changeCity = function(cityId) {
            $scope.cityId = cityId;
            var selectedCity = _.findWhere($scope.cities, {id: cityId});
            $rootScope.$state.go('dashboard', {city: cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
            $rootScope.supportEmail = selectedCity.supportEmail;
            fetchClasses(cityId, $scope.currDay);
        };
        $scope.changeDay = function (city, day) {
            $scope.currDay = moment(day);
            fetchClasses(city, day);
        };
        $scope.init = function () {
            $scope.cities = $rootScope.configCities;
            $scope.cityId = parseInt($rootScope.$stateParams.city);
            if (! _.findWhere($scope.cities, {id: $scope.cityId})) {
                $scope.cityId = $scope.cities[0].id;
            }
            $scope.changeDay($scope.cityId, moment());
        };
        $scope.$on('configLoaded', $scope.init);

        $rootScope.signupPopap = $cookieStore.get('signupPopap');

        $rootScope.hideSignupPopap = function () {
            $rootScope.signupPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
