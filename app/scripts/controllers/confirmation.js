'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Confirmation', [])
    .controller('ConfirmationCtrl', ['$scope', '$rootScope', '$location', '$window', '$q', 'Occurrences', function ($scope, $rootScope, $location, $window, $q, Occurrences) {

        $scope.params = $location.search();

        if($scope.params.eid) {
            Occurrences.get({occurrenceId: $scope.params.eid}).$promise.then(function (res) {
                $scope.alert = true;
                $scope.event = res;
                Occurrences.getOrder({occurrenceId: $scope.params.eid, order_id: $scope.params.oid}).$promise.then(function (res) {
                    $window.ga('require', 'ecommerce', 'ecommerce.js');
                    $window.ga('ecommerce:addTransaction', {
                        'id': $scope.params.oid,
                        'affiliation': $scope.event.event.somuchmore.teacherId,
                        'revenue': res.summary.total_amount_paid
                    });
                    $window.ga('ecommerce:send');
                    _.each($scope.params, function(key, value) {
                        $location.search(value, null);
                    });
                });
            });
        }

        $scope.close = function () {
            $scope.alert = false;
            $rootScope.autoscroll = true;
        };

    }]);
