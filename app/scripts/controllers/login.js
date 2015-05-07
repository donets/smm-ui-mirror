'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Login', [])
	.controller('LoginCtrl', function($rootScope, $scope, $http, ezfb, $cookieStore, $window, $analytics) {

		function sendLoginFB(res) {
			$http.get($window.smmConfig.restUrlBase + '/api/auth/login/facebook?accessToken=' + res.authResponse.accessToken).success(function(response) {
				console.log(response);
				$rootScope.userName = response.user.name;
			}).error(function(response, status) {
				console.error(response);
				console.error(status);
			});
		}

		function updateLoginStatus(more) {
			ezfb.getLoginStatus(function(res) {
				$scope.loginStatus = res;
				if (res.authResponse) {
					sendLoginFB(res);
				}
				(more || angular.noop)();
			});
		}

		$scope.loginFB = function() {

			ezfb.login(function(res) {

				if (res.authResponse) {
					updateLoginStatus($rootScope.$state.go('profile.membership'));
				}

			}, {
				scope: 'email,user_likes'
			});

		};

		$scope.logout = function() {

			$http.get($window.smmConfig.restUrlBase + '/api/auth/logout').success(function(response) {
				console.log(response);
				$rootScope.userName = null;
				$rootScope.roleMember = null;
				$rootScope.roleAdmin = null;
				$cookieStore.remove('session');
				$rootScope.requestedState = null;
				$rootScope.$state.go('home');
			}).error(function(response, status) {
				console.error(response);
				console.error(status);
			});

		};

		$scope.forgotView = false;

		$scope.toggleForgot = function() {
			$scope.forgotView = !$scope.forgotView;
		};

		$scope.login = function() {
			$scope.loadingLogin = true;
			$scope.errorLogin = false;
			$rootScope.handledError = true;
			$http.post($window.smmConfig.restUrlBase + '/api/auth/login/password', { email:this.emailLogin, password:this.passwordLogin }).success(function(response) {
				console.log(response);
				$scope.loadingLogin = false;
				$rootScope.handledError = false;
				$rootScope.userName = response.user.name;
				$rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
				$rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
				$cookieStore.put('session', response.user);
                $analytics.eventTrack({
                    'event': 'loginSuccess',
                    'loginMethod': 'Website',
                    'customerId': response.user.id
                });
				if ($rootScope.requestedState) {
					$rootScope.$state.go($rootScope.requestedState.state.name, $rootScope.requestedState.params);
				} else if ($rootScope.roleMember) {
					$rootScope.$state.go('dashboard', {
						notify: false,
                        city: $rootScope.currentCity.id
					});
				}
			}).error(function(response, status) {
				console.error(response);
				console.error(status);
				$scope.loadingLogin = false;
				$scope.errorLogin = response.type === 'WrongUsernameOrPassword';
				$rootScope.handledError = false;
			});
		};

		$scope.forgot = function() {
			$scope.loadingForgot = true;
			$scope.successSubscribe = false;
			$scope.errorForgot = false;
			$rootScope.handledError = true;
			$http.get($window.smmConfig.restUrlBase + '/api/auth/requestPwdReset?email=' + encodeURIComponent(this.emailForgot), {
				cache: false
			}).success(function(response) {
				console.log(response);
				$rootScope.handledError = false;
				$scope.loadingForgot = false;
				$scope.successSubscribe = true;
			}).error(function(response, status) {
				console.error(response);
				console.error(status);
				$rootScope.handledError = false;
				$scope.loadingForgot = false;
				$scope.errorForgot = true;
			});
		};

	});
