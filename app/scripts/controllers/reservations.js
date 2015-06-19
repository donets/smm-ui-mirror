'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ReservationsCtrl
 * @description
 * # ReservationsCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reservations', [])
    .controller('ReservationsCtrl', function ($scope, $rootScope, getMembership, $q, RestApi, $cookieStore, $modal, gettextCatalog, $http, $window, $analytics) {

        $scope.getReservations = function () {
            $scope.showSpinner = true;
                $http.get($window.smmConfig.restUrlBase + '/api/bookings/get').success(function (res) {
                _.map(res.bookings.classAccesses, function (obj) {
                    var studio = _.findWhere($scope.studios, {id: obj.studioId});
                    var location = _.findWhere($scope.locations, {id: obj.locationId});
                    obj.disciplinestyle = [obj.discipline, obj.style];
                    obj.studio = obj.studioId && studio ? studio : '';
                    obj.location = obj.locationId && location ? location : '';
                });
                $scope.events = _.each(res.bookings.occurenceAccesses, function (event) {
                    event.start_date = moment(event.date + 'T' + event.startTime);
                    event.end_date = moment(event.date + 'T' + event.endTime);
                    event.startTime = event.startTime.slice(0,5);
                    event.endTime = event.endTime.slice(0,5);
                    event.class = _.findWhere(res.bookings.classAccesses, {id: event.classId});
                });
                _.map($scope.events, function (event) {
                    event.requiresRegistration = event.class.requiresRegistration;
                    event.description = event.class.description;
                    event.title = event.class.title;
                    event.studio = event.class.studio;
                    event.location = event.class.location;
                });
                $scope.groupResAfter = _.groupBy(_.filter($scope.events, function (event) {
                    return moment(event.start_date).isAfter(moment());
                }), 'date');
                $scope.groupResBefore = _.groupBy(_.filter($scope.events, function (event) {
                    return moment(event.start_date).isBefore(moment());
                }), 'date');
                $scope.showSpinner = false;
            });
        };


        $q.all([RestApi.query({route: 'studios',cityId: getMembership.membership.cityId}).$promise,
                RestApi.query({route: 'locations',cityId: getMembership.membership.cityId}).$promise
        ]).then(function (resolve) {
            $scope.studios = resolve[0];
            $scope.locations = resolve[1];
            $scope.getReservations();
        });


        $scope.bookClass = function (event, elementClicked) {
            $modal.open({
                templateUrl: 'app/views/modalBook.html',
                controller: ['$scope', '$rootScope', '$modalInstance', 'event',

                    function ($scope, $rootScope, $modalInstance, event) {

                        $scope.event = event;
                        $analytics.eventTrack({
                            'event': 'PDP',
                            'elementClicked': elementClicked,              // Set to 'title'|'CTA'. title-if class headline was clicked, CTA if 'RESERVE' button was clicked.
                            'studioName': event.class.studio === '' ? event.class.studio : event.class.studio.name,            // Salon/fitness club/etc name.
                            'studioId': event.class.studioId,                           // Salon/fitness club/etc ID.
                            'studioLocation': event.class.location === '' ? event.class.location : event.class.location.displayName,      // Salon/fitness club/etc city and district.
                            'className': event.class.title,                     // class name.
                            'classId': event.class.id,                            // class ID.
                            'classTime': event.start_date.format("ddd") + '_' + event.startTime + '-' + event.endTime,                // Populate with: dayOfWeek_time
                            'classCategory': event.class.discipline
                        });

                        $scope.confirmBook = function () {
                            $scope.error = null;
                            $scope.showSpinner = true;
                            $rootScope.handledError = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + $scope.event.source.toLowerCase() + '/' + $scope.event.class.studioId + '/' + $scope.event.occurrenceId).success(function (res) {
                                console.log(res);
                                $rootScope.handledError = false;
                                $scope.showSpinner = false;
                                event.bookingStatus = res.bookingStatus;
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
                                event.bookingStatus = res.bookingStatus;
                                $analytics.eventTrack({
                                    'event': 'cancelBooking',
                                    'studioName': event.class.studio === '' ? event.class.studio : event.class.studio.name,            // Salon/fitness club/etc name.
                                    'studioId': event.class.studioId,                           // Salon/fitness club/etc ID.
                                    'studioLocation': event.class.location === '' ? event.class.location : event.class.location.displayName,      // Salon/fitness club/etc city and district.
                                    'className': event.class.title,                     // class name.
                                    'classId': event.class.id,
                                    'classTime': event.start_date.format("ddd") + '_' + event.startTime + '-' + event.endTime,                // Populate with: dayOfWeek_time
                                    'classCategory': event.class.discipline
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
            $http.post($window.smmConfig.restUrlBase + '/api/classes/book/' + event.source.toLowerCase() + '/' + event.class.studioId + '/' + event.occurrenceId).success(function (res) {
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
            $http.post($window.smmConfig.restUrlBase + '/api/classes/cancel/' + event.source.toLowerCase() + '/' + event.class.studioId + '/' + event.occurrenceId).success(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.showSpinner = false;
                event.bookingStatus = res.bookingStatus;
                $analytics.eventTrack({
                    'event': 'cancelBooking',
                    'studioName': 'Rotana salon unisex',            // Salon/fitness club/etc name.
                    'studioId': 'M-0206',                           // Salon/fitness club/etc ID.
                    'studioLocation': 'Berlin,Prenzlauer Berg',      // Salon/fitness club/etc city and district.
                    'className': 'Rotana Yoga',                     // class name.
                    'classId': 'M-0206',                            // class ID.
                    'classTime': 'Fri_17:00-18:00',                // Populate with: dayOfWeek_time
                    'classCategory': 'Yoga'
                });
            }).error(function (res) {
                console.log(res);
                $rootScope.handledError = false;
                event.error = res.type || 'default';
                event.showSpinner = false;
            });
        };

        $scope.showPastClassesClick = function () {
            $scope.showPastClasses = true;
        };

    });
