'use strict';

/**
 * @ngdoc overview
 * @name boltApp
 * @description
 * # boltApp
 *
 * Main module of the application.
 */
angular.module('boltApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'gettext',
        'angularSpinner',
        'duScroll',
        'ui-rangeSlider',
        'localytics.directives',
        'validation.match',
        'ezfb',
        'flow',
        'ngOptionsDisabled',
        'xeditable',
        'ngWebSocket',
        'infinite-scroll',
        'angulartics',
        'angulartics.google.customtagmanager',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.buffering',
        'com.2fdevs.videogular.plugins.poster',
        'boltApp.controllers.Homepage',
        'boltApp.controllers.Studio',
        'boltApp.controllers.Subscribe',
        'boltApp.controllers.Classes',
        'boltApp.controllers.Class',
        'boltApp.controllers.CreateClass',
        'boltApp.controllers.Dashboard',
        'boltApp.controllers.Studios',
        'boltApp.controllers.Reset',
        'boltApp.controllers.About',
        'boltApp.controllers.Login',
        'boltApp.controllers.Admin',
        'boltApp.controllers.Signup',
        'boltApp.controllers.Profile',
        'boltApp.controllers.Reservations',
        'boltApp.controllers.Classfilters',
        'boltApp.controllers.Booking',
        'boltApp.services.restApi',
        'boltApp.services.detectCity',
        'boltApp.services.countryConfig',
        'boltApp.services.membership',
        'boltApp.services.navigator',
        'boltApp.services.city',
        'boltApp.services.mapStudios',
        'boltApp.services.websocket'
    ]);
