'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ReservationsCtrl
 * @description
 * # ReservationsCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reservations', [])
    .controller('ReservationsCtrl', function ($scope, $rootScope, getMembership, $q, RestApi, $cookieStore, $modal, gettextCatalog, $http, $window) {

        $scope.getReservations = function (status) {
            $scope.status = status;
            $scope.showSpinner = true;
                $http.get($window.smmConfig.restUrlBase + '/api/bookings/get').success(function (res) {
                /*res = {
                    "status": "success",
                    "bookings": {
                        "bookings": [
                            {
                                "id": 400,
                                "occurrenceId": 1,
                                "created": "2015-04-18T12:56:25.556+03:00",
                                "updated": "2015-04-18T12:58:14.999+03:00",
                                "status": "CANCELED",
                                "signedIn": null,
                                "studioId": 1
                            },
                            {
                                "id": 390,
                                "occurrenceId": 784,
                                "created": "2015-04-18T12:44:05.655+03:00",
                                "updated": "2015-04-18T13:06:21.551+03:00",
                                "status": "CANCELED",
                                "signedIn": null,
                                "studioId": 1
                            },
                            {
                                "id": 380,
                                "occurrenceId": 4697,
                                "created": "2015-04-18T12:35:05.593+03:00",
                                "updated": "2015-04-18T12:48:56.467+03:00",
                                "status": "CANCELED",
                                "signedIn": null,
                                "studioId": 1
                            },
                            {
                                "id": 381,
                                "occurrenceId": 3131,
                                "created": "2015-04-14T21:30:00.000+03:00",
                                "updated": "2015-04-14T21:30:00.000+03:00",
                                "status": "BOOKED",
                                "signedIn": true,
                                "studioId": 1
                            }
                        ],
                        "occurenceAccesses": [
                            {
                                "bookable": true,
                                "bookingStatus": "CANCELED",
                                "bookableSpotsLeft": null,
                                "occurrenceId": 784,
                                "classId": "1+1",
                                "status": "LIVE",
                                "date": "2015-04-20",
                                "startTime": "20:30:00.000",
                                "endTime": "21:30:00.000",
                                "source": "MINDBODY",
                                "studioId": "1"
                            },
                            {
                                "bookable": true,
                                "bookingStatus": "CANCELED",
                                "bookableSpotsLeft": null,
                                "occurrenceId": 1,
                                "classId": "1+1",
                                "status": "LIVE",
                                "date": "2015-04-19",
                                "startTime": "20:30:00.000",
                                "endTime": "21:30:00.000",
                                "source": "MINDBODY",
                                "studioId": "1"
                            },
                            {
                                "bookable": true,
                                "bookingStatus": "CANCELED",
                                "bookableSpotsLeft": null,
                                "occurrenceId": 4697,
                                "classId": "1+1",
                                "status": "LIVE",
                                "date": "2015-04-18",
                                "startTime": "20:30:00.000",
                                "endTime": "21:30:00.000",
                                "source": "MINDBODY",
                                "studioId": "1"
                            },
                            {
                                "bookable": true,
                                "bookingStatus": "BOOKED",
                                "bookableSpotsLeft": null,
                                "occurrenceId": 3131,
                                "classId": "1+1",
                                "status": "ENDED",
                                "date": "2015-04-18",
                                "startTime": "20:30:00.000",
                                "endTime": "21:30:00.000",
                                "source": "MINDBODY",
                                "studioId": "1"
                            }
                        ],
                        "classAccesses": [
                            {
                                "id": "1+1",
                                "title": "TransSerfing",
                                "discipline": null,
                                "style": null,
                                "locationId": null,
                                "studioId": 1,
                                "status": "LIVE",
                                "description": null,
                                "levels": null,
                                "teacherName": "Viktor Talan",
                                "requiresRegistration": true,
                                "freeSchedule": false,
                                "visitDurationMinutes": 60,
                                "acceptedPlans": null
                            }
                        ]
                    }
                };*/
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
                $scope.groupRes = _.groupBy(_.filter($scope.events, function (event) {
                    if (status === 'LIVE') {
                        return moment(event.start_date).isAfter(moment());
                    } else {
                        return moment(event.start_date).isBefore(moment());
                    }
                }), 'date');
                $scope.showSpinner = false;
            });
        };


        $q.all([RestApi.query({route: 'studios',cityId: getMembership.membership.cityId}).$promise,
                RestApi.query({route: 'locations',cityId: getMembership.membership.cityId}).$promise
        ]).then(function (resolve) {
            $scope.studios = resolve[0];
            $scope.locations = resolve[1];
            $scope.getReservations('LIVE');
        });


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
        };

    });
