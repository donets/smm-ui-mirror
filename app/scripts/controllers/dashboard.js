'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, $rootScope, getClasses, getOccurrences, getStudios, getLocations, getNeigbourhood, getCities, $q, RestApi, $cookieStore, $modal, gettextCatalog) {
        $q.all([getClasses.$promise, getOccurrences.$promise, getStudios.$promise, getLocations.$promise, getNeigbourhood.$promise]).then(function (res) {
            $scope.studios = res[2];
            _.map(res[0], function (obj) {
                var studio = _.findWhere(res[2], {id: obj.studioId});
                var location = _.findWhere(res[3], {id: obj.locationId});
                obj.studio = obj.studioId && studio ? studio : '';
                obj.location = obj.locationId && location ? location.neigbourhood : '';
            });
            $scope.disciplines = _.uniq(_.pluck(res[0], 'discipline'));
            $scope.styles = _.uniq(_.pluck(res[0], 'style'));
            $scope.events = _.each(res[1], function (event) {
                event.start_date = moment(event.start_date);
                event.end_date = moment(event.end_date);
                event.class = _.findWhere(res[0], {id: event.parent_event_id});
            });
            $scope.neigbourhood = res[4];
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
        $scope.trans = function (value) {
            var pad = '00';
            return value === '24' ? '00:00' : pad.substring(0, pad.length - value.length) + value + ':00';
        };
        $scope.levels = [
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
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

        $scope.cityChange = function() {
            var selectedCity = _.findWhere($scope.cities, {id: $scope.cityId});
            $rootScope.$state.go('dashboard', {city: $scope.cityId});
            $rootScope.supportPhone = selectedCity.supportPhone;
        };
        getCities.$promise.then(function (res) {
            $scope.cityId = parseInt($rootScope.$stateParams.city);
            $scope.cities = _.sortBy(res, 'id').filter(function (c) {
                return c.countryCode === $rootScope.countryCode;
            });
            if (! _.findWhere($scope.cities, {id: $scope.cityId})) {
                $scope.cityId = $scope.cities[0].id;
            }
            //$scope.cityChange();
        });

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

        $scope.showPopap = $cookieStore.get('signupPopap');
        
        $scope.hidePopap = function () {
            $scope.showPopap = false;
            $cookieStore.remove('signupPopap');
        };
        
    });