angular.module('boltApp')
	.run(['$rootScope', '$state', '$stateParams', '$window', '$http', 'RestApi', '$q', '$cookieStore', 'CountryConfig', 'DetectCity',
		function($rootScope, $state, $stateParams, $window, $http, RestApi, $q, $cookieStore, CountryConfig, DetectCity) {
			// It's very handy to add references to $state and $stateParams to the $rootScope
			// so that you can access them from any scope within your applications.For example,
			// <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
			// to active whenever 'contacts.list' or one of its decendents is active.
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.autoscroll = false;
			$rootScope.pageReload = function() {
				$window.location.reload();
			};
			$rootScope.$on('$viewContentLoading', function() {
				$window.rendering = true;
			});
			$rootScope.$on('$viewContentLoaded', function() {
				var prerenderReady = function() {
					$window.prerenderReady = true;
					$rootScope.prerenderReady = true;
					$('.pre').addClass('hide_loader');
				};
				if ($window.rendering) {
                    if ($rootScope.configLoaded) {
                        $rootScope.$broadcast('configLoaded');
                        prerenderReady();
                    } else {
                        var detectedCity = DetectCity.getCityFromParams();
                        CountryConfig.guessCity().$promise.then(function (res) {
                            $rootScope.configLoaded = true;
                            $rootScope.configCountry = res.country;
                            $rootScope.configCities = res.cities;
                            if (detectedCity) {
                                $rootScope.currentCity = _.find($rootScope.configCities, function (city) {
                                    return city[detectedCity.field] === detectedCity.value;
                                });
                            } else {
                                $rootScope.currentCity = res.guessedCity;
                            }
                            $rootScope.langId = $rootScope.currentCity.langId;
                            $rootScope.countryCode = $rootScope.currentCity.countryCode;
                            $rootScope.supportPhone = $rootScope.currentCity.supportPhone;
                            $rootScope.supportEmail = $rootScope.currentCity.supportEmail;
                            $rootScope.$broadcast('changeLang', $rootScope.currentCity.languageCode);
                            $rootScope.$broadcast('configLoaded');
                            prerenderReady();
                        }, function () {
                            $rootScope.domain = _.last($window.location.hostname.split('.')).toUpperCase();
                            var domains = [
                                {
                                    domain: 'DE',
                                    countryCode: 'DE'
                                },
                                {
                                    domain: 'UK',
                                    countryCode: 'UK'
                                },
                                {
                                    domain: 'COM',
                                    countryCode: 'DE'
                                }
                            ];
                            $rootScope.domainProperties = _.findWhere(domains, {
                                domain: $rootScope.domain
                            });
                            $rootScope.countryCode = $rootScope.domainProperties ? $rootScope.domainProperties.countryCode : 'DE';
                            console.log('country = ' + $rootScope.countryCode);
                            prerenderReady();
                        });
                    }
				}
			});
			var checkRule = function(event, toState, toParams, redirectState) {
				if (toState.name.split('.')[0] === 'profile' && !$rootScope.roleMember || toState.name.split('.')[0] === 'admin' && !$rootScope.roleAdmin) {
					event.preventDefault();
					if (redirectState === 'login') {
						$rootScope.requestedState = {
							params: toParams,
							state: toState
						};
						$rootScope.$state.go(redirectState, {notify: false});
					} else {
						$rootScope.rejection = {
							data: {
								type: 'AccessDenied'
							},
							show: true
						};
					}
				} else if (toState.name === 'home' && $rootScope.roleMember) {
					event.preventDefault();
					$rootScope.$state.go('dashboard', {notify: false, city: $cookieStore.get('cityId') || 1});
				}
			};
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                $rootScope.mayMessage3 = (toState.name === 'dashboard') && (!$cookieStore.get('mayMessage3Viewed')) && (new Date() < new Date(2015,4,26));
                $rootScope.rejection = null;
				$rootScope.success = null;
				var session = $cookieStore.get('session');
				if (session) {
					$rootScope.userName = session.name;
					$rootScope.roleMember = _.include(session.roles, 'member') ? true : false;
					$rootScope.roleAdmin = _.include(session.roles, 'admin') ? true : false;
                    $window.rockVarSet.push({
                        'customerId': session.id,
                        'customerStatus': 'returning'
                    });
					checkRule(event, toState, toParams, 'accessDenied');
				} else {
					$rootScope.userName = null;
					$rootScope.roleMember = null;
					$rootScope.roleAdmin = null;
					checkRule(event, toState, toParams, 'login');
				}
			});
            $rootScope.closeMayMessage = function() {
                $cookieStore.put('mayMessage3Viewed', true);
                $rootScope.mayMessage3 = false;
            };
		}
	])
	/*.run(['$http', 'DSCacheFactory',
		function($http, DSCacheFactory) {
			var defaultCache = DSCacheFactory('defaultCache', { // jshint ignore:line
				maxAge: 900000, // Items added to this cache expire after 15 minutes.
				cacheFlushInterval: 6000000, // This cache will clear itself every hour.
				deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
			});
			$http.defaults.cache = DSCacheFactory.get('defaultCache');
		}
	])*/
	.run(['$rootScope', '$modalStack',
		function($rootScope, $modalStack) {
			$rootScope.$on('$stateChangeStart', function() {
				var top = $modalStack.getTop();
				if (top) {
					$modalStack.dismiss(top.key);
				}
			});
		}
	])
	.run(function(editableOptions) {
		editableOptions.theme = 'bs3';
	})
	.run(['gettextCatalog', '$cookieStore', '$rootScope', 'amMoment',
		function(gettextCatalog, $cookieStore, $rootScope, amMoment) {
            $rootScope.$on('changeLang', function(event, lang) {
                $rootScope.lang = lang;
                $cookieStore.put('globalLang', $rootScope.lang);
                gettextCatalog.setCurrentLanguage($rootScope.lang);
                amMoment.changeLocale($rootScope.lang);
            });
		}
	])
    .run(['$window', '$location', 'navigator',
        function($window, $location, navigator) {
            $window.rockVarSet.push({
                'userAgent': $window.navigator.userAgent,
                'deviceType': navigator.platform(),
                'webTheme': 'desktop'
            });
        }
    ])
	.config(function(uiGmapGoogleMapApiProvider) {
		uiGmapGoogleMapApiProvider.configure({
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});
	})
	//.config(['ezfbProvider', function(ezfbProvider) {
	//     ezfbProvider.setInitParams({
	//         appId: '1403268876590849'
	//     });
	//     ezfbProvider.setLocale('de_DE');
	//}])
	.config(['ezfbProvider', '$injector', function(ezfbProvider) {
		var myInitFunction = ['$window', '$rootScope', function($window, $rootScope) {
			$window.FB.init({
				appId: $window.smmConfig.fbClientId,
				version: 'v1.0'
			});

			$rootScope.$broadcast('FB.init');

		}];

		var myLoadSDKFunction = ['$window', '$document', '$rootScope', 'ezfbAsyncInit',
			function($window, $document, $rootScope, ezfbAsyncInit) {
				var locale = $rootScope.lang === 'de' ? 'de_DE' : 'en_GB';
				// Load the SDK's source Asynchronously
				(function(d) {
					var js, id = 'facebook-jssdk',
						ref = d.getElementsByTagName('script')[0];
					if (d.getElementById(id)) {
						return;
					}
					js = d.createElement('script');
					js.id = id;
					js.async = true;
					js.src = '//connect.facebook.net/' + locale + '/sdk.js';
					// js.src = '//connect.facebook.net/' + ezfbLocale + '/sdk/debug.js';  // debug
					ref.parentNode.insertBefore(js, ref);
				}($document[0]));

				$window.fbAsyncInit = ezfbAsyncInit;
			}
		];

		ezfbProvider.setInitFunction(myInitFunction);
		ezfbProvider.setLoadSDKFunction(myLoadSDKFunction);
	}])
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('myHttpInterceptor');
		$httpProvider.defaults.withCredentials = true;
	}])
	.factory('resourceInterceptor', function($rootScope, $interval) {
		return {
			response: function(response) {
				$rootScope.success = response;
				$rootScope.success.show = true;
                $interval(function() {
                    $rootScope.success = null;
                }, 5000, 1, {invokeApply: false});
				return response;
			}
		};
	})
	.factory('myHttpInterceptor', ['$q', '$rootScope', '$cookieStore', '$interval', function($q, $rootScope, $cookieStore, $interval) {
		var requestsData = [],
			enabledLogRequests = false;
		return {
			responseError: function responseError(rejection) {
				$rootScope.rejection = rejection;
				var types = ['WrongUsernameOrPassword', 'CardException', 'AccountExists', 'VoucherCodeNotValid', 'NotFoundException', 'UserNotFound', 'ProviderWrongConfigurationException', 'ClassNotBookableException', 'ProviderNotAvailableException', 'ClassBookingFailException'];
				$rootScope.handledType = _.include(types, rejection.data.type);
				if (rejection.data.type === 'NoLoggedInUser') {
					$rootScope.$state.go('login', {
						notify: false
					});
					$cookieStore.remove('session');
				} else {
					$rootScope.rejection.show = !($rootScope.handledError && $rootScope.handledType);
				}
				$interval(function() {
                    $rootScope.rejection = null;
                }, 60000, 1, {invokeApply: false});
				return $q.reject(rejection);
			},
			request: function(config) {
				if (enabledLogRequests) {
					requestsData.push(config);
				}
				return config;
			},
			getRequest: function() {
				console.log(requestsData);
				return requestsData;
			},
			enableLogRequests: function() {
				enabledLogRequests = true;
				console.log('Requests are recorded');
			},
			disableLogRequests: function() {
				enabledLogRequests = false;
				requestsData = [];
				console.log('Requests aren\'t recorded');
			}
		};
	}])
	.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$analyticsProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $analyticsProvider) {

		$urlRouterProvider
		// The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
		// Here we are just setting up some convenience urls.
			.when('/signup/', '/p/signup/1/')
			.when('/signup', '/p/signup/1/')
			.when('/p/signup', '/p/signup/1/')
			.when('/p/signup/?invitation', '/p/signup/1/?invitation')
			.when('/p/signup/', '/p/signup/1/')
			.when('/p/kurse/', '/p/kurse/1/');

		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);
		$analyticsProvider.firstPageview(false);
		//noinspection JSValidateTypes
		$stateProvider
			.state('home', {
				url: '/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/homepage.html');
                },
				controller: 'HomepageCtrl',
				resolve: {

					getDisciplines: function($http) {

						return $http.get('json/disciplines.json', {cache: true});

					}

				},
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
            .state('landing', {
                url: '/:params/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/landing.html');
                },
                controller: 'LandingCtrl',
                onExit: function($rootScope) {
                    $rootScope.autoscroll = true;
                }
            })
			.state('signup', {
				url: '/p/signup/:cityId/?invitation',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/signup.html');
                },
				controller: 'SignupCtrl',
				resolve: {

					getCities: function(RestApi) {

						return RestApi.query({route: 'cities'}).$promise;

					},

					getCityId: function($stateParams, $cookieStore) {

						return parseInt($stateParams.cityId) || $cookieStore.get('cityId') || 1;

					},

					getInvitation: function($stateParams) {

						return parseInt($stateParams.invitation) || 1;

					}

				},
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('studio', {
				url: '/p/studio/:studioId/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/studio.html');
                },
				controller: 'StudioCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('profile', {
				url: '/my/',
				abstract: true,
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userProfile.html');
                },
				controller: 'ProfileCtrl',
				resolve: {

					getMembership: function(Membership) {

						return Membership.get().$promise;

					}

				},
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('profile.account', {
				url: 'account/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userAccount.html');
                }
			})
			.state('profile.membership', {
				url: 'membership/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userMembership.html');
                }
			})
			.state('profile.reservations', {
				url: 'reservations/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userReservations.html');
                },
                controller: 'ReservationsCtrl'
			})
			.state('dashboard', {
				url: '/p/kurse/:city/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userDashboard.html');
                },
				controller: 'DashboardCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('allstudios', {
				url: '/p/studios/:city/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/userStudios.html');
                },
				controller: 'StudiosCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('admin', {
				url: '/admin/v2/',
				abstract: true,
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/admin.html');
                },
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('admin.classes', {
				url: 'classes/',
				template: '<div ui-view></div>',
				abstract: true,
				resolve: {

					getLocations: function(RestApi) {

						return RestApi.query({route: 'locations'}).$promise;

					},

					getStudios: function(RestApi) {

						return RestApi.query({route: 'studios'}).$promise;

					}

				}
			})
			.state('admin.classes.list', {
				url: '',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/classes.html');
                },
				controller: 'ClassesCtrl',
				resolve: {

					getClasses: function(RestApi) {

						return RestApi.query({route: 'events'}).$promise;

					}

				}
			})
			.state('admin.classes.new', {
				url: 'new/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/class.html');
                },
				controller: 'CreateClassCtrl'
			})
            .state('admin.classes.import', {
                url: 'import/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/entityImport.html');
                },
                resolve: {
                    getImportEntities: function ($http) {
                        return $http.get('json/import.json', {cache: true});
                    }
                },
                controller: function ($scope, $rootScope, RestApi, getImportEntities, $modal, ImportData) {

                    $scope.import = function () {
                        $scope.showSpinner = true;
                        $scope.entities = $scope.csv.result;
                        _.each($scope.entities, function (entity) {
                            _.each(entity, function (value, key) {
                                switch ($scope.importEntity[key].type) {
                                    case 'integer':
                                        entity[key] = parseInt(value);
                                        break;
                                    case 'float':
                                        entity[key] = parseFloat(value);
                                        break;
                                    default:
                                        break;
                                }
                            });
                        });
                        $scope.importData.reload();
                        $scope.importData.submit($scope.entities).then(function () {
                            $scope.showSpinner = false;
                            $modal.open({
                                templateUrl: 'app/views/modalImport.html',
                                controller: ['$scope', '$modalInstance', 'importData',

                                    function ($scope, $modalInstance, importData) {

                                        $scope.close = function () {
                                            $modalInstance.close(false);
                                        };

                                        $scope.finished = false;
                                        $scope.stats = importData.stats;
                                        $scope.$watch(function() { return $scope.stats.processed; },
                                            function() {
                                                if ($scope.stats.processed === $scope.stats.total) {
                                                    $scope.finished = true;
                                                }
                                            }
                                        );
                                    }],
                                resolve: {
                                    importData: function() {
                                        return $scope.importData;
                                    }
                                },
                                backdrop: 'static',
                                windowClass: 'modal-cancel'
                            }).result.then(function () {
                                    $scope.csv = {
                                        content: null,
                                        header: true,
                                        separator: ',',
                                        result: null,
                                        ignoredColumns: [],
                                        missingColumns: [],
                                        importErrors: {}
                                    };
                                });
                        }, function () {
                        });
                    };

                    $scope.csv = {
                        content: null,
                        header: true,
                        separator: ',',
                        result: null,
                        ignoredColumns: [],
                        ignoredLines: [],
                        missingColumns: [],
                        importErrors: {}
                    };
                    $scope.importEntity = getImportEntities.data.class;
                    $scope.formattedErrors = function () {
                        var result = 'Errors found in lines: ';
                        _.each($scope.csv.importErrors, function (value, key) {
                            result += key + ' (columns: ' + value.join(', ') + '), ';
                        });
                        return result.slice(0, -2);
                    };
                    $scope.formattedIgnoredColumns = function () {
                        return 'The following columns have been ignored: ' + $scope.csv.ignoredColumns.join(', ');
                    };
                    $scope.formattedIgnoredLines = function () {
                        return 'The following lines of the original file have been ignored (column count doesn\'t match header): ' + $scope.csv.ignoredLines.join(', ');
                    };
                    $scope.formattedMissingColumns = function () {
                        return 'FATAL ERROR! The following required columns are missing in your file: ' + $scope.csv.missingColumns.join(', ');
                    };
                    $scope.handleRemoteRules = function (entity) {
                        _.each(entity, function (value, key) {
                            if (_.contains(_.keys(value.rules), 'remote')) {
                                var remoteRule = value.rules.remote;
                                delete value.rules.remote;
                                RestApi.query({route: remoteRule.route}).$promise.then(function(res) {
                                    value.rules.inclusion = _.map(res, function(obj) { return obj[remoteRule.field]; }).join(',');
                                });
                            }
                        });
                        return entity;
                    };
                    $scope.importEntity = $scope.handleRemoteRules($scope.importEntity);
                    $scope.importData = ImportData;
                }
            })
            .state('admin.classes.class', {
                url: ':classId/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/class.html');
                },
                resolve: {

                    getClass: function(RestApi, $stateParams) {

                        return RestApi.get({route: 'events'}, {id: $stateParams.classId}).$promise;

                    },

                    getOccurrences: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'occurrences',parentId: $stateParams.classId}).$promise;

                    }

                },
                controller: 'ClassCtrl'
            })
            .state('admin.booking', {
                url: 'bookings/:bookingId/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/booking.html');
                },
                resolve: {

                    getBooking: function($http, $stateParams, $window) {

                        return $http.get($window.smmConfig.restUrlBase + '/api/bookings/' + $stateParams.bookingId).then(function(res) {
                            return res.data.bookings;
                        })

                    }

                },
                controller: 'BookingCtrl'
            })
			.state('admin.entity', {
				url: ':route',
				template: '<div ui-view></div>',
				abstract: true,
				resolve: {

					getEntityFields: function($http) {

						return $http.get('json/entityFields.json', {cache: true});

					}

				},
				controller: function($rootScope, getEntityFields, RestApi, $http, $window, $modal) {

					$rootScope.fields = getEntityFields.data.entities[$rootScope.$stateParams.route];
					$rootScope.freeSubscriptionDuarationInMonths = _.range(1, 13);
					$rootScope.discountDuarationInMonths = _.range(1, 13);
					$rootScope.subscriptionType = ['BLACK', 'WHITE', 'LITE'];
					$rootScope.coverage = ['NONE', 'PARTIAL', 'FULL'];

					if ($rootScope.$stateParams.route === 'studios') {
						RestApi.query({route: 'locations'}).$promise.then(function(response) {
							$rootScope.locations = response;
						});
						RestApi.query({route: 'cities'}).$promise.then(function(response) {
							$rootScope.cities = response;
							$rootScope.cities.unshift({id: 0,defaultName: 'No location'});
						});
						$rootScope.upload = function(target) {
							$rootScope.modalInstance = $modal.open({
								templateUrl: 'app/views/modalUpload.html',
								controller: function($scope, target, id, $window, $modalInstance, $interval) {

									$scope.target = target;
									$scope.id = id;
									$scope.$window = $window;
									$scope.photo = {};

									$scope.close = function() {
										$modalInstance.dismiss('close');
									};

									$scope.changePhotoTitle = function(flow, title) {
										flow.opts.target = flow.opts.target + title;
									};

									$scope.uploader = {
										success: function($flow, $file, $message) {
											var message = angular.fromJson($message);
                                            $interval(function() {
                                                $modalInstance.close(message.status);
                                            }, 1000, 1, {invokeApply: false});
										}
									};


								},
								backdrop: 'static',
								windowClass: 'modal-upload',
								resolve: {
									target: function() {
										return target;
									},
									id: function() {
										return $rootScope.$stateParams.entityId;
									}
								}
							}).result.then(function(status) {
								if (status === 'success') {
									$rootScope.autoscroll = false;
									$rootScope.$state.go($rootScope.$state.current, {
										route: $rootScope.$stateParams.route,
										entityId: $rootScope.$stateParams.entityId
									}, {
										reload: true,
										inherit: false,
										notify: true
									});
								}
							});
						};

						$rootScope.removeCover = function(id) {
							$http.post($window.smmConfig.restUrlBase + '/api/studios/' + $rootScope.$stateParams.entityId + '/deleteCover?coverId=' + id, {
								cache: false
							}).success(function(response) {
								console.log(response);
								$rootScope.autoscroll = false;
								$rootScope.$state.go($rootScope.$state.current, {
									route: $rootScope.$stateParams.route,
									entityId: $rootScope.$stateParams.entityId
								}, {
									reload: true,
									inherit: false,
									notify: true
								});

							}).error(function(response, status) {
								console.error(response);
								console.error(status);
							});
						};

						$rootScope.updateTitle = function(cover) {
							cover.showSpinner = true;
							RestApi.update({
								route: 'covers',
								id: cover.id
							}, cover).$promise.then(function(res) {
								console.log(res);
								cover.showSpinner = false;
							});
						};

					}

					if ($rootScope.$stateParams.route === 'locations') {
						RestApi.query({
							route: 'cities'
						}).$promise.then(function(response) {
							$rootScope.cities = response;
						});
                        $rootScope.changeCityLocation = function (city) {
                            RestApi.query({route: 'districts',cityId: city}).$promise.then(function (res) {
                                $rootScope.neigbourhood = _.pluck(res, 'name');
                            });
                        };
                        $rootScope.updateMapGeocode = function () {
                            $http.get($window.smmConfig.restUrlBase + '/api/locations/' + $rootScope.$stateParams.entityId + '/updateGeoCode').success(function(response) {
                                console.log(response);
                            }).error(function(response, status) {
                                console.error(response);
                                console.error(status);
                            });
                        };
					}

					$rootScope.showDatepicker = {};
					$rootScope.openDatepicker = function($event, type) {
						$event.preventDefault();
						$event.stopPropagation();
						$rootScope.showDatepicker[type] = true;
					};
					$rootScope.minStartDate = new Date();
					$rootScope.dateOptions = {
						startingDay: 1,
						showWeekNumbers: false,
						showWeeks: false
					};

					$rootScope.clearFilters = function() {
						$rootScope.search = {};
					};
					$rootScope.clearFilters();

					if ($rootScope.$stateParams.route === 'memberships') {
						$rootScope.clearPhotoFilter = function() {
							if ($rootScope.search.photo === 'false') {
								delete $rootScope.search.photo;
							}
						};
					}

				}
			})
			.state('admin.entity.list', {
				url: '/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/entityList.html');
                },
				resolve: {

					getEntityList: function(RestApi, $stateParams) {

						return RestApi.query({route: $stateParams.route}).$promise;

					}

				},
				controller: function($scope, $rootScope, getEntityList) {

					getEntityList.$promise.then(function(res) {
						$scope.entities = res;
					});

					$scope.specialFieldType = function(fieldType) {
						return _.indexOf(['checkbox', 'photo', 'entity'], fieldType) > -1;
					};

                    $scope.limit = 20;
                    $scope.showMore = function () {
                        $scope.limit += 5;
                    };

				}
			})
			.state('admin.entity.new', {
				url: '/new/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/entity.html');
                },
				controller:

					function($scope, $rootScope, RestApi) {

					$scope.entity = new RestApi();

					$scope.save = function() {
						$scope.showSpinner = true;
						$scope.entity.$save({
							route: $rootScope.$stateParams.route
						}).then(function(res) {
							console.log(res);
							$scope.showSpinner = false;
							$rootScope.$state.go('admin.entity.item', {
								route: $rootScope.$stateParams.route,
								entityId: (res.data.id || res.data.code)
							});
						});
					};

					if ($rootScope.$stateParams.route === 'vouchers') {
						RestApi.query({
							route: 'vouchers'
						}).$promise.then(function(res) {
							$scope.vouchersList = _.pluck(res, 'code');
						});
						$scope.checkVoucherUnique = function(voucher) {
							$scope.errorVoucher = _.include($scope.vouchersList, voucher);
						};
						$scope.toUpperCase = function(string) {
							$scope.entity.code = string.toUpperCase();
						};
					}

				}
			})
			.state('admin.entity.item', {
				url: '/:entityId/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/entity.html');
                },
				resolve: {

					getEntity: function(RestApi, $stateParams) {

						return RestApi.get({route: $stateParams.route}, {id: $stateParams.entityId}).$promise;

					}

				},
				controller:

					function($scope, $rootScope, getEntity) {

					getEntity.$promise.then(function() {
						$scope.entity = getEntity;
					});

					$scope.save = function() {
						$scope.showSpinner = true;
						$scope.entity.$update({route: $rootScope.$stateParams.route,id: $rootScope.$stateParams.entityId}).then(function(res) {
							console.log(res);
							$scope.showSpinner = false;
                            if ($rootScope.$stateParams.route === 'locations') {
                                $rootScope.updateMapGeocode();
                            }
						});
					};

					$scope.remove = function() {
						$scope.entity.$delete({route: $rootScope.$stateParams.route,id: $rootScope.$stateParams.entityId}).then(function(res) {
							console.log(res);
							$rootScope.$state.go('admin.entity.list', {route: $rootScope.$stateParams.route});
						});
					};

				},
				onEnter: function($rootScope) {
					$rootScope.autoscroll = false;
				},
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}

			})
			.state('about', {
				url: '/p/about/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/about.html');
                },
				controller: 'AboutCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
            .state('about_test', {
                url: '/p/about_test/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/about_test.html');
                },
                controller: 'AboutCtrl',
                onExit: function($rootScope) {
                    $rootScope.autoscroll = true;
                }
            })
			.state('login', {
				url: '/p/login/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/login.html');
                },
				controller: 'LoginCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('reset', {
				url: '/p/password/reset/:token',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/resetPassword.html');
                },
				controller: 'ResetCtrl',
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('impressum', {
				url: '/p/impressum/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/impressum.html');
                },
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('faq', {
				url: '/p/faq/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/faq.html');
                },
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('privacy', {
				url: '/p/privacy/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/privacy.html');
                },
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			})
			.state('agb', {
				url: '/p/agb/',
                templateProvider: function($templateCache){
                    return $templateCache.get('app/views/agb.html');
                },
				onExit: function($rootScope) {
					$rootScope.autoscroll = true;
				}
			});
	}]);
