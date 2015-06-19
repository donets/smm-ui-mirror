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
            $scope.city = $rootScope.currentCity ? $rootScope.currentCity : _.findWhere($scope.cities, {id: 4});
            $scope.changeCityLocation();
        });
        $scope.changeCityLocation = function () {
            $scope.showSpinner = true;
            $q.all([RestApi.query({route: 'events',cityId: $scope.city.id}).$promise,
                RestApi.query({route: 'studios',cityId: $scope.city.id}).$promise,
                RestApi.query({route: 'locations',cityId: $scope.city.id}).$promise,
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/disciplineLangs?langId=' + $scope.city.langId),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + $scope.city.langId)]).then(function (res) {
                $scope.classes = res[0];
                $scope.studios = res[1];
                $scope.locations = res[2];
                _.map($scope.classes, function (obj) {
                    var studio = _.findWhere($scope.studios, {id: obj.studioId});
                    var discipline = _.findWhere(res[3].data, {disciplineId: obj.disciplineId});
                    var style = _.findWhere(res[4].data, {subDisciplineId: obj.subDisciplineId});
                    obj.studio = obj.studioId && studio ? studio.name : '';
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
