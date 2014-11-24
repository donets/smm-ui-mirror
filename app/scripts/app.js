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
        'localytics.directives',
        'ezfb',
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
        'boltApp.controllers.Class',
        'boltApp.controllers.Reset',
        'boltApp.controllers.About',
        'boltApp.controllers.More',
        'boltApp.controllers.Login',
        'boltApp.controllers.Admin',
        'boltApp.controllers.Classes',
        'boltApp.services.events',
        'boltApp.services.occurrences',
        'boltApp.services.suppliers',
        'boltApp.services.user',
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
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$analyticsProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $analyticsProvider) {

        //$urlRouterProvider
        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        //.when('/ueber-somuchmore/', '/ueber-somuchmore/')
        //.when('/impressum/', '/impressum/')
        //.when('/agb/', '/agb/');

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
                        //$location.search('schedule', $location.search().schedule || 'today');
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
                    $rootScope.autoscroll = false;
                    return $rootScope.desktop ? $('.pre-cover').css('height', $rootScope.windowHeight * 0.8) : 0;
                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                    return $rootScope.desktop ? $('.pre-cover').css('height', '550px') : 0;
                },
                controller : 'GetcardCtrl'
            })
            .state('admin', {
                url : '/admin/v2/',
                abstract: true,
                templateUrl: 'views/admin.html',
                controller : 'AdminCtrl'
            })
            .state('admin.dashboard', {
                url : 'dashboard/',
                templateUrl: 'views/dashboard.html'
            })
            .state('admin.classes', {
                url : 'classes/',
                templateUrl: 'views/classes.html',
                controller : 'ClassesCtrl'
            })
            .state('admin.class', {
                url : 'class/:classId/',
                templateUrl: 'views/class.html',
                resolve: {

                    getClass: function(Events, $stateParams) {

                        return Events.get({eventId: $stateParams.classId}).$promise;

                    },

                    getOccurrences: function(Occurrences, $stateParams) {

                        return Occurrences.query({parentId: $stateParams.classId}).$promise;

                    }

                },
                controller : 'ClassCtrl'
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
	        .state('agb', {
	            url : '/p/agb/',
	            templateUrl: 'views/agb.html'
	        });
    }]);
