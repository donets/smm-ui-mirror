'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassCtrl
 * @description
 * # ClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Class', [])
    .controller('ClassCtrl', function ($scope) {
        $scope.moment = moment();
        //getClass.$promise.then(function () {
        //getOccurrences.$promise.then(function () {
        //    console.log(getOccurrences);
        //});
            //$scope.occurrences = getOccurrences;
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
                    start_date: '2016-06-08T17:00:00.000Z',
                    end_date: '2016-06-08T19:00:00.000Z',
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
                    end_date: '2016-06-08T19:00:00.000Z',
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
                    id: 230,
                    capacity: null,
                    ref_id: '13523405871',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2014-06-28T18:00:00.000Z',
                    end_date: '2014-06-28T20:00:00.000Z',
                    total_tickets: 5,
                    total_tickets_left: 5
                },
                {
                    id: 230,
                    capacity: null,
                    ref_id: '13523405871',
                    ref_provider_id: 'eventbrite',
                    ref_status: 'LIVE',
                    parent_event_id: 7,
                    start_date: '2014-06-29T18:00:00.000Z',
                    end_date: '2014-06-29T20:00:00.000Z',
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

        //});

        var groupOccurrences = function (occurrences) {
            occurrences = _.sortBy(occurrences, 'start_date');
            _.each(occurrences, function(obj) {
                var startDate = moment(obj.start_date);
                var endDate = moment(obj.end_date);
                obj.startTime = startDate.format('HH:mm');
                obj.endTime = endDate.format('HH:mm');
                obj.duration = moment.duration(endDate.diff(startDate)).asMinutes();
                obj.weekday = startDate.isoWeekday();
                obj.year = startDate.year();
                obj.day = startDate.dayOfYear();
            });
            $scope.groupByTime = _.groupBy(occurrences, 'startTime');
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj, key) {
                $scope.groupByTime[key] = _.groupBy(obj, 'endTime');
            });
            _.each($scope.groupByTime, function (obj, st) {
                _.each(obj, function (val, et) {
                    obj[et] = _.groupBy(val, 'weekday');
                    var memo = null;
                    _.each(val, function (c, j) {
                        var curr = moment(c.start_date);
                        if (memo && curr.isSame(moment(memo.start_date).add(1, 'w'))) {
                            c.weekly = memo.weekly;
                            c.daily = c.year + '' + c.day + '' + st.replace(':','') + '' + et.replace(':','') + j;
                        } else if (memo && curr.isSame(moment(memo.start_date).add(1, 'd'))) {
                            c.weekly = c.year + '' + c.day + '' + st.replace(':','') + '' + et.replace(':','') + j;
                            c.daily = memo.daily;
                        } else {
                            c.weekly = c.year + '' + c.day + '' + st.replace(':','') + '' + et.replace(':','') + j;
                            c.daily = c.year + '' + c.day + '' + st.replace(':','') + '' + et.replace(':','') + j;
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
            $scope.groupByWeekly = [];
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val) {
                    _.each(val, function (c) {
                        $scope.groupByWeekly = _.extend(_.clone(c), $scope.groupByWeekly);
                    });
                });
            });
            console.log($scope.groupByWeekly);
            $scope.groupByDaily = _.filter($scope.groupByWeekly, function (obj) {
                return obj.length === 1;
            });

            $scope.groupByDaily = _.flatten($scope.groupByDaily);
            $scope.groupByDaily = _.sortBy($scope.groupByDaily, 'weekly');
            $scope.groupByDaily = _.groupBy($scope.groupByDaily, 'daily');
            _.map($scope.groupByDaily, function (obj) {
                if (obj.length === 1) {
                    obj.repeat = 'Single';
                } else {
                    obj.repeat = 'Daily';
                }
            });
            $scope.groupByWeekly = _.reject($scope.groupByWeekly, function (obj) {
                return obj.length === 1;
            });
            $scope.groupByWeekly = _.flatten($scope.groupByWeekly);
            $scope.groupByWeekly = _.groupBy($scope.groupByWeekly, 'weekly');
            _.map($scope.groupByWeekly, function (obj) {
                obj.repeat = 'Weekly';
                obj.day = 'on ' + moment(_.first(obj).start_date).format('dddd');
            });
            $scope.groupByAll = _.extend(_.clone($scope.groupByDaily), _.clone($scope.groupByWeekly));
            $scope.groupByAll = _.sortBy($scope.groupByAll, function(value, key) {
                return +key;
            });
            _.map($scope.groupByAll, function (obj) {
                obj.frame = 'Starting ' + moment(_.first(obj).start_date).format('MMMM D YYYY') + (obj.length > 1 ? ' through ' + moment(_.last(obj).start_date).format('MMMM D YYYY') : '');
                obj.time = _.first(obj).startTime + ' - ' + _.first(obj).endTime;
            });
            console.log($scope.groupByWeekly);
            console.log($scope.groupByDaily);
            console.log($scope.groupByAll);
        };

        groupOccurrences($scope.occurrences);

    });
