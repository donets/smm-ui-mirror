'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classes', [])
    .controller('ClassesCtrl', function ($scope, $rootScope, $http, $window, $q, RestApi, $modal, $interval, gettextCatalog) {
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
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + _.findWhere($scope.cities, {id: $scope.cityID}).langId),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplines')]).then(function (res) {
                $scope.classes = res[0];
                $scope.studios = res[1];
                $scope.locations = res[2];
                $scope.allclasses = res[0];
                $scope.disciplineLangs = res[3].data;
                $scope.subDisciplineLangs = res[4].data;
                $scope.disciplinesList = res[5].data;
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
        $scope.filterEmptyDiscipline = function () {
            if ($scope.emptyDiscipline) {
                $scope.classes = _.filter($scope.allclasses, function (obj) {
                    return obj.subDisciplineId === null;
                });
            } else {
                $scope.classes = _.clone($scope.allclasses);
            }
        };
        $scope.clearFilters = function () {
            $scope.search = {};
            $scope.emptyDiscipline = false;
            $scope.filterEmptyDiscipline();
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
        $scope.addDiscipline = function (c) {
            $modal.open({
                templateUrl: 'app/views/modalAddDiscipline.html',
                controller: ['$scope', '$modalInstance', '$http', 'parentScope', '$interval',

                    function ($scope, $modalInstance, $http, parentScope, $interval) {

                        $scope.class = c;

                        _.map(parentScope.disciplinesList, function (obj) {
                            var discipline = _.findWhere(parentScope.disciplineLangs, {disciplineId: obj.disciplineId});
                            var subDiscipline = _.findWhere(parentScope.subDisciplineLangs, {subDisciplineId: obj.id});
                            obj.disciplineName = discipline ? discipline.name : 'none';
                            obj.subDisciplineName = subDiscipline ? subDiscipline.name : 'none';
                            return obj.displayName = obj.id + '. ' + obj.disciplineName + '-' + obj.subDisciplineName;
                        });
                        $scope.disciplinesList = _.sortBy(parentScope.disciplinesList, 'id');

                        $scope.save = function () {
                            $scope.showSpinner = true;
                            $http.put($window.smmConfig.restUrlBase + '/api/rest/events/' + $scope.class.id, {subDisciplineId: $scope.subDisciplineId}).then(function (res) {
                                console.log(res);
                                $scope.class.subDisciplineId = res.subDisciplineId;
                                $scope.class.disciplineId = res.disciplineId;
                                parentScope.filterEmptyDiscipline();
                                $interval(function () {
                                    $modalInstance.close(res);
                                }, 1000, 1, {invokeApply: false});
                                $scope.showSpinner = false;
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.dismiss('close');
                        };

                    }],
                backdrop: 'static',
                resolve: {
                    parentScope : function () {
                        return $scope;
                    }
                },
                windowClass: 'modal-suggest'
            });
        };
    });
