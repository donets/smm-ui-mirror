'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:CreateClassCtrl
 * @description
 * # CreateClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.CreateClass', [])
    .controller('CreateClassCtrl', function ($scope, $rootScope, getLocations, getStudios, RestApi, $http, $q, $window, gettextCatalog) {
        getLocations.$promise.then(function () {
            $scope.locations = getLocations;
        });
        getStudios.$promise.then(function () {
            $scope.studios = getStudios;
        });
        $scope.levels = [
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
        ];
        $scope.class = new RestApi();

        $scope.save = function (status) {
            $scope.showSpinner = true;
            $scope.class.status = status;
            $scope.class.$save({route: 'events'}).then(function (res) {
                console.log(res);
                $scope.showSpinner = false;
                $rootScope.$state.go('admin.classes.class', {classId: res.data.id});
            });
        };

        var getDisciplinesList = function () {
            $q.all([$http.get($window.smmConfig.restUrlBase + '/api/v2/rest/disciplineLangs?langId=' + ($rootScope.langId || 1)),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + ($rootScope.langId || 1)),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplines')]).then(function (res) {
                _.map(res[2].data, function (obj) {
                    var discipline = _.findWhere(res[0].data, {disciplineId: obj.id});
                    var subDiscipline = _.findWhere(res[1].data, {subDisciplineId: obj.id});
                    obj.disciplineName = discipline ? discipline.name : 'none';
                    obj.subDisciplineName = subDiscipline ? subDiscipline.name : 'none';
                    return obj.displayName = obj.id + '.' + obj.disciplineName + '-' + obj.subDisciplineName;
                });
                $scope.disciplinesList = res[2].data;
            });
        };

        getDisciplinesList();

        $scope.setDisciplineId = function (id) {
            var discipline = _.findWhere($scope.disciplinesList, {id: id});
            $scope.class.disciplineId = discipline ? discipline.disciplineId : null;
        };

    });
