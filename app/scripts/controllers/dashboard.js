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
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/get/all', {cityId: city, date: date.format('YYYY-MM-DD')}).success(function (res) {
                var qD = $q.defer();
                var qS = $q.defer();
                $http.get($window.smmConfig.restUrlBase + '/api/disciplines/all?cityId=' + city).success(function (res) {
                    _.map(res, function (item) {
                        item.type = gettextCatalog.getString('Activities');
                    });
                    $scope.disciplines = _.sortBy(res, 'name');
                    qD.resolve();
                });
                $http.get($window.smmConfig.restUrlBase + '/api/styles/all?cityId=' + city).success(function (res) {
                    _.map(res, function (item) {
                        item.type = gettextCatalog.getString('Disciplines');
                    });
                    $scope.styles = _.sortBy(res, 'name');
                    qS.resolve();
                });
                $q.all([RestApi.query({route: 'studios',cityId: city}, {cache: true}).$promise,
                        RestApi.query({route: 'locations',cityId: city}).$promise,
                        RestApi.query({route: 'districts',cityId: city}).$promise,
                        qD.$promise,
                        qS.$promise
                    ]).then(function (resolve) {
                        $scope.allstudios = resolve[0];
                        $scope.locations = resolve[1];
                        $scope.neigbourhood = resolve[2];
                    _.map(res.classes.classAccesses, function (obj) {
                        var studio = _.findWhere($scope.allstudios, {id: obj.studioId});
                        obj.studio = obj.studioId && studio ? studio : '';
                        if(obj.studio.linkClassesToStudioDisciplines) {
                            obj.disciplinestyle = _.union([obj.discipline, obj.style], obj.studio.disciplines.split(', '));
                        } else {
                            obj.disciplinestyle = [obj.discipline, obj.style];
                        }
                    });
                    _.map(res.classes.occurenceAccesses, function (obj) {
                        var location = _.findWhere($scope.locations, {id: obj.locationId});
                        obj.location = obj.locationId && location ? location : '';
                    });
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
