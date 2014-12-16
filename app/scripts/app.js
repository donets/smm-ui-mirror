'use strict';

/**
 * @ngdoc overview
 * @name boltApp
 * @description
 * # boltApp
 *
 * Main module of the application.
 */
angular
    .module('boltApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.bootstrap',
        'angular-data.DSCacheFactory',
        'angularMoment',
        'ngProgress',
        'angularSpinner',
        'duScroll',
        'duParallax',
        'ngTagsInput',
        'localytics.directives',
        'ezfb',
        'flow',
        'permission',
        'angulartics',
        'angulartics.google.analytics',
        'angulartics.google.tagmanager',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.buffering',
        'com.2fdevs.videogular.plugins.poster',
        'boltApp.controllers.Main',
        'boltApp.controllers.Event',
        'boltApp.controllers.Studio',
        'boltApp.controllers.Social',
        'boltApp.controllers.Confirmation',
        'boltApp.controllers.Subscribe',
        'boltApp.controllers.Getcard',
        'boltApp.controllers.Classes',
        'boltApp.controllers.Class',
        'boltApp.controllers.CreateClass',
        'boltApp.controllers.Reset',
        'boltApp.controllers.About',
        'boltApp.controllers.More',
        'boltApp.controllers.Login',
        'boltApp.controllers.Admin',
        'boltApp.controllers.Signup',
        'boltApp.controllers.Profile',
        'boltApp.services.restApi',
        'boltApp.services.events',
        'boltApp.services.occurrences',
        'boltApp.services.suppliers',
        'boltApp.services.user',
        'boltApp.services.membership',
        'boltApp.services.navigator'
    ]);
