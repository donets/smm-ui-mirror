'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Confirmation', [])
    .controller('ConfirmationCtrl', ['$scope', '$rootScope', '$location', '$window', '$q', 'Events', function ($scope, $rootScope, $location, $window, $q, Events) {

        $scope.params = $location.search();

        if($scope.params.eid) {
            Events.get({eventId: $scope.params.eid}).$promise.then(function (res) {
                $scope.alert = true;
                $scope.event = res;
                /* jshint ignore:start */
                Events.getOrder({eventId: $scope.params.eid, order_id: $scope.params.oid}).$promise.then(function (res) {
                    var qG = $q.defer();
                    var qF = $q.defer();
                    $window.ga('require', 'ecommerce', 'ecommerce.js');
                    $window.ga('ecommerce:addTransaction', {
                        'id': $scope.params.oid,
                        'affiliation': $scope.event.event.somuchmore.teacherId,
                        'revenue': res.summary.total_amount_paid
                    });
                    $window.ga('ecommerce:send');
                    $.getScript("//www.googleadservices.com/pagead/conversion_async.js").done( function() {
                        $window.google_trackConversion({
                            google_conversion_id: 970072239,
                            google_conversion_language: "de",
                            google_conversion_format: "3",
                            google_conversion_color: "ffffff",
                            google_conversion_label: 'h7xyCNGh_wkQr8HIzgM',
                            google_conversion_value: res.summary.total_amount_paid,
                            google_remarketing_only: false
                        });
                        $window.google_trackConversion({
                            google_conversion_id: 968958845,
                            google_conversion_language: "de",
                            google_conversion_format: "3",
                            google_conversion_color: "ffffff",
                            google_conversion_label: 'HAEVCOvehgsQ_caEzgM',
                            google_conversion_value: res.summary.total_amount_paid,
                            google_remarketing_only: false
                        });
                        qG.resolve();
                    });
                    $.getScript("//connect.facebook.net/en_US/fbds.js").done( function() {
                        $window._fbq = $window._fbq || [];
                        $window._fbq.push(['track', '6019562586725', {'value': res.summary.total_amount_paid,'currency': 'EUR'}]);
                        qF.resolve();
                    });
                    $q.all([qG.promise,qF.promise]).then(function () {
                        _.each($scope.params, function(key, value) {
                            $location.search(value, null);
                        });
                    });
                });
                /* jshint ignore:end */
            });
        }

        $scope.close = function () {
            $scope.alert = false;
            $rootScope.autoscroll = true;
        };

    }]);
