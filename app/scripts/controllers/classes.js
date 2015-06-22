'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classes', [])
    .controller('ClassesCtrl', function ($scope, $rootScope, $http, $window, $q, RestApi, gettextCatalog) {
        RestApi.query({route: 'cities'}).$promise.then(function(response) {
            $scope.cities = response;
            $scope.cityID = $rootScope.currentCity ? $rootScope.currentCity.id : 4;
            $scope.changeCityLocation();
        });
        $scope.changeCityLocation = function () {
            $scope.showSpinner = true;
            $q.all([RestApi.query({route: 'events',cityId: $scope.cityID}).$promise,
                RestApi.query({route: 'studios',cityId: $scope.cityID}).$promise,
                RestApi.query({route: 'locations',cityId: $scope.cityID}).$promise,
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/disciplineLangs?langId=' + _.findWhere($scope.cities, {id: $scope.cityID}).langId),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + _.findWhere($scope.cities, {id: $scope.cityID}).langId)]).then(function (res) {
                $scope.classes = res[0];
                $scope.studios = res[1];
                $scope.locations = res[2];
                _.map($scope.classes, function (obj) {
                    var studio = _.findWhere($scope.studios, {id: obj.studioId});
                    var location = _.findWhere($scope.locations, {id: obj.locationId});
                    var discipline = _.findWhere(res[3].data, {disciplineId: obj.disciplineId});
                    var style = _.findWhere(res[4].data, {subDisciplineId: obj.subDisciplineId});
                    obj.studio = obj.studioId && studio ? studio.name : '';
                    obj.location = obj.locationId && location ? location.name : '';
                    obj.disciplineName = obj.disciplineId && discipline ? discipline.name : '';
                    obj.styleName = obj.subDisciplineId && style ? style.name : '';
                });
                $scope.clearFilters();
                $scope.showSpinner = false;
            });
        };
        $scope.clearFilters = function () {
            $scope.search = {};
        };
        $scope.clearFilters();
        $scope.levels = [
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
        ];
        $scope.limit = 20;
        $scope.showMore = function () {
            $scope.limit += 5;
        };
    });
