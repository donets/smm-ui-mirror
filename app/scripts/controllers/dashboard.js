'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, $rootScope, getClasses, getOccurrences, getStudios, getLocations, getNeigbourhood, $q, $cookieStore, $modal) {
        $q.all([getClasses.$promise, getOccurrences.$promise, getStudios.$promise, getLocations.$promise]).then(function (res) {
            $scope.studios = res[2];
            _.map(res[0], function (obj) {
                var studio = _.findWhere(res[2], {id: obj.studioId});
                var location = _.findWhere(res[3], {id: obj.locationId});
                obj.studio = obj.studioId && studio ? studio.name : '';
                obj.location = obj.locationId && location ? location.neigbourhood : '';
            });
            $scope.locations = _.uniq(_.pluck(res[3], 'neigbourhood'));
            $scope.disciplines = _.uniq(_.pluck(res[0], 'discipline'));
            $scope.styles = _.uniq(_.pluck(res[0], 'style'));
            $scope.events = _.each(res[1], function (event) {
                event.start_date = moment(event.start_date);
                event.end_date = moment(event.end_date);
                event.class = _.findWhere(res[0], {id: event.parent_event_id});
            });
        });
        $scope.weekdays = [];
        $scope.today = moment();
        $scope.changeDay = function (day) {
            $scope.currDay = day;
        };
        $scope.changeDay($scope.today);
        for (var d = 0; d < 7; d++) {
            $scope.weekdays.push(moment().add(d, 'day'));
        }
        $scope.neigbourhood = getNeigbourhood.data;
        $scope.trans = function (value) {
            var pad = '00';
            return value === '24' ? '00:00' : pad.substring(0, pad.length - value.length) + value + ':00';
        };
        $scope.levels = [
            {id: 1, text: 'Anfänger'},
            {id: 2, text: 'Medium'},
            {id: 3, text: 'Fortgeschrittene'}
        ];
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

        $scope.attend = function (event) {
            $modal.open({
                templateUrl: 'views/modalAttend.html',
                controller: ['$scope', '$modalInstance', 'event',

                    function ($scope, $modalInstance, event) {

                        $scope.event = event;

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                resolve: {
                    event: function () {
                        return event;
                    }
                },
                windowClass: 'modal-attend'
            });
        };

        console.log($rootScope.$state.current.name.split('.')[0] === 'home');

        if ($rootScope.$state.current.name.split('.')[0] === 'home') {
            $scope.$parent.showSpinner = false;
        }

        $scope.showPopap = $cookieStore.get('signupPopap');
        
        $scope.hidePopap = function () {
            $scope.showPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
