'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reset', [])
    .controller('ResetCtrl', [ '$scope', '$rootScope', '$http', '$window', 'gettextCatalog', function ($scope, $rootScope, $http, $window, gettextCatalog) {
        $scope.resetPassword = function () {
            $scope.loadingReset = true;
            $scope.errorReset = false;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/changePasswordWithTokenAndLogin?token=' + $rootScope.$stateParams.token + '&newPassword=' + encodeURIComponent(this.passwordReset)).success(function (response) {
                console.log(response);
                $scope.loadingReset = false;
                $rootScope.$state.transitionTo('home');
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.loadingReset = false;
                $scope.errorReset = true;
                switch (response.type) {
                    case 'PasswordTooWeak':
                        $scope.errorMessage = gettextCatalog.getString('Your password is too weak; it must contain at least 8 characters, including numbers and lower and uppercase letters');
                        break;
                    case 'TokenExpired':
                        $scope.errorMessage = gettextCatalog.getString('The link is no longer valid');
                        break;
                    case 'InvalidToken':
                        $scope.errorMessage = gettextCatalog.getString('The link is invalid');
                        break;
                    default :
                        $scope.errorMessage = response.type;
                        break;
                }
            });
        };
    }]);
