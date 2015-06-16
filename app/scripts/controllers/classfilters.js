'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassfiltersCtrl
 * @description
 * # ClassfiltersCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classfilters', [])
    .controller('ClassfiltersCtrl', function ($scope, $rootScope, $modal, $http, $window, $document, $analytics) {

        $scope._ = $window._;
        $scope.moment = $window.moment;
        $scope.weekdays = [];
        $scope.today = moment();
        for (var d = 0; d < 7; d++) {
            $scope.weekdays.push(moment().add(d, 'day'));
        }
        $scope.changeWeek = function (action) {
            _.each($scope.weekdays, function (d) {
                return action === 'add' ? d.add(1, 'week'): d.subtract(1, 'week');
            });
        };

        $scope.filtersMobile = false;
        $scope.filtersMobileShow = function () {
            $scope.filtersMobile = !$scope.filtersMobile;
        };
        $scope.expandFilters = false;
        $scope.expandFiltersClick = function () {
            if(!$scope.expandFilters) {
                $scope.expandFilters = true;
            }
        };
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
                max: 24
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

        $scope.show = {
            limit: 10
        };

        $scope.showMore = function () {
            $scope.show.limit += 5;
        };

        $scope.bookClass = function (event, elementClicked) {
            $modal.open({
                templateUrl: 'app/views/modalBook.html',
                controller: ['$scope', '$rootScope', '$modalInstance', 'event',

                    function ($scope, $rootScope, $modalInstance, event) {
                        $scope.event = event;
                        console.log(event);
                        $analytics.eventTrack({
                            'event': 'PDP',
                            'elementClicked': elementClicked,              // Set to 'title'|'CTA'. title-if class headline was clicked, CTA if 'RESERVE' button was clicked.
                            'studioName': event.studio.name,            // Salon/fitness club/etc name.
                            'studioId': event.studioId,                           // Salon/fitness club/etc ID.
                            'studioLocation': event.location.displayName,      // Salon/fitness club/etc city and district.
                            'className': event.title,                     // class name.
                            'classId': event.parent_event_id,                            // class ID.
                            'classTime': event.start_date.format("ddd") + '_' + event.startTime + '-' + event.endTime,                // Populate with: dayOfWeek_time
                            'classCategory': event.discipline
                        });
                        $scope.confirmBook = function () {
                            $scope.error = null;
                            $scope.showSpinner = true;
                            $rootScope.handledError = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + $scope.event.source.toLowerCase() + '/' + $scope.event.studioId + '/' + $scope.event.id).success(function (res) {
                                console.log(res);
                                $rootScope.handledError = false;
                                $scope.showSpinner = false;
                                event.bookingStatus = res.bookingStatus;
                                $analytics.eventTrack({
                                    'event': 'bookclass',
                                    'studioName': event.studio.name,            // Salon/fitness club/etc name.
                                    'studioId': event.studioId,                           // Salon/fitness club/etc ID.
                                    //'studioLocation': 'Berlin_Prenzlauer Berg',      // Salon/fitness club/etc city and district.
                                    'className': event.title,                     // class name.
                                    'classId': event.parent_event_id,                            // class ID.
                                    //'classTime': 'Fri_17:00-18:00',                // Populate with: dayOfWeek_time
                                    'classCategory': event.discipline                    // class category.
                                });
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
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/cancel/' + $scope.event.source.toLowerCase() + '/' + $scope.event.studioId + '/' + $scope.event.id).success(function (res) {
                                console.log(res);
                                $rootScope.handledError = false;
                                $scope.showSpinner = false;
                                event.bookingStatus = res.bookingStatus;
                                $analytics.eventTrack({
                                    'event': 'cancelBooking',
                                    'studioName': event.studio.name,            // Salon/fitness club/etc name.
                                    'studioId': event.studioId,                           // Salon/fitness club/etc ID.
                                    'studioLocation': event.location.displayName,      // Salon/fitness club/etc city and district.
                                    'className': event.title,                     // class name.
                                    'classId': event.parent_event_id,
                                    'classTime': event.start_date.format("ddd") + '_' + event.startTime + '-' + event.endTime,                // Populate with: dayOfWeek_time
                                    'classCategory': event.discipline
                                });
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
                    },
                    elementClicked: function () {
                        return elementClicked;
                    }
                },
                windowClass: 'modal-book'
            });
        };

        $scope.submitBook = function (event) {
            event.showSpinner = true;
            event.error = null;
            $rootScope.handledError = true;
            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + event.source.toLowerCase() + '/' + event.studioId + '/' + event.id).success(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.showSpinner = false;
                event.success = true;
                event.bookingStatus = res.bookingStatus;
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
            $http.post($window.smmConfig.restUrlBase + '/api/classes/cancel/' + event.source.toLowerCase() + '/' + event.studioId + '/' + event.id).success(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.showSpinner = false;
                event.bookingStatus = res.bookingStatus;
                $analytics.eventTrack({
                    'event': 'cancelBooking',
                    'studioName': event.studio.name,            // Salon/fitness club/etc name.
                    'studioId': event.studioId,                           // Salon/fitness club/etc ID.
                    'studioLocation': event.location.displayName,      // Salon/fitness club/etc city and district.
                    'className': event.title,                     // class name.
                    'classId': event.parent_event_id,
                    'classTime': event.start_date.format("ddd") + '_' + event.startTime + '-' + event.endTime,                // Populate with: dayOfWeek_time
                    'classCategory': event.discipline
                });
            }).error(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.error = res.type || 'default';
                event.showSpinner = false;
            });
        };
    });