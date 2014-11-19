'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassCtrl
 * @description
 * # ClassCtrl
 * Controller of the boltApp
 */

/* jshint undef:false */

angular.module('boltApp.controllers.Class', [])
    .controller('ClassCtrl', function ($scope, $rootScope, getClass, getOccurrences, Occurrences) {
        $scope.moment = moment();
        $scope._ = _;
        getClass.$promise.then(function () {
            $scope.class = getClass;
        });
        getOccurrences.$promise.then(function () {
            $scope.occurrences = getOccurrences;
            groupOccurrences(getOccurrences);
        });

        $scope.toggleGroup = function(obj) {
            obj.hide = !obj.hide;
        };

        $scope.showSchedule = false;

        $scope.startTimeList = [];

        $scope.weekdayList = [];

        $scope.repeatList = [
            'Daily',
            'Weekly',
            'Single'
        ];

        $scope.checkDate = function(date) {

            console.log($scope.schedule[date]);
            console.log(moment($scope.schedule[date]).zone());
            $scope.schedule[date] = moment($scope.schedule[date]).format();
            //$scope.schedule[date] = moment($scope.schedule[date]).subtract(moment($scope.schedule[date]).zone(), 'm').toISOString();

            /*if($scope.schedule.startDate.getDate() === new Date().getDate() && new Date().getHours() > 5) {
                setTimeList($scope.timeList, (new Date().getHours() + 1));
            } else {
                setTimeList($scope.timeList, false);
            }*/

        };

        setTimeList($scope.startTimeList, false, 23);

        setWeekdayList($scope.weekdayList);

        $scope.showDatepicker = {};

        $scope.openDatepicker = function($event, type) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.showDatepicker[type] = true;
        };
        $scope.minStartDate = new Date();
        $scope.dateOptions = {
            startingDay: 1,
            showWeekNumbers: false,
            showWeeks: false
        };

        $scope.addDates = function() {
            $scope.showSchedule = true;
            $scope.newEvent = true;
            $scope.schedule = {};
        };

        $scope.setEndTimeList = function() {
            $scope.endTimeList = [];
            setTimeList($scope.endTimeList, $scope.schedule.startTime);
        };

        $scope.updateSchedule = function() {
            var et = moment(moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.endTime + ':00.000Z');
            var st = moment(moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.startTime + ':00.000Z');
            if($scope.schedule.endDate && !moment($scope.schedule.endDate).hours(0).minutes(0).utc().isAfter(moment($scope.schedule.startDate).hours(0).minutes(0).utc(), 'days')) {
                $scope.schedule.endDate = null;
            }
            $scope.minEndDate = moment($scope.schedule.startDate).add(1, 'd');
            $scope.schedule.duration = {
                hours: moment.duration(et.diff(st)).hours() ? moment.duration(et.diff(st)).hours() + ' hours' : '',
                minutes: moment.duration(et.diff(st)).minutes() ? moment.duration(et.diff(st)).minutes() + ' minutes' : ''
            };
            switch ($scope.schedule.repeat) {
                case 'Daily': {
                    $scope.schedule.times = moment($scope.schedule.endDate).diff(moment($scope.schedule.startDate), 'days');
                    break;
                }
                case 'Weekly': {
                    var weekday = $scope.schedule.weekday ? $scope.schedule.weekday : 1;
                    var endDate = moment($scope.schedule.endDate).hours(0);
                    var startDate = moment($scope.schedule.startDate).hours(0);
                    if (startDate.isoWeekday(weekday).isBefore($scope.schedule.startDate, 'days')) {
                        var addStartDate = startDate.add(1, 'w');
                        if (!addStartDate.isAfter($scope.schedule.endDate, 'days')) {
                            $scope.schedule.startDateWeekly = addStartDate.isoWeekday(weekday).format();
                        } else {
                            $scope.schedule.startDateWeekly = null;
                        }
                    } else if (!startDate.isoWeekday(weekday).isAfter($scope.schedule.endDate, 'days')) {
                        $scope.schedule.startDateWeekly = startDate.isoWeekday(weekday).format();
                    } else {
                        $scope.schedule.startDateWeekly = null;
                    }
                    if (endDate.isoWeekday(weekday).isAfter($scope.schedule.endDate, 'days')) {
                        var subEndDate = endDate.subtract(1, 'w');
                        if (!subEndDate.isBefore($scope.schedule.startDate, 'days')) {
                            $scope.schedule.endDateWeekly = subEndDate.isoWeekday(weekday).format();
                        } else {
                            $scope.schedule.endDateWeekly = null;
                        }
                    } else if (!endDate.isoWeekday(weekday).isBefore($scope.schedule.startDate, 'days')) {
                        $scope.schedule.endDateWeekly = endDate.isoWeekday(weekday).format();
                    } else {
                        $scope.schedule.endDateWeekly = null;
                    }
                    if ($scope.schedule.startDateWeekly && $scope.schedule.endDateWeekly) {
                        $scope.schedule.times = moment($scope.schedule.endDateWeekly).diff(moment($scope.schedule.startDateWeekly), 'weeks');
                        $scope.form.$setValidity('times', true);
                    } else {
                        $scope.form.$setValidity('times', false);
                    }
                    break;
                }
            }
        };

        $scope.clearSchedule = function() {
            $scope.showSchedule = false;
            $scope.newEvent = false;
            $scope.schedule = null;
            $scope.form.$setPristine();
        };

        $scope.fetchOccurrences = function() {
            Occurrences.query({parentId: $rootScope.$stateParams.classId}).$promise.then(function (res) {
                groupOccurrences(res);
                $scope.clearSchedule();
            });
        };

        var updateList = function (repeat) {
            var arrGroup = [];
            _.map($scope.schedule, function(c) {
                arrGroup.push({id: c.id});
                return arrGroup;
            });
            Occurrences.deleteList(arrGroup).$promise.then(function () {
                saveList(repeat);
            });
        };

        var saveList = function (repeat) {
            var arr = [];
            var date, step;
            switch (repeat) {
                case 'Daily': {
                    date = $scope.schedule.startDate;
                    step = 'd';
                    break;
                }
                case 'Weekly': {
                    date = $scope.schedule.startDateWeekly;
                    step = 'w';
                    break;
                }
            }
            for (var d = 0; d<= $scope.schedule.times; d++) {
                var obj = {
                    start_date: moment(date).add(d, step).format('YYYY-MM-DD[T]') + $scope.schedule.startTime + ':00.000Z',
                    end_date: moment(date).add(d, step).format('YYYY-MM-DD[T]') + $scope.schedule.endTime + ':00.000Z',
                    parent_event_id: +$rootScope.$stateParams.classId
                };
                arr.push(obj);
            }
            Occurrences.saveList(arr).$promise.then(function () {
                $scope.fetchOccurrences();
            });
            console.log(arr);
        };

        $scope.saveSchedule = function() {
            switch ($scope.schedule.repeat) {
                case 'Single': {
                    var obj = new Occurrences();
                    console.log('single');
                    obj.start_date = moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.startTime + ':00.000Z';
                    obj.end_date = moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.endTime + ':00.000Z';
                    if ($scope.newEvent) {
                        obj.parent_event_id = +$rootScope.$stateParams.classId;
                        obj.$save().then(function () {
                            $scope.fetchOccurrences();
                        });
                    } else {
                        obj.$update({occurrenceId: $scope.schedule.id}).then(function () {
                            $scope.fetchOccurrences();
                        });
                    }
                    console.log(obj);
                    break;
                }
                case 'Daily': {
                    console.log('group daily');
                    console.log($scope.schedule);
                    if (!$scope.newEvent) {
                        updateList('Daily');
                    } else {
                        saveList('Daily');
                    }
                    break;
                }
                case 'Weekly': {
                    console.log('group weekly');
                    console.log($scope.schedule);
                    if (!$scope.newEvent) {
                        updateList('Weekly');
                    } else {
                        saveList('Weekly');
                    }
                    break;
                }
                default:
                    break;
            }
        };

        $scope.editGroup = function(obj) {
            $scope.showSchedule = true;
            if(obj.length === 1) {
                $scope.editSingle(_.first(obj));
            } else {
                $scope.schedule = obj;
                console.log(obj);
            }
            $scope.updateSchedule();
            $scope.setEndTimeList();
        };

        $scope.editSingle = function(c) {
            $scope.showSchedule = true;
            c.startDate = c.start_date;
            c.repeat = 'Single';
            $scope.schedule = c;
            console.log(c);
            $scope.updateSchedule();
            $scope.setEndTimeList();
        };

        $scope.deleteGroup = function(obj) {
            console.log(obj);
            if(obj.length === 1) {
                $scope.deleteSingle(_.first(obj));
            } else {
                var arrGroup = [];
                _.map(obj, function(c) {
                    arrGroup.push({id: c.id});
                    return arrGroup;
                });
                $scope.schedule = arrGroup;
                console.log(arrGroup);
                Occurrences.deleteList(arrGroup).$promise.then(function () {
                    $scope.fetchOccurrences();
                });
            }
        };

        $scope.deleteSingle = function(c) {
            console.log(c);
            var obj = new Occurrences();
            obj.$delete({occurrenceId: c.id}).then(function () {
                $scope.fetchOccurrences();
            });
        };

//        $scope.occurrences = [
//            {
//                id: 169,
//                capacity: null,
//                ref_id: '13523393835',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-05-18T18:00:00.000Z',
//                end_date: '2016-05-18T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 26,
//                capacity: null,
//                ref_id: '13523395841',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-05-25T18:00:00.000Z',
//                end_date: '2016-05-25T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 230,
//                capacity: null,
//                ref_id: '13523397847',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-01T18:00:00.000Z',
//                end_date: '2016-06-01T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 63,
//                capacity: null,
//                ref_id: '13523399853',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-08T17:00:00.000Z',
//                end_date: '2016-06-08T19:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 63,
//                capacity: null,
//                ref_id: '13523399853',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-08T18:00:00.000Z',
//                end_date: '2016-06-08T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 63,
//                capacity: null,
//                ref_id: '13523399853',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-08T18:00:00.000Z',
//                end_date: '2016-06-08T19:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 203,
//                capacity: null,
//                ref_id: '13523401859',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-15T18:00:00.000Z',
//                end_date: '2016-06-15T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 96,
//                capacity: null,
//                ref_id: '13523403865',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-25T18:00:00.000Z',
//                end_date: '2016-06-25T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 228,
//                capacity: null,
//                ref_id: '13523405871',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-26T18:00:00.000Z',
//                end_date: '2016-06-26T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 229,
//                capacity: null,
//                ref_id: '13523405871',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-06-27T18:00:00.000Z',
//                end_date: '2016-06-27T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 230,
//                capacity: null,
//                ref_id: '13523405871',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2014-06-28T18:00:00.000Z',
//                end_date: '2014-06-28T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 230,
//                capacity: null,
//                ref_id: '13523405871',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2014-06-29T18:00:00.000Z',
//                end_date: '2014-06-29T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 145,
//                capacity: null,
//                ref_id: '13523407877',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-07-06T18:00:00.000Z',
//                end_date: '2016-07-06T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 38,
//                capacity: null,
//                ref_id: '13523409883',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-07-13T18:00:00.000Z',
//                end_date: '2016-07-13T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 212,
//                capacity: null,
//                ref_id: '13523411889',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-07-20T18:00:00.000Z',
//                end_date: '2016-07-20T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            },
//            {
//                id: 181,
//                capacity: null,
//                ref_id: '13523415901',
//                ref_provider_id: 'eventbrite',
//                ref_status: 'LIVE',
//                parent_event_id: 7,
//                start_date: '2016-08-03T18:00:00.000Z',
//                end_date: '2016-08-03T20:00:00.000Z',
//                total_tickets: 5,
//                total_tickets_left: 5
//            }
//        ];

        var groupOccurrences = function (occurrences) {
            occurrences = _.sortBy(occurrences, 'start_date');
            _.each(occurrences, function(obj) {
                var startDate = moment(obj.start_date).utc();
                var endDate = moment(obj.end_date).utc();
                obj.startTime = startDate.format('HH:mm');
                obj.endTime = endDate.format('HH:mm');
                obj.duration = moment.duration(endDate.diff(startDate)).asMinutes();
                obj.weekday = startDate.isoWeekday();
                obj.year = startDate.year();
                var str = "" + startDate.dayOfYear();
                var pad = "000";
                obj.day = pad.substring(0, pad.length - str.length) + str
            });
            $scope.groupByTime = _.groupBy(occurrences, 'startTime');
            //console.log($scope.groupByTime);
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
            //console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val) {
                    _.each(val, function (c, j) {
                        val[j] = _.groupBy(c, 'weekly');
                    });
                });
            });
            $scope.groupByWeekly = [];
            //console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj) {
                _.each(obj, function (val) {
                    _.each(val, function (c) {
                        $scope.groupByWeekly = _.extend(_.clone(c), $scope.groupByWeekly);
                    });
                });
            });
            //console.log($scope.groupByWeekly);
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
                obj.day = 'on ' + moment(_.first(obj).start_date).utc().format('dddd');
                obj.weekday = _.first(obj).weekday;
            });
            $scope.groupByAll = _.extend(_.clone($scope.groupByDaily), _.clone($scope.groupByWeekly));
            $scope.groupByAll = _.sortBy($scope.groupByAll, function(value, key) {
                return +key;
            });
            _.map($scope.groupByAll, function (obj) {
                obj.frame = 'Starting ' + moment(_.first(obj).start_date).utc().format('MMMM D YYYY') + (obj.length > 1 ? ' through ' + moment(_.last(obj).start_date).utc().format('MMMM D YYYY') : '');
                obj.startDate = _.first(obj).start_date;
                obj.endDate = _.last(obj).end_date;
                obj.startTime = _.first(obj).startTime;
                obj.endTime = _.last(obj).endTime;
                obj.hide = true;
            });
            //console.log($scope.groupByWeekly);
            //console.log($scope.groupByDaily);
            console.log($scope.groupByAll);
        };

        //groupOccurrences($scope.occurrences);

    });
