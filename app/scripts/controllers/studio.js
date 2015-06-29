'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:StudioCtrl
 * @description
 * # StudioCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Studio', ['uiGmapgoogle-maps'])
    .controller('StudioCtrl', function ($scope, $rootScope, $q, $modal, $http, $window, $interval, RestApi, gettextCatalog, uiGmapGoogleMapApi) {
        $scope.coverMain = $rootScope.windowWidth > 1080 ? '/images/landing-2880.jpg' : '/images/landing-1080.jpg';
        $scope._ = _;
        RestApi.get({route: 'studios'}, {id: $rootScope.$stateParams.studioId}).$promise.then(function (res) {
            $scope.studio = res;
            $scope.studio.locationsFull = [];
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
            $q.all([RestApi.query({route: 'locations'}).$promise],
                qD.$promise,
                qS.$promise).then(function (res) {
                    _.each($scope.studio.locations, function (locationId) {
                        $scope.studio.locationsFull.push(_.findWhere(res[0], {id: locationId}));
                    });
                    $scope.currDay = moment();
                    $scope.setLocation($scope.studio.locationsFull[0]);
                });
        });

        $scope.showDescription = false;
        $scope.changeDay = function (day) {
            $scope.currDay = moment(day);
            $scope.setLocation($scope.currLocation);
        };

        $scope.setLocation = function (location) {
            $scope.currLocation = location;
            $scope.showSpinner = true;
            $http.get($window.smmConfig.restUrlBase + '/api/v2/eager/classOccurrences?locationId=' + location.id + '&startDate=' + $scope.currDay.format('YYYY-MM-DD')).success(function (res) {

                _.map(res, function (obj) {
                    obj.location = location;
                    obj.studio = $scope.studio;
                    if (obj.subdiscipline) {
                        var discipline = _.findWhere($scope.disciplines, {disciplineId: obj.subdiscipline.disciplineId});
                        var style = _.findWhere($scope.styles, {subDisciplineId: obj.subdiscipline.id});
                        obj.discipline = obj.subdiscipline.disciplineId && discipline ? discipline.name : obj.discipline;
                        obj.style = obj.subdiscipline.id && style ? style.name : obj.style;
                    }
                    if($scope.studio.linkClassesToStudioDisciplines && $scope.studio.disciplines) {
                        obj.disciplinestyleName = _.union([obj.discipline, obj.style], obj.studio.disciplines.split(', '));
                    } else {
                        obj.disciplinestyleId = obj.subdiscipline ? [obj.subdiscipline.id, obj.subdiscipline.disciplineId] : 0;
                    }
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
                _.map($scope.styles, function (item) {
                    item.disabled = !_.include(_.compact(_.uniq(_.pluck(_.pluck(res, 'subdiscipline'), 'id'))), item.subDisciplineId);
                });
                $scope.mergeDS = _.union($scope.disciplines, $scope.styles);
                $scope.showSpinner = false;
                $interval(function () {
                    $('#discipline').trigger("chosen:updated");
                }, 0, 1, {invokeApply: false});

            });
            uiGmapGoogleMapApi.then(function() {

                $scope.map = {
                    center: {
                        latitude: $scope.currLocation.latitude,
                        longitude: 	$scope.currLocation.longitude
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
                        latitude: $scope.currLocation.latitude,
                        longitude: 	$scope.currLocation.longitude
                    },
                    icon: '/images/marker.svg'
                };

            });
        };

    });
