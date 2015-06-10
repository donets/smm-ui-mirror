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
    .controller('ClassCtrl', function ($scope, $rootScope, $document, getClass, getOccurrences, getLocations, getStudios, $http, $q, $window, RestApi, gettextCatalog) {
        $scope.moment = moment();
        $scope._ = _;
        $scope.form = {};

        var getDisciplinesList = function () {
            $q.all([$http.get($window.smmConfig.restUrlBase + '/api/v2/rest/disciplineLangs?langId=' + ($rootScope.langId || 1)),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplineLangs?langId=' + ($rootScope.langId || 1)),
                $http.get($window.smmConfig.restUrlBase + '/api/v2/rest/subDisciplines')]).then(function (res) {
                _.map(res[2].data, function (obj) {
                    var discipline = _.findWhere(res[0].data, {disciplineId: obj.disciplineId});
                    var subDiscipline = _.findWhere(res[1].data, {subDisciplineId: obj.id});
                    obj.disciplineName = discipline ? discipline.name : 'none';
                    obj.subDisciplineName = subDiscipline ? subDiscipline.name : 'none';
                    return obj.displayName = obj.id + '.' + obj.disciplineName + '-' + obj.subDisciplineName;
                });
                $scope.disciplinesList = res[2].data;
            });
        };

        $scope.setDisciplineId = function (id) {
            var discipline = _.findWhere($scope.disciplinesList, {id: id});
            $scope.class.disciplineId = discipline ? discipline.disciplineId : null;
        };

        getClass.$promise.then(function () {
            $scope.class = getClass;
            getDisciplinesList();
        });

        getLocations.$promise.then(function () {
            $scope.locations = getLocations;
        });
        getStudios.$promise.then(function () {
            $scope.studios = getStudios;
        });
        getOccurrences.$promise.then(function () {
            $scope.occurrences = getOccurrences;
            groupOccurrences(getOccurrences);
        });

        $scope.save = function (status) {
            $scope.showSpinner = true;
            $scope.class.status = status;
            $scope.class.$update({route: 'events'}).then(function (res) {
                console.log(res);
                $scope.showSpinner = false;
            });
        };
        $scope.remove = function () {
            $scope.class.$delete({route: 'events'}).then(function (res) {
                console.log(res);
                $rootScope.$state.go('admin.classes.list');
            });
        };

        $scope.toggleGroup = function(obj) {
            obj.hide = !obj.hide;
        };

        $scope.showSchedule = false;

        $scope.startTimeList = [];

        $scope.endTimeList = [];

        $scope.weekdayList = [];

        $scope.repeatList = [
            'Daily',
            'Weekly',
            'Single'
        ];

        $scope.levels = [
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
        ];

        setWeekdayList($scope.weekdayList);

        $scope.checkDate = function(date) {

            var currentDate = moment($scope.schedule[date]);

            $scope.schedule[date] = currentDate.format();

            if(date === 'startDate' && currentDate.isSame(moment(), 'days') && moment().hours() > 5) {
                $scope.setStartTimeList(moment().format('HH:mm'), 23);
            } else {
                $scope.setStartTimeList(false, 23);
            }

        };

        $scope.setStartTimeList = function(start, end) {
            setTimeList($scope.startTimeList, start, end);
        };

        $scope.setEndTimeList = function() {
            setTimeList($scope.endTimeList, $scope.schedule.startTime);
        };

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

        $scope.showScheduleFunc = function () {
            $scope.showSchedule = true;
            $scope.setStartTimeList(false, 23);
            $document.scrollToElement($('#datesSchedule'), 80);
        };

        $scope.addDates = function() {
            $scope.showScheduleFunc();
            $scope.newEvent = true;
            $scope.schedule = {};
        };

        $scope.updateSchedule = function() {
            var et = moment(moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.endTime + ':00.000Z');
            var st = moment(moment($scope.schedule.startDate).format('YYYY-MM-DD[T]') + $scope.schedule.startTime + ':00.000Z');
            if($scope.schedule.endDate && !moment($scope.schedule.endDate).hours(0).minutes(0).isAfter(moment($scope.schedule.startDate).hours(0).minutes(0), 'days')) {
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
                        $scope.form.schedule.$setValidity('times', true);
                    } else {
                        $scope.form.schedule.$setValidity('times', false);
                    }
                    break;
                }
            }
        };

        $scope.clearSchedule = function() {
            $scope.showSchedule = false;
            $scope.newEvent = false;
            $scope.showSpinner = false;
            $scope.schedule = null;
            $scope.form.schedule.$setPristine();
        };

        $scope.fetchOccurrences = function() {
            RestApi.query({route: 'occurrences', parentId: $rootScope.$stateParams.classId}).$promise.then(function (res) {
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
            RestApi.deleteList({route: 'occurrences'}, arrGroup).$promise.then(function () {
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
                    date: moment(date).local().add(d, step).format('YYYY-MM-DD'),
                    startTime: $scope.schedule.startTime,
                    endTime: $scope.schedule.endTime,
                    parent_event_id: +$rootScope.$stateParams.classId
                };
                arr.push(obj);
            }
            RestApi.saveList({route: 'occurrences'}, arr).$promise.then(function () {
                $scope.fetchOccurrences();
            });
        };

        $scope.saveSchedule = function() {
            $scope.showSpinner = true;
            switch ($scope.schedule.repeat) {
                case 'Single': {
                    var obj = new RestApi();
                    obj.date = moment($scope.schedule.startDate).local().format('YYYY-MM-DD');
                    obj.startTime = $scope.schedule.startTime;
                    obj.endTime = $scope.schedule.endTime;
                    if ($scope.newEvent) {
                        obj.parent_event_id = +$rootScope.$stateParams.classId;
                        obj.$save({route: 'occurrences'}).then(function () {
                            $scope.fetchOccurrences();
                        });
                    } else {
                        obj.$update({route: 'occurrences', id: $scope.schedule.id}).then(function () {
                            $scope.fetchOccurrences();
                        });
                    }
                    break;
                }
                case 'Daily': {
                    if (!$scope.newEvent) {
                        updateList('Daily');
                    } else {
                        saveList('Daily');
                    }
                    break;
                }
                case 'Weekly': {
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
            $scope.showScheduleFunc();
            if(obj.length === 1) {
                $scope.editSingle(_.first(obj));
            } else {
                $scope.schedule = obj;
            }
            $scope.updateSchedule();
            $scope.setEndTimeList();
        };

        $scope.editSingle = function(c) {
            $scope.showScheduleFunc();
            c.startDate = c.startDate.format();
            c.repeat = 'Single';
            $scope.schedule = c;
            $scope.updateSchedule();
            $scope.setEndTimeList();
        };

        $scope.deleteGroup = function(obj) {
            if(obj.length === 1) {
                $scope.deleteSingle(_.first(obj));
            } else {
                var arrGroup = [];
                _.map(obj, function(c) {
                    arrGroup.push({id: c.id});
                    return arrGroup;
                });
                $scope.schedule = arrGroup;
                RestApi.deleteList({route: 'occurrences'}, arrGroup).$promise.then(function () {
                    $scope.fetchOccurrences();
                });
            }
        };

        $scope.deleteSingle = function(c) {
            var obj = new RestApi();
            obj.$delete({route: 'occurrences', id: c.id}).then(function () {
                $scope.fetchOccurrences();
            });
        };

        var groupOccurrences = function (occurrences) {
            occurrences = _.sortBy(occurrences, 'start_date');
            _.each(occurrences, function(obj) {
                var startDate = moment(obj.start_date);
                var endDate = moment(obj.end_date);
                obj.startDate = startDate;
                obj.endDate = endDate;
                obj.startTime = startDate.format('HH:mm');
                obj.endTime = endDate.format('HH:mm');
                obj.duration = moment.duration(endDate.diff(startDate)).asMinutes();
                obj.weekday = startDate.isoWeekday();
                obj.year = startDate.year();
                var str = '' + startDate.dayOfYear();
                var pad = '000';
                obj.day = pad.substring(0, pad.length - str.length) + str;
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
                        var curr = moment(c.startDate);
                        if (memo && curr.isSame(moment(memo.startDate).add(1, 'w'))) {
                            c.weekly = memo.weekly;
                            c.daily = c.year + '' + c.day + '' + st.replace(':','') + '' + et.replace(':','') + j;
                        } else if (memo && curr.isSame(moment(memo.startDate).add(1, 'd'))) {
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
                obj.day = 'on ' + moment(_.first(obj).startDate).format('dddd');
                obj.weekday = _.first(obj).weekday;
            });
            $scope.groupByAll = _.extend(_.clone($scope.groupByDaily), _.clone($scope.groupByWeekly));
            $scope.groupByAll = _.sortBy($scope.groupByAll, function(value, key) {
                return +key;
            });
            _.map($scope.groupByAll, function (obj) {
                obj.frame = 'Starting ' + moment(_.first(obj).startDate).format('MMMM D YYYY HH:mm') + (obj.length > 1 ? ' through ' + moment(_.last(obj).startDate).format('MMMM D YYYY') : '');
                obj.startDate = _.first(obj).startDate.format();
                obj.endDate = _.last(obj).endDate.format();
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
