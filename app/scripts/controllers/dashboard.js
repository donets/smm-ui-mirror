'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, getClasses, getOccurrences, getStudios, getNeigbourhood, $q) {
        $q.all([getClasses.$promise, getOccurrences.$promise, getStudios.$promise]).then(function (res) {
            $scope.studios = res[2];
            _.map(res[0], function (obj) {
                obj.studio = obj.studioId ? _.findWhere(res[2], {id: obj.studioId}).name : '';
            });
            $scope.events = _.each(res[1], function (event) {
                event.class = _.findWhere(res[0], {id: event.parent_event_id});
            });
        });
        $scope.showPopap = moment().isBefore('2015-01-01', 'year');
        $scope.neigbourhood = getNeigbourhood.data;
        $scope.changeSlide = function () {
            console.log($scope.start);
            console.log($scope.end);
        };
        $scope.trans = function (value) {
            var pad = '00';
            return value === '24' ? '00:00' : pad.substring(0, pad.length - value.length) + value + ':00';
        };
        $scope.clearFilters = function () {
            $scope.search = {
                start: 6,
                end: 24,
                class: {
                    title: '',
                    teacherName: ''
                }
            };
        };
        $scope.clearFilters();
    });
