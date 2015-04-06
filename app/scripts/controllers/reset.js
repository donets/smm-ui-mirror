'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reset', [])
    .controller('ResetCtrl', [ '$scope', '$rootScope', '$http', '$window', 'gettextCatalog', '$cookieStore', function ($scope, $rootScope, $http, $window, gettextCatalog, $cookieStore) {
        $scope.resetPassword = function () {
            $scope.loadingReset = true;
            $scope.errorReset = false;
            $http.post($window.smmConfig.restUrlBase + '/api/auth/changePasswordWithTokenAndLogin', { token: $rootScope.$stateParams.token, newPassword: this.passwordReset }).success(function (response) {
                console.log(response);
                $scope.loadingReset = false;
                $rootScope.userName = response.user.name;
                $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                $cookieStore.put('session', response.user);
                if ($rootScope.requestedState) {
                    $rootScope.$state.go($rootScope.requestedState.state.name, $rootScope.requestedState.params);
                } else if ($rootScope.roleMember) {
                    $rootScope.$state.go('dashboard', {
                        notify: false
                    });
                }
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
