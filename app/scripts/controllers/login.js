'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Login', [])
	.controller('LoginCtrl', ['$rootScope', '$scope', '$http', 'ezfb', 'User', '$cookieStore', '$window', 'CityFactory', '$timeout', 'gettextCatalog', 'amMoment', function($rootScope, $scope, $http, ezfb, User, $cookieStore, $window, CityFactory, $timeout, gettextCatalog, amMoment) {
		$scope.init = function() {
			$scope.data = {};
			$scope.data.currentCity = [];
			$scope.CityFactory = CityFactory.CityFactory;

			$scope.$on('CityFactory.update', function(newState) {
				var currentCityVar = CityFactory.getVariable();
				$scope.data.currentCity = _.findWhere($scope.citiesList, {id: currentCityVar.id});
			});

			$scope.update = CityFactory.update;

            $scope.changeLanguage = function(city) {
                $rootScope.lang = city;
                $cookieStore.put('globalLang', $rootScope.lang);
                gettextCatalog.setCurrentLanguage($rootScope.lang);
                amMoment.changeLocale($rootScope.lang);
            }

			CityFactory.getCities().then(function(res) {
				$scope.citiesList = _.sortBy(res, 'id').filter(function(c) {
					return c.countryCode === $rootScope.countryCode;
				});
				CityFactory.guessCity($scope.citiesList).then(function(res) {
					$scope.city = res.city;
					$scope.cityId = res.cityId;
					$scope.changeCity(res.currentCity.id);
				});
			});
		};

		$scope.init();



		$scope.changeCity = function(currentCityId) {
            var currentCity = _.findWhere($scope.citiesList, {id: currentCityId});
            CityFactory.update(currentCity, $scope.citiesList);
            CityFactory.changeCity(currentCity, $scope.citiesList).then(function(res) {
                $scope.studios = res.studios;
                $scope.cards = res.cards;
            });
        };

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

		/*var checkUser = function () {
		    User.get().$promise.then(function (response) {
		        console.log(response);
		        if (response.currentUser) {
		            $rootScope.userName = response.currentUser.name;
		            $rootScope.roleMember = _.include(response.currentUser.roles, 'member') ? true : false;
		            $rootScope.roleAdmin = _.include(response.currentUser.roles, 'admin') ? true : false;
		        } else {
		            $rootScope.userName = null;
		            $rootScope.roleMember = null;
		            $rootScope.roleAdmin = null;
		        }
		    });
		};*/

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
			$http.get($window.smmConfig.restUrlBase + '/api/auth/login/password?email=' + encodeURIComponent(this.emailLogin) + '&password=' + encodeURIComponent(this.passwordLogin), {
				cache: false
			}).success(function(response) {
				console.log(response);
				$scope.loadingLogin = false;
				$rootScope.handledError = false;
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

	}]);
