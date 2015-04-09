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
        /*$q.all([getClasses.$promise, getOccurrences.$promise, getStudios.$promise, getLocations.$promise, getNeigbourhood.$promise]).then(function (res) {
            $scope.studios = res[2];
            _.map(res[0], function (obj) {
                var studio = _.findWhere(res[2], {id: obj.studioId});
                var location = _.findWhere(res[3], {id: obj.locationId});
                obj.studio = obj.studioId && studio ? studio : '';
                obj.location = obj.locationId && location ? location.neigbourhood : '';
            });
            $scope.events = _.each(res[1], function (event) {
                event.start_date = moment(event.start_date);
                event.end_date = moment(event.end_date);
                event.class = _.findWhere(res[0], {id: event.parent_event_id});
            });
            $scope.neigbourhood = res[4];
        });*/
        var fetchClasses = function (city, date) {
            $scope.clearFilters();
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/get/all', {cityId: city, date: date.format('YYYY-MM-DD')}).success(function (res) {
                $q.all([RestApi.query({route: 'studios',cityId: city}).$promise,
                        RestApi.query({route: 'locations',cityId: city}).$promise,
                        RestApi.query({route: 'districts',cityId: city}).$promise
                    ]).then(function (resolve) {
                    _.map(res.classes.classAccesses, function (obj) {
                        var studio = _.findWhere(resolve[0], {id: obj.studioId});
                        var location = _.findWhere(resolve[1], {id: obj.locationId});
                        obj.studio = obj.studioId && studio ? studio : '';
                        obj.location = obj.locationId && location ? location.neigbourhood : '';
                    });
                    $scope.neigbourhood = resolve[2];
                    $scope.events = _.each(res.classes.occurenceAccesses, function (event) {
                        event.start_date = moment(event.date + 'T' + event.startTime);
                        event.end_date = moment(event.date + 'T' + event.endTime);
                        event.startTime = event.startTime.slice(0,5);
                        event.endTime = event.endTime.slice(0,5);
                        event.class = _.findWhere(res.classes.classAccesses, {id: event.classId});
                    });
                    $scope.disciplines = _.uniq(_.pluck(res.classes.classAccesses, 'discipline'));
                    $scope.studios = _.compact(_.uniq(_.pluck(res.classes.classAccesses, 'studio')));
                    $scope.showSpinner = false;
                    console.log($scope.events);
                });
            });
        };
        $scope.changeCity = function(cityId) {
            $scope.cityId = cityId;
            var selectedCity = _.findWhere($scope.cities, {id: cityId});
            $rootScope.$state.go('dashboard', {city: cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
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
            $scope.changeDay($scope.cityId, $scope.today);
        };
        $scope.$on('configLoaded', $scope.init);
        $scope.weekdays = [];
        $scope.today = moment();
        $scope.changeWeek = function (action) {
            _.each($scope.weekdays, function (d) {
                return action === 'add' ? d.add(1, 'week'): d.subtract(1, 'week');
            });
        };
        for (var d = 0; d < 7; d++) {
            $scope.weekdays.push(moment().add(d, 'day'));
        }
        $scope.filtersMobile = false;
        $scope.filtersMobileShow = function () {
            $scope.filtersMobile = !$scope.filtersMobile;
        };
        $scope.trans = function (value) {
            var pad = '00';
            return value === '24' ? '00:00' : pad.substring(0, pad.length - value.length) + value + ':00';
        };
        $scope.levels = [
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
        ];

        $scope.clearFilters = function () {
            $scope.search = {
                start: 6,
                min: 6,
                end: 24,
                max: 24,
                class: {

                }
            };
        };
        $scope.clearFilters();

        $scope._ = $window._;
        $scope.moment = $window.moment;

        $scope.showDatepicker = {};
        $scope.openDatepicker = function($event, type) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.showDatepicker[type] = !$scope.showDatepicker[type];
        };
        $scope.minStartDate = new Date();
        $scope.dateOptions = {
            startingDay: 1,
            showWeekNumbers: false,
            showWeeks: false
        };

        $scope.bookClass = function (event) {
            $modal.open({
                templateUrl: 'views/modalBook.html',
                controller: ['$scope', '$modalInstance', 'event',

                    function ($scope, $modalInstance, event) {

                        $scope.event = event;

                        $scope.confirmBook = function () {
                            $scope.showSpinner = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + $scope.event.source.toLowerCase() + '/' + $scope.event.classId + '/' + $scope.event.occurrenceId).success(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                                $scope.success = true;
                            }).error(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                resolve: {
                    event: function () {
                        return event;
                    }
                },
                windowClass: 'modal-book'
            });
        };
        
        $scope.submitBook = function (event) {
            event.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + event.source.toLowerCase() + '/' + event.classId + '/' + event.occurrenceId).success(function (res) {
                console.log(res);
                event.showSpinner = false;
                event.success = true;
            }).error(function (res) {
                console.log(res);
                event.showSpinner = false;
            });
        };

        $scope.showPopap = $cookieStore.get('signupPopap');
        
        $scope.hidePopap = function () {
            $scope.showPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
