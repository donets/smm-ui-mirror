'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, $rootScope, $q, RestApi, $cookieStore, $modal, gettextCatalog, $http, $window, $interval) {
        var fetchClasses = function (date) {
            $scope.showSpinner = true;
            $http.get($window.smmConfig.restUrlBase + '/api/v2/eager/classOccurrences?cityId=' + $scope.cityId + '&startDate=' + date.format('YYYY-MM-DD')).success(function (res) {
                _.map(res, function (obj) {
                    var studio = _.findWhere($scope.allstudios, {id: obj.studioId});
                    var location = _.findWhere($scope.locations, {id: obj.locationId});
                    obj.studio = obj.studioId && studio ? studio : '';
                    obj.location = obj.locationId && location ? location : '';
                    if (obj.subdiscipline) {
                        var discipline = _.findWhere($scope.disciplines, {disciplineId: obj.subdiscipline.disciplineId});
                        var style = _.findWhere($scope.styles, {subDisciplineId: obj.subdiscipline.id});
                        obj.discipline = obj.subdiscipline.disciplineId && discipline ? discipline.name : obj.discipline;
                        obj.style = obj.subdiscipline.id && style ? style.name : obj.style;
                    }
                    if(obj.studio.linkClassesToStudioDisciplines && obj.studio.disciplines) {
                        obj.disciplinestyleName = _.union([obj.discipline, obj.style], obj.studio.disciplines.split(', '));
                    } else {
                        obj.disciplinestyleId = obj.subdiscipline ? [obj.subdiscipline.id, obj.subdiscipline.disciplineId] : 0;
                    }
                });
                $scope.neigbourhoodUPD = _.sortBy($scope.neigbourhood, 'name');
                _.map($scope.neigbourhoodUPD, function (item) {
                    item.disabled = !_.include(_.compact(_.uniq(_.pluck(_.pluck(res, 'location'), 'neigbourhood'))), item.name);
                });
                $scope.events = _.each(res, function (event) {
                    event.start_date = moment(event.date + 'T' + event.startTime);
                    event.end_date = moment(event.date + 'T' + event.endTime);
                    event.startTime = event.startTime.slice(0,5);
                    event.endTime = event.endTime.slice(0,5);
                });
                $scope.events = _.filter($scope.events, function (event) {
                    return moment(event.start_date).isAfter(moment());
                });
                console.log($scope.events);
                _.map($scope.styles, function (item) {
                    item.disabled = !_.include(_.compact(_.uniq(_.pluck(_.pluck(res, 'subdiscipline'), 'id'))), item.subDisciplineId);
                });
                $scope.studios = _.uniq(_.pluck(res, 'studio'));
                $scope.mergeDS = _.union($scope.disciplines, $scope.styles);
                $scope.showSpinner = false;
                $interval(function () {
                    $('#neigbourhood').trigger("chosen:updated");
                    $('#discipline').trigger("chosen:updated");
                }, 0, 1, {invokeApply: false});
            });
        };
        var fetchData = function (city) {
            var qD = $q.defer();
            var qS = $q.defer();
            $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/disciplineLangs?langId=' + $rootScope.langId).success(function (response) {
                _.map(response, function (item) {
                    item.type = gettextCatalog.getString('Activities');
                });
                $scope.disciplines = _.sortBy(response, 'name');
                qD.resolve();
            });
            $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + $rootScope.langId).success(function (response) {
                _.map(response, function (item) {
                    item.type = gettextCatalog.getString('Disciplines');
                });
                $scope.styles = _.sortBy(response, 'name');
                qS.resolve();
            });
            $q.all([RestApi.query({route: 'studios',cityId: city}).$promise,
                RestApi.query({route: 'locations',cityId: city}).$promise,
                RestApi.query({route: 'districts',cityId: city}).$promise,
                qD.$promise,
                qS.$promise
            ]).then(function (resolve) {
                $scope.allstudios = resolve[0];
                $scope.locations = resolve[1];
                $scope.neigbourhood = resolve[2];
                $scope.changeDay(moment());
            });
        };
        $scope.changeCity = function(cityId) {
            $scope.cityId = cityId;
            var selectedCity = _.findWhere($scope.cities, {id: cityId});
            $rootScope.$state.go('dashboard', {city: cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
            $rootScope.supportEmail = selectedCity.supportEmail;
        };
        $scope.changeDay = function (day) {
            $scope.currDay = moment(day);
            fetchClasses(day);
        };
        $scope.init = function () {
            $scope.cities = $rootScope.configCities;
            $scope.cityId = parseInt($rootScope.$stateParams.city);
            if (! _.findWhere($scope.cities, {id: $scope.cityId})) {
                $scope.cityId = $scope.cities[0].id;
            }
            fetchData($scope.cityId);
        };
        $scope.$on('configLoaded', $scope.init);

        $rootScope.signupPopap = $cookieStore.get('signupPopap');

        $rootScope.hideSignupPopap = function () {
            $rootScope.signupPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
