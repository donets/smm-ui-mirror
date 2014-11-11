'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassCtrl
 * @description
 * # ClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Class', [])
    .controller('ClassCtrl', function ($scope, Events) {
        Events.query().$promise.then(function (res) {
            $scope.classes = res.occurrences;
            _.each($scope.classes, function(obj) {
                var startDate = moment(obj.start_date);
                var endDate = moment(obj.end_date);
                //moment.relativeTimeThreshold('m', 1000);
                obj.startTime = startDate.format('HH:mm');
                obj.endTime = endDate.format('HH:mm');
                obj.duration = moment.duration(endDate.diff(startDate)).asMinutes();
                obj.day = startDate.isoWeekday();
            });
            $scope.classes = _.sortBy($scope.classes, 'start_date');
            $scope.groupByTime = _.groupBy($scope.classes, 'startTime');
            $scope.groupByDuration = [];
            console.log($scope.groupByTime);
            _.each($scope.groupByTime, function (obj, key) {
                console.log(key);
                $scope.groupByDuration.push(_.groupBy(obj, 'duration'));
            });
            console.log($scope.groupByDuration);
        });

    });
