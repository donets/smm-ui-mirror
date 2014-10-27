'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Main', [])
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', '$interval', 'DSCacheFactory', 'Events', 'getEvents',
        function ($scope, $rootScope, $window, $location, $interval, DSCacheFactory, Events, getEvents) {
        var defaultCache = DSCacheFactory.get('defaultCache');
        $scope.loading = true;
        $scope.changeSchedule = function (value) {
            $scope.schedule = value;
            $window.ga('send', 'pageview', '/?schedule=' + value);
        };
        $scope.showSpinner = function (event) {
            event.eventLoad = true;
        };
        $rootScope.$on('$includeContentLoaded', function() {
            $scope.contentLoaded = true;
        });
        function initEvents() {
            $scope.loading = false;
            $scope.schedule = $location.search().schedule;
            _.each($scope.events.occurrences, function (event) {

                var now = moment(); // jshint ignore:line
                var date = moment(event.start_date) || 0; // jshint ignore:line

                if(now > date) {
                    event.schedule = 'past';
                } else if (date.calendar().split(' ')[0] === 'Heute') {
                    event.schedule = 'today';
                } else if (date.calendar().split(' ')[0] === 'Morgen') {
                    event.schedule = 'tomorrow';
                } else {
                    event.schedule = 'later';
                }

                event.minPrice = _.min(event.tickets, function (ticket) {
                    return ticket.ticket.display_price; // jshint ignore:line
                });

                //var availableSpots = _.reduce(event.event.tickets, function (memo, ticket) {
                //    memo = _.isObject(memo) ? memo.ticket.quantity_available : memo; // jshint ignore:line
                //    return memo + ticket.ticket.quantity_available; // jshint ignore:line
                //});
                //event.event.availableSpots = _.isObject(availableSpots) ? availableSpots.ticket.quantity_available : availableSpots; // jshint ignore:line

                //var soldSpots = _.reduce(event.event.tickets, function (memo, ticket) {
                //    memo = _.isObject(memo) ? memo.ticket.quantity_sold : memo; // jshint ignore:line
                //    return memo + ticket.ticket.quantity_sold; // jshint ignore:line
                //});
                //event.event.availableSpots = _.isObject(soldSpots) ? event.event.somuchmore.totalSpots - soldSpots.ticket.quantity_sold : event.event.somuchmore.totalSpots - soldSpots; // jshint ignore:line

            });
        }
        getEvents.$promise.then(function () {
            $scope.events = getEvents;
            initEvents();
            console.log($scope.events);
        });
        defaultCache.setOptions({
            onExpire: function (key) {
                console.log(key);
                if (key === '/api/events') {
                    return Events.query().$promise.then(function (res) {
                        $scope.events = res;
                        initEvents();
                        console.log($scope.events);
                    });
                }
            }
        });

    }]);
