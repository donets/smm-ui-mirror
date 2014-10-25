'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Event', ['google-maps'.ns()])
    .controller('EventCtrl', ['$scope', '$rootScope', 'getEvent', 'Suppliers', '$window', '$location', 'GoogleMapApi'.ns(), 'ezfb', function ($scope, $rootScope, getEvent, Suppliers, $window, $location, GoogleMapApi, ezfb) {
        $scope.event = getEvent;
        $scope.coverMain = $rootScope.windowWidth > 1080 ? '/images/main-2880.jpg' : '/images/main-1080.jpg';

        // cut string
        var cutVal = $rootScope.windowWidth > 1080 ? 600 : 250;
        $scope.cutVal = cutVal;
        $scope.uncut = function () {
            $scope.cutVal = 0;
        };
        $scope.cut = function () {
            $scope.cutVal = cutVal;
        };

        // map init

        GoogleMapApi.then(function(maps) {

            $scope.map = {
                center: {
                    latitude: getEvent.event.venue.latitude,
                    longitude: getEvent.event.venue.longitude
                },
                zoom: 16,
                options: {
                    mapTypeControl: false,
                    overviewMapControl: false,
                    panControl: false,
                    zoomControl : true,
                    streetViewControl : false
                }
            };

            $scope.marker = {
                id: getEvent.event.id,
                coords: {
                    latitude: getEvent.event.venue.latitude,
                    longitude: getEvent.event.venue.longitude
                },
                options: {
                    icon: {
                        path: $rootScope.windowWidth > 1080 ? 'M19.355,13.496l-7.109,15.117C11.836,29.473,10.938,30,10,30s-1.836-0.527-2.227-1.387L0.645,13.496 C0.137,12.422,0,11.191,0,10C0,4.473,4.473,0,10,0s10,4.473,10,10C20,11.191,19.863,12.422,19.355,13.496z M10,5 c-2.754,0-5,2.246-5,5s2.246,5,5,5s5-2.246,5-5S12.754,5,10,5z' : 'M28.389,19.794L17.961,41.966C17.359,43.227,16.042,44,14.667,44s-2.692-0.773-3.266-2.034L0.945,19.794 C0.201,18.219,0,16.414,0,14.667C0,6.56,6.56,0,14.667,0s14.667,6.56,14.667,14.667C29.334,16.414,29.133,18.219,28.389,19.794z M14.667,7.333c-4.039,0-7.333,3.294-7.333,7.334c0,4.039,3.294,7.333,7.333,7.333S22,18.706,22,14.667 C22,10.627,18.706,7.333,14.667,7.333z',
                        fillColor: '#f2836b',
                        anchor: $rootScope.windowWidth > 1080 ? new maps.Point(10, 30) : new maps.Point(15, 44),
                        fillOpacity: 1,
                        scale: 1,
                        strokeWeight: 0
                    }
                }
            };

        });

        getEvent.$promise.then(function () {
            getEvent.eventLoad = false;
            $('html head title').text(getEvent.event.title);
            var start = moment(getEvent.event.start_date); // jshint ignore:line
            var end = moment(getEvent.event.end_date); // jshint ignore:line
            moment.relativeTimeThreshold('m', 1000); // jshint ignore:line
            $scope.duration = moment.duration(end.diff(start)).asMinutes(); // jshint ignore:line
            $scope.date = start;
            $scope.minPrice = _.min(getEvent.event.tickets, function (ticket) {
                return ticket.ticket.display_price; // jshint ignore:line
            });
            Suppliers.get({supplierId: getEvent.event.somuchmore.teacherId}).$promise.then(function (res) {
                console.log(res);
                $scope.teacher = res;
            });
            //var availableSpots = _.reduce(getEvent.event.tickets, function (memo, ticket) {
            //    memo = _.isObject(memo) ? memo.ticket.quantity_available : memo; // jshint ignore:line
            //    return memo + ticket.ticket.quantity_available; // jshint ignore:line
            //});
            //$scope.availableSpots = _.isObject(availableSpots) ? availableSpots.ticket.quantity_available : availableSpots; // jshint ignore:line

            //var soldSpots = _.reduce(getEvent.event.tickets, function (memo, ticket) {
            //    memo = _.isObject(memo) ? memo.ticket.quantity_sold : memo; // jshint ignore:line
            //    return memo + ticket.ticket.quantity_sold; // jshint ignore:line
            //});
            //$scope.availableSpots = _.isObject(soldSpots) ? getEvent.event.somuchmore.totalSpots - soldSpots.ticket.quantity_sold : getEvent.event.somuchmore.totalSpots - soldSpots; // jshint ignore:line

        });

        $scope.share = function () {

            console.log($location.absUrl());

            var callback = function(response) {
                if (response && !response.error_code) // jshint ignore:line
                {
                    console.log('Posting completed');
                }
                else {
                    console.log('Error while posting');
                }
            };

            ezfb.ui(
                {
                    method: 'feed',
                    name: getEvent.event.title,
                    picture: getEvent.event.logo,
                    link: $location.absUrl(),
                    description: getEvent.event.somuchmore.description
                },
                callback
            );
        };

        $scope.contactTeacher = function () {
            $window.ga('set', 'dimension2', '1');
        };

        $scope.bookEvent = function () {
            $.getScript('//connect.facebook.net/en_US/fbds.js').done( function() {
                $window._fbq = $window._fbq || [];
                $window._fbq.push(['track', '6019562580325']);
            });
        };

        $scope.bookAnotherEvent = function () {
            $.getScript('//connect.facebook.net/en_US/fbds.js').done( function() {
                $window._fbq = $window._fbq || [];
                $window._fbq.push(['track', '6019562584725']);
            });
        };

        console.log($scope.event);

    }]);