angular.module('boltApp')
    .run(['$rootScope', '$state', '$stateParams', 'amMoment', '$window',
        function ($rootScope, $state, $stateParams, amMoment, $window) {
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $('.pre-cover').addClass('hide-cover');
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.autoscroll = true;
            $rootScope.mainTitle = 'Somuchmore | Bewege Körper, Geist und Seele';
            $rootScope.$on('$viewContentLoading', function(){
                $window.rendering = true;
            });
            $rootScope.$on('$viewContentLoaded', function(){
                return $window.rendering ? $window.prerenderReady = true : 0;
            });
            amMoment.changeLanguage('en'); 
            $.getScript('//connect.facebook.net/en_US/fbds.js').done( function() {
                $window._fbq = $window._fbq || [];
                $window._fbq.push(['addPixelId', '1461407927469396']);
                $window._fbq.push(['track', 'PixelInitialized', {}]);
            });
        }])
    .run(['$http', 'DSCacheFactory',
        function ($http, DSCacheFactory) {
            var defaultCache = DSCacheFactory('defaultCache', { // jshint ignore:line
                maxAge: 900000, // Items added to this cache expire after 15 minutes.
                cacheFlushInterval: 6000000, // This cache will clear itself every hour.
                deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
            });
            $http.defaults.cache = DSCacheFactory.get('defaultCache');
        }])
    .run(['$rootScope', '$modalStack',
        function($rootScope, $modalStack) {
            $rootScope.$on('$stateChangeStart', function() {
                var top = $modalStack.getTop();
                if (top) {
                    $modalStack.dismiss(top.key);
                }
            });
        }])
    .config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
        GoogleMapApi.configure({
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    }])
    //.config(['ezfbProvider', function(ezfbProvider) {
    //     ezfbProvider.setInitParams({
    //         appId: '1403268876590849'
    //     });
    //     ezfbProvider.setLocale('de_DE');
    //}])
    .config(['ezfbProvider', function (ezfbProvider) {
        var myInitFunction = ['$window', '$rootScope', function ($window, $rootScope) {
            $window.FB.init({
                appId: $window.smmConfig.fbClientId,
                version: 'v1.0'
            });

            $rootScope.$broadcast('FB.init');
        }];

        ezfbProvider.setInitFunction(myInitFunction);
        ezfbProvider.setLocale('de_DE');
    }])
    .config(['$httpProvider',  function($httpProvider){
        $httpProvider.responseInterceptors.push('HttpProgressInterceptor');
        $httpProvider.interceptors.push('myHttpInterceptor');
        $httpProvider.defaults.withCredentials = true;
    }])
    .provider('HttpProgressInterceptor', function HttpProgressInterceptor(){
        this.$get = ['$injector', '$q', function($injector, $q){
            var my = this;
            var ngProgress;

            this.getNgProgress = function() {
                ngProgress = ngProgress || $injector.get('ngProgress');
                return ngProgress;
            };

            return function(promise){
                ngProgress = my.getNgProgress();
                ngProgress.color('#ff695c');
                ngProgress.height('3px');
                ngProgress.reset();
                ngProgress.start();
                return promise
                    .then(
                    function(response){
                        ngProgress.complete();
                        return response;
                    },
                    function(response){
                        ngProgress.complete();
                        return $q.reject(response);
                    }
                );
            };
        }];
    })
    .factory('resourceInterceptor', function($rootScope) {
        return {
            response: function (response) {
                $rootScope.success = response;
                $rootScope.success.show = true;
                return response;
            }
        }
    })
    .factory('myHttpInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
        return {
            responseError: function responseError(rejection) {
                $rootScope.rejection = rejection;
                $rootScope.rejection.show = true;
                console.error(rejection);
                return $q.reject(rejection);
            }
        };
    }])
    .run(function (Permission, User) {
        Permission
            .defineRole('anon', function () {
                return User.get().$promise.then(function (res) {
                    if(!res.currentUser) {
                        return true;
                    }
                });
            })
            .defineRole('member', function () {

                return User.get().$promise.then(function (res) {

                    if(res.currentUser && _.include(res.currentUser.roles, 'member')) {
                        return true;
                    } else {
                        return false;
                    }
                });
            })
            .defineRole('admin', function () {

                return User.get().$promise.then(function (res) {

                    if(res.currentUser && _.include(res.currentUser.roles, 'admin')) {
                        return true;
                    } else {
                        return false;
                    }
                });

            });
    })
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$analyticsProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $analyticsProvider) {

        $urlRouterProvider
        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/signup/', '/p/signup/')
        .when('/signup', '/p/signup/');

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        $analyticsProvider.firstPageview(false);
        //noinspection JSValidateTypes
        $stateProvider
            .state('main', {
                url : '/p/events/',
                templateUrl: 'views/main.html',
                resolve: {

                    // A function value resolves to the return
                    // value of the function
                    getEvents: function(Occurrences) {
                        return Occurrences.query();
                    }
                },
                onEnter: function($rootScope){
                    $rootScope.autoscroll = false;
                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                },
                controller : 'MainCtrl'
            })
            .state('view', {
                url : '/p/event/:eventId/',
                templateUrl: 'views/event.html',
                resolve: {

                    getEvent: function(Occurrences, $stateParams){

                        // Extract customer ID from $stateParams

                        // Return a promise to make sure the customer is completely
                        // resolved before the controller is instantiated
                        return Occurrences.get({occurrenceId: $stateParams.eventId}).$promise;
                    }
                },
                onEnter: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', $rootScope.windowHeight - 200) : 0;
                },
                onExit: function($rootScope){
                    $('html head title').text($rootScope.mainTitle);
                    return $rootScope.desktop ? $('.pre-cover').css('height', '550px') : 0;
                },
                controller : 'EventCtrl'
            })
            .state('view.contact', {
                url : 'contact/',
                onEnter: ['$state', '$stateParams', '$modal', function($state, $stateParams, $modal) {
                    $modal.open({
                        templateUrl: 'views/modalContact.html',
                        controller: ['$scope', '$modalInstance', '$http', 'teacherId',

                            function ($scope, $modalInstance, $http, teacherId) {

                            $scope.contact = {};

                            $scope.submitMessage = function() {
                                $scope.loadingUpdate = true;
                                $http.post('/api/message/' + teacherId, $scope.contact).success(function () {
                                    $scope.loadingUpdate = false;
                                    $scope.successUpdate = true;
                                    setTimeout(function () {
                                        $modalInstance.close(true);
                                    }, 0);
                                }).error(function (response, status) {
                                        $scope.loadingUpdate = false;
                                        $scope.errorUpdate = true;
                                        console.error(status);
                                    });
                            };

                            $scope.close = function () {
                                $modalInstance.close(true);
                            };

                        }],
                        backdrop: 'static',
                        resolve: {
                            teacherId: function (Occurrences) {
                                var occurrenceId = $stateParams.occurrenceId;
                                return Occurrences.get({occurrenceId: occurrenceId}).$promise.then(function (res) {
                                    return res.event.somuchmore.teacherId; 
                                });
                            }
                        }
                    }).result.then(function(result) {
                        if (result) {
                            return $state.transitionTo('view', {occurrenceId: $stateParams.occurrenceId});
                        }
                    });
                }]
            })
            .state('studio', {
                url : '/p/studio/:studioId/',
                templateUrl: 'views/studio.html',
                onEnter: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', $rootScope.windowHeight - 350) : 0;
                },
                onExit: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', '550px') : 0;
                },
                controller : 'StudioCtrl'
            })
            .state('home', {
                url : '/',
                templateUrl: 'views/homepage.html',
                onEnter: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', $rootScope.windowHeight * 0.8) : 0;
                },
                onExit: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', '550px') : 0;
                },
                controller : 'GetcardCtrl',
                resolve: {

                    getStudios: function($http) {

                        return $http.get('json/studios.json', {cache: true});

                    }

                }
            })
            .state('signup', {
                url : '/p/signup/',
                templateUrl: 'views/signup.html',
                controller : 'SignupCtrl',
                resolve: {

                    getStudios: function($http) {

                        return $http.get('json/studios.json', {cache: true});

                    }

                }
            })
            .state('profile', {
                url : '/my/',
                abstract: true,
                templateUrl: '../views/userProfile.html',
                controller : 'ProfileCtrl',
                resolve: {

                    getMembership: function(Membership) {

                        return Membership.get().$promise;

                    }

                },
                onEnter: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', '350px') : 0;
                },
                onExit: function($rootScope){
                    return $rootScope.desktop ? $('.pre-cover').css('height', '550px') : 0;
                },
                data: {
                    permissions: {
                        only: ['member'],
                        except: ['anon'],
                        redirectTo: 'signup'
                    }
                }
            })
            .state('profile.account', {
                url : 'account/',
                templateUrl: 'views/userAccount.html'
            })
            .state('profile.dashboard', {
                url : 'dashboard/',
                templateUrl: 'views/userDashboard.html'
            })
            .state('profile.membership', {
                url : 'membership/',
                templateUrl: 'views/userMembership.html'
            })
            .state('admin', {
                url : '/admin/v2/',
                abstract: true,
                templateUrl: 'views/admin.html',
                data: {
                    permissions: {
                        only: ['admin'],
                        except: ['anon', 'member'],
                        redirectTo: 'home'
                    }
                }
            })
            .state('admin.dashboard', {
                url : 'dashboard/',
                templateUrl: 'views/adminDashboard.html'
            })
            .state('admin.classes', {
                url : 'classes/',
                templateUrl: 'views/classes.html',
                resolve: {

                    getClasses: function(RestApi) {

                        return RestApi.query({route: 'events'}).$promise;

                    }

                },
                controller : 'ClassesCtrl'
            })
            .state('admin.class', {
                url : 'classes/{classId:[0-9]+}/',
                templateUrl: 'views/class.html',
                resolve: {

                    getClass: function(RestApi, $stateParams) {

                        return RestApi.get({route: 'events'}, {id: $stateParams.classId}).$promise;

                    },

                    getOccurrences: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'occurrences', parentId: $stateParams.classId}).$promise;

                    },

                    getLocations: function(RestApi) {

                        return RestApi.query({route: 'locations'}).$promise;

                    }

                },
                controller : 'ClassCtrl'
            })
            .state('admin.newClass', {
                url : 'classes/new/',
                templateUrl: 'views/class.html',
                resolve: {

                    getLocations: function(RestApi) {

                        return RestApi.query({route: 'locations'}).$promise;

                    }

                },
                controller : 'CreateClassCtrl'
            })
            .state('admin.entity', {
                url : ':route',
                template: '<div ui-view></div>',
                abstract: true,
                resolve: {

                    getEntityFields: function($http) {

                        return $http.get('json/entityFields.json', {cache: true});

                    },

                    getNeigbourhood: function($http) {

                        return $http.get('json/neigbourhood.json', {cache: true});

                    }

                },
                controller :
                    function ($rootScope, getEntityFields, getNeigbourhood) {

                        $rootScope.fields = getEntityFields.data.entities[$rootScope.$stateParams.route];
                        $rootScope.neigbourhood = getNeigbourhood.data;
                        $rootScope.freeSubscriptionDuarationInMonths = _.range(1,13);
                        $rootScope.discountDuarationInMonths = _.range(1,13);
                        $rootScope.subscriptionType = ['BLACK', 'WHITE', 'LITE'];

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

                    }
            })
            .state('admin.entity.list', {
                url : '/',
                templateUrl: 'views/entityList.html',
                resolve: {

                    getEntityList: function(RestApi, $stateParams) {

                        return RestApi.query({route: $stateParams.route}).$promise;

                    }

                },
                controller :
                    function ($scope, $rootScope, getEntityList) {

                        getEntityList.$promise.then(function (res) {
                            $scope.entities = res;
                        });

                    }
            })
            .state('admin.entity.item', {
                url : '/{entityId:[0-9A-Z]+}/',
                templateUrl: 'views/entity.html',
                resolve: {

                    getEntity: function(RestApi, $stateParams) {

                        return RestApi.get({route: $stateParams.route}, {id: $stateParams.entityId}).$promise;

                    }

                },
                controller :

                    function ($scope, $rootScope, getEntity) {

                        getEntity.$promise.then(function () {
                            $scope.entity = getEntity;
                        });

                        $scope.save = function () {
                            $scope.entity.$update({route: $rootScope.$stateParams.route}).then(function (res) {
                                console.log(res);
                            });
                        };

                    }

            })
            .state('admin.entity.new', {
                url : '/new/',
                templateUrl: 'views/entity.html',
                controller :

                    function ($scope, $rootScope, RestApi) {

                        $scope.entity = new RestApi();

                        $scope.save = function () {
                            $scope.entity.$save({route: $rootScope.$stateParams.route}).then(function (res) {
                                console.log(res);
                                $rootScope.$state.go('admin.entity.item', {route: $rootScope.$stateParams.route, entityId: (res.id || res.data.code)});
                            });
                        };

                        if ($rootScope.$stateParams.route === 'vouchers') {
                            RestApi.query({route: 'vouchers'}).$promise.then(function (res) {
                                $scope.vouchersList = _.pluck(res, 'code');
                            });
                            $scope.checkVoucherUnique = function (voucher) {
                                $scope.errorVoucher = _.include($scope.vouchersList, voucher);
                            };
                            $scope.toUpperCase = function (string) {
                                $scope.entity.code = string.toUpperCase();
                            }
                        }

                    }
            })
            .state('more', {
                url : '/p/more/',
                templateUrl: 'views/more.html',
                controller : 'MoreCtrl'
            })
            .state('about', {
                url : '/p/about/',
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .state('reset', {
                url : '/p/password/reset/:token',
                templateUrl: 'views/resetPassword.html',
                controller: 'ResetCtrl'
            })
	        .state('impressum', {
	            url : '/p/impressum/',
	            templateUrl: 'views/impressum.html'
	        })
	        .state('faq', {
	            url : '/p/faq/',
	            templateUrl: 'views/faq.html'
	        })
	        .state('agb', {
	            url : '/p/agb/',
	            templateUrl: 'views/agb.html'
	        });
    }]);
