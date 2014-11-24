'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reset', [])
    .controller('ResetCtrl', [ '$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {
        $scope.resetPassword = function () {
            $scope.loadingReset = true;
            $scope.errorReset = false;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/changePasswordWithTokenAndLogin?token=' + $rootScope.$stateParams.token + '&newPassword=' + this.passwordReset).success(function (response) {
                console.log(response);
                $scope.loadingReset = false;
                $rootScope.$state.transitionTo('get');
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.loadingReset = false;
                $scope.errorReset = true;
                switch (response.type) {
                    case 'PasswordTooWeak':
                        $scope.errorMessage = 'Das Passwort ist zu schwach, muss mindestens 8 Zeichen sein, mit Ziffern, Groß und Kleinbuchstaben';
                        break;
                    case 'TokenExpired':
                        $scope.errorMessage = 'Der Link ist nicht mehr gültig';
                        break;
                    case 'InvalidToken':
                        $scope.errorMessage = 'Der Link ist nicht gültig';
                        break;
                    default :
                        $scope.errorMessage = response.type;
                        break;
                }
            });
        };
    }]);
