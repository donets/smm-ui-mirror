'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, $rootScope, $q, RestApi, $cookieStore, $modal, gettextCatalog, $http, $window, $document) {
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

        /*$scope._ = $window._;
        $scope.moment = $window.moment;
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
        $scope.expandFilters = false;
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
                start: 6,
                min: 6,
                end: 24,
                max: 24,
                class: {

                }
            };
        };
        $scope.clearFilters();

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
                controller: ['$scope', '$rootScope', '$modalInstance', 'event',

                    function ($scope, $rootScope, $modalInstance, event) {

                        $scope.event = event;

                        $scope.confirmBook = function () {
                            $scope.error = null;
                            $scope.showSpinner = true;
                            $rootScope.handledError = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + $scope.event.source.toLowerCase() + '/' + $scope.event.class.studioId + '/' + $scope.event.occurrenceId).success(function (res) {
                                console.log(res);
                                $rootScope.handledError = false;
                                $scope.showSpinner = false;
                                event.bookingStatus = 'BOOKED';
                            }).error(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                                $rootScope.handledError = false;
                                $scope.error = res.type || 'default';
                            });
                        };

                        $scope.cancelBook = function () {
                            $scope.error = null;
                            $scope.showSpinner = true;
                            $rootScope.handledError = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/cancel/' + $scope.event.source.toLowerCase() + '/' + $scope.event.class.studioId + '/' + $scope.event.occurrenceId).success(function (res) {
                                console.log(res);
                                $rootScope.handledError = false;
                                $scope.showSpinner = false;
                                event.bookingStatus = 'CANCELED';
                            }).error(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                                $rootScope.handledError = false;
                                $scope.error = res.type || 'default';
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
            event.error = null;
            $rootScope.handledError = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + event.source.toLowerCase() + '/' + event.class.studioId + '/' + event.occurrenceId).success(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.showSpinner = false;
                event.success = true;
                event.bookingStatus = 'BOOKED';
            }).error(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.error = res.type || 'default';
                event.showSpinner = false;
            });
        };

        $scope.cancelBook = function (event) {
            event.error = null;
            event.showSpinner = true;
            $rootScope.handledError = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/cancel/' + event.source.toLowerCase() + '/' + event.class.studioId + '/' + event.occurrenceId).success(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.showSpinner = false;
                event.bookingStatus = 'CANCELED';
            }).error(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.error = res.type || 'default';
                event.showSpinner = false;
            });
        };*/

        $rootScope.signupPopap = $cookieStore.get('signupPopap');

        $rootScope.hideSignupPopap = function () {
            $rootScope.signupPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
