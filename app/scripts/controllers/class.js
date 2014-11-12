'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassCtrl
 * @description
 * # ClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Class', [])
    .controller('ClassCtrl', function ($scope, getClass) {
        $scope.moment = moment();
        getClass.$promise.then(function () {
            //$scope.occurrences = getClass.occurrences;
            $scope.occurrences = [
                {
                    id: 169,
                    capacity: null,
                    ref_id: '13523393835',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-05-18T18:00:00.000Z',
                    end_date: '2016-05-18T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 26,
                    capacity: null,
                    ref_id: '13523395841',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-05-25T18:00:00.000Z',
                    end_date: '2016-05-25T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 230,
                    capacity: null,
                    ref_id: '13523397847',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-01T18:00:00.000Z',
                    end_date: '2016-06-01T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 63,
                    capacity: null,
                    ref_id: '13523399853',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-08T18:00:00.000Z',
                    end_date: '2016-06-08T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 203,
                    capacity: null,
                    ref_id: '13523401859',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-15T18:00:00.000Z',
                    end_date: '2016-06-15T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 96,
                    capacity: null,
                    ref_id: '13523403865',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-25T18:00:00.000Z',
                    end_date: '2016-06-25T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 228,
                    capacity: null,
                    ref_id: '13523405871',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-26T18:00:00.000Z',
                    end_date: '2016-06-26T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 229,
                    capacity: null,
                    ref_id: '13523405871',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-06-27T18:00:00.000Z',
                    end_date: '2016-06-27T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 145,
                    capacity: null,
                    ref_id: '13523407877',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-07-06T18:00:00.000Z',
                    end_date: '2016-07-06T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 38,
                    capacity: null,
                    ref_id: '13523409883',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-07-13T18:00:00.000Z',
                    end_date: '2016-07-13T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 212,
                    capacity: null,
                    ref_id: '13523411889',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-07-20T18:00:00.000Z',
                    end_date: '2016-07-20T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 181,
                    capacity: null,
                    ref_id: '13523415901',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2016-08-03T18:00:00.000Z',
                    end_date: '2016-08-03T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                }
            ];
            console.log(getClass.occurrences);
            $scope.occurrences = _.sortBy($scope.occurrences, 'start_date');
            _.each($scope.occurrences, function(obj) {
                var startDate = moment(obj.start_date);
                var endDate = moment(obj.end_date);
                //moment.relativeTimeThreshold('m', 1000);
                obj.startTime = startDate.format('HH:mm');
                obj.endTime = endDate.format('HH:mm');
                obj.duration = moment.duration(endDate.diff(startDate)).asMinutes();
                obj.day = startDate.isoWeekday();
            });
            $scope.groupByTime = _.groupBy($scope.occurrences, 'startTime');
            $scope.groupByDates = {};
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj, key) {
                $scope.groupByTime[key] = _.groupBy(obj, 'duration');
            });
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val, i) {
                    obj[i] = _.groupBy(val, 'day');
                    var memo = null;
                    _.each(val, function (c, j) {
                        var curr = moment(c.start_date);
                        if (memo && curr.isSame(moment(memo.start_date).add(1, 'w'))) {
                            c.weekly = memo.weekly;
                            c.daily = j;
                        } else if (memo && curr.isSame(moment(memo.start_date).add(1, 'd'))) {
                            c.weekly = j;
                            c.daily = memo.daily;
                        } else {
                            c.weekly = j;
                            c.daily = j;
                        }
                        memo = c;
                    });
                });
            });
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val) {
                    _.each(val, function (c, j) {
                        val[j] = _.groupBy(c, 'weekly');
                    });
                });
            });
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val) {
                    _.each(val, function (c) {
                        $scope.groupByDates = _.extend(_.clone(c), $scope.groupByDates);
                    });
                });
            });
            $scope.groupByDates = _.sortBy($scope.groupByDates, function(value, key) {
                return +key;
            });
            $scope.groupByDay = _.filter($scope.groupByDates, function (obj) {
                return obj.length === 1;
            });
            _.each($scope.groupByDay, function (obj, i) {
                $scope.groupByDay[i] = _.groupBy(obj, 'daily');
            });
            console.log($scope.groupByDay);
        });

    });
