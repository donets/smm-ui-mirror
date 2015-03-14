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
        'gettext',
        'ngProgress',
        'angularSpinner',
        'duScroll',
        'duParallax',
        'ngTagsInput',
        'vr.directives.slider',
        'localytics.directives',
        'validation.match',
        'ezfb',
        'flow',
        'ngOptionsDisabled',
        'ng-optimizely',
        'ngshowvariant',
        'xeditable',
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
        'boltApp.controllers.Dashboard',
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
    .run(['$rootScope', '$state', '$stateParams', '$window', '$http', 'RestApi', '$q', '$cookieStore',
        function ($rootScope, $state, $stateParams, $window, $http, RestApi, $q, $cookieStore) {
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.autoscroll = false;
            $rootScope.pageReload = function () {
                $window.location.reload();
            };
            $rootScope.domain = _.last($window.location.hostname.split('.')).toUpperCase();
			var domains = [{domain: 'DE', countryCode: 'DE'}, {domain: 'UK', countryCode: 'UK'}, {domain: 'COM', countryCode: 'DE'}];
			$rootScope.domainProperties = _.findWhere(domains, {domain: $rootScope.domain});
			$rootScope.countryCode = $rootScope.domainProperties ? $rootScope.domainProperties.countryCode : 'DE';
			console.log('country = ' + $rootScope.countryCode);
            $rootScope.$on('$viewContentLoading', function(){
                $window.rendering = true;
            });
            $rootScope.$on('$viewContentLoaded', function(){
                var prerenderReady = function () {
                    $window.prerenderReady = true;
                    $rootScope.prerenderReady = true;
                    $('.pre').addClass('hide_loader');
                };
                if ($window.rendering) {
                    /*$http.get('//ipinfo.io/json/?token=c2989e43470111', {withCredentials: false}).success(function (response) {
                        RestApi.query({route: 'cities'}).$promise.then(function (res) {
                            var city = _.findWhere(res, {defaultName: response.city});
                            $cookieStore.put('cityId', city && city.active ? city.id : 1);
                            prerenderReady();
                        });
                    }).error(function () {
                        $cookieStore.put('cityId', 1);
                        prerenderReady();
                    });*/
                    prerenderReady();
                }
            });
            var checkRule = function (event, toState, toParams, redirectState) {
                if (toState.name.split('.')[0] === 'profile' && !$rootScope.roleMember || toState.name.split('.')[0] === 'admin' && !$rootScope.roleAdmin) {
                    event.preventDefault();
                    if (redirectState === 'login') {
                        $rootScope.requestedState = {params: toParams, state: toState};
                        $rootScope.$state.go(redirectState, {notify: false});
                    } else {
                        $rootScope.rejection = {
                            data: {
                                type: 'AccessDenied'
                            },
                            show : true
                        };
                    }
                } else if (toState.name === 'home' && $rootScope.roleMember) {
                    event.preventDefault();
                    $rootScope.$state.go('dashboard', {notify: false});
                }
            };
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                $rootScope.rejection = null;
                $rootScope.success = null;
                var session = $cookieStore.get('session');
                if (session) {
                    $rootScope.userName = session.name;
                    $rootScope.roleMember = _.include(session.roles, 'member') ? true : false;
                    $rootScope.roleAdmin = _.include(session.roles, 'admin') ? true : false;
                    checkRule(event, toState, toParams, 'accessDenied');
                } else {
                    $rootScope.userName = null;
                    $rootScope.roleMember = null;
                    $rootScope.roleAdmin = null;
                    checkRule(event, toState, toParams, 'login');
                }
            });
            $.getScript('//connect.facebook.net/en_US/fbds.js').done( function() {
                $window._fbq = $window._fbq || [];
                $window._fbq.push(['addPixelId', '1461407927469396']);
                $window._fbq.push(['track', 'PixelInitialized', {}]);
            });
        }])
    /*.run(['optimizely', function(optimizely) {
        optimizely.loadProject('2367521283');
    }])*/
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
    .run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    })
    .run(['gettextCatalog', '$cookieStore', '$rootScope', 'amMoment',
        function (gettextCatalog, $cookieStore, $rootScope, amMoment) {
            if (!$cookieStore.get('globalLang')) {
                switch ($rootScope.countryCode) {
                    case 'DE':
                        $rootScope.lang = 'de';
                        break;
                    case 'UK':
                        $rootScope.lang = 'en';
                        break;
                    default:
                        $rootScope.lang = 'de';
                }
                $cookieStore.put('globalLang', $rootScope.lang);
            }
            else {
                $rootScope.lang = $cookieStore.get('globalLang');
            }
            gettextCatalog.setCurrentLanguage($rootScope.lang);
            amMoment.changeLocale($rootScope.lang);
        }])
    .constant('angularMomentConfig', {
        timezone: 'Europe/Berlin'
    })
    .config(function (uiGmapGoogleMapApiProvider) {
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
    .config(['ezfbProvider', '$injector', function (ezfbProvider) {
        var myInitFunction = ['$window', '$rootScope', function ($window, $rootScope) {
            $window.FB.init({
                appId: $window.smmConfig.fbClientId,
                version: 'v1.0'
            });

            $rootScope.$broadcast('FB.init');

        }];

        var myLoadSDKFunction = ['$window', '$document', '$rootScope', 'ezfbAsyncInit',
            function ($window,   $document, $rootScope,   ezfbAsyncInit) {
                var locale = $rootScope.lang === 'de' ? 'de_DE' : 'en_GB';
                // Load the SDK's source Asynchronously
                (function(d){
                    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement('script'); js.id = id; js.async = true;
                    js.src = '//connect.facebook.net/' + locale + '/sdk.js';
                    // js.src = '//connect.facebook.net/' + ezfbLocale + '/sdk/debug.js';  // debug
                    ref.parentNode.insertBefore(js, ref);
                }($document[0]));

                $window.fbAsyncInit = ezfbAsyncInit;
            }];

        ezfbProvider.setInitFunction(myInitFunction);
        ezfbProvider.setLoadSDKFunction(myLoadSDKFunction);
    }])
    .config(['$httpProvider',  function($httpProvider){
        //$httpProvider.responseInterceptors.push('HttpProgressInterceptor');
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
    .factory('resourceInterceptor', function($rootScope, $timeout) {
        return {
            response: function (response) {
                $rootScope.success = response;
                $rootScope.success.show = true;
                $timeout(function () {
                    $rootScope.success = null;
                }, 5000);
                return response;
            }
        };
    })
    .factory('myHttpInterceptor', ['$q', '$rootScope', '$cookieStore', '$timeout', function ($q, $rootScope, $cookieStore, $timeout) {
        return {
            responseError: function responseError(rejection) {
                $rootScope.rejection = rejection;
                var types = ['WrongUsernameOrPassword', 'CardException', 'AccountExists', 'VoucherCodeNotValid', 'NotFoundException', 'UserNotFound'];
                $rootScope.handledType = _.include(types, rejection.data.type);
                if (rejection.data.type === 'NoLoggedInUser') {
                    $rootScope.$state.go('login', {notify: false});
                    $cookieStore.remove('session');
                } else {
                    $rootScope.rejection.show = !($rootScope.handledError && $rootScope.handledType);
                }
                $timeout(function () {
                    $rootScope.rejection = null;
                }, 60000);
                return $q.reject(rejection);
            }
        };
    }])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$analyticsProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $analyticsProvider) {

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
            .state('home', {
                url : '/',
                templateUrl: 'views/homepage.html',
                controller : 'GetcardCtrl',
                resolve: {

                    getCities: function(RestApi) {

                        return RestApi.query({route: 'cities'}).$promise;

                    },

                    getDisciplines: function($http) {

                        return $http.get('json/disciplines.json', {cache: true});

                    }

                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('home.classes', {
                templateUrl: 'views/homeClasses.html',
                resolve: {

                    getClasses: function(RestApi) {

                        return RestApi.query({route: 'events'}).$promise;

                    },

                    getOccurrences: function(RestApi) {

                        return RestApi.query({route: 'occurrences', forDurationOfDays: 7, withActiveParent: true}).$promise;

                    },

                    getNeigbourhood: function($http) {

                        return $http.get('json/neigbourhood.json', {cache: true});

                    }

                },
                controller : 'DashboardCtrl'
            })
            .state('signup', {
                url : '/p/signup/:cityId/?invitation',
                templateUrl: 'views/signup.html',
                controller : 'SignupCtrl',
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
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('studio', {
                url : '/p/studio/:studioId/',
                templateUrl: 'views/studio.html',
                controller : 'StudioCtrl',
                resolve: {

                    getStudio: function(RestApi, $stateParams) {

                        return RestApi.get({route: 'studios'}, {id: $stateParams.studioId}).$promise;

                    }

                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
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
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('profile.account', {
                url : 'account/',
                templateUrl: 'views/userAccount.html'
            })
            .state('profile.membership', {
                url : 'membership/',
                templateUrl: 'views/userMembership.html'
            })
            .state('dashboard', {
                url : '/p/kurse/:city/',
                templateUrl: 'views/userDashboard.html',
                controller : 'DashboardCtrl',
                resolve: {

                    getClasses: function(RestApi) {

                        return RestApi.query({route: 'events'}).$promise;

                    },

                    getOccurrences: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'occurrences', forDurationOfDays: 7, cityId: $stateParams.city, withActiveParent: true}).$promise;

                    },

                    getLocations: function(RestApi) {

                        return RestApi.query({route: 'locations'}).$promise;

                    },

                    getStudios: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'studios', cityId: $stateParams.city}).$promise;

                    },

                    getNeigbourhood: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'districts', cityId: $stateParams.city}).$promise;

                    },

                    getCities: function(RestApi) {

                        return RestApi.query({route: 'cities'}).$promise;

                    }


                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('admin', {
                url : '/admin/v2/',
                abstract: true,
                templateUrl: 'views/admin.html',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('admin.classes', {
                url : 'classes/',
                template: '<div ui-view></div>',
                abstract: true,
                resolve: {

                    getLocations: function(RestApi) {

                        return RestApi.query({route: 'locations'}).$promise;

                    },

                    getStudios: function(RestApi) {

                        return RestApi.query({route: 'studios'}).$promise;

                    },

                    getNeigbourhood: function($http) {

                        return $http.get('json/neigbourhood.json', {cache: true});

                    }

                }
            })
            .state('admin.classes.list', {
                url : '',
                templateUrl: 'views/classes.html',
                controller : 'ClassesCtrl',
                resolve: {

                    getClasses: function(RestApi) {

                        return RestApi.query({route: 'events'}).$promise;

                    }

                }
            })
            .state('admin.classes.new', {
                url : 'new/',
                templateUrl: 'views/class.html',
                controller : 'CreateClassCtrl'
            })
            .state('admin.classes.import', {
                url : 'import/',
                templateUrl: 'views/entityImport.html',
                controller :

                    function ($scope, $rootScope, RestApi) {

                        $scope.import = function () {
                            $scope.showSpinner = true;
                            $scope.entities = $scope.csv.result;
                            RestApi.saveList({route: 'events'}, $scope.entities).$promise.then(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                                $rootScope.$state.go('admin.classes.list');
                            });
                        };

                        $scope.csv = {
                            content: null,
                            header: true,
                            test: null,
                            separator: ',',
                            result: null
                        };
                    }
            })
            .state('admin.classes.class', {
                url : ':classId/',
                templateUrl: 'views/class.html',
                resolve: {

                    getClass: function(RestApi, $stateParams) {

                        return RestApi.get({route: 'events'}, {id: $stateParams.classId}).$promise;

                    },

                    getOccurrences: function(RestApi, $stateParams) {

                        return RestApi.query({route: 'occurrences', parentId: $stateParams.classId}).$promise;

                    }

                },
                controller : 'ClassCtrl'
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
                    function ($rootScope, getEntityFields, getNeigbourhood, RestApi, $http, $window, $modal) {

                        $rootScope.fields = getEntityFields.data.entities[$rootScope.$stateParams.route];
                        $rootScope.neigbourhood = getNeigbourhood.data;
                        $rootScope.freeSubscriptionDuarationInMonths = _.range(1,13);
                        $rootScope.discountDuarationInMonths = _.range(1,13);
                        $rootScope.subscriptionType = ['BLACK', 'WHITE', 'LITE'];
                        $rootScope.coverage = ['NONE', 'PARTIAL', 'FULL'];

                        if ($rootScope.$stateParams.route === 'studios') {
                            RestApi.query({route: 'locations'}).$promise.then(function (response) {
                                $rootScope.locations = response;
                            });
                            RestApi.query({route: 'cities'}).$promise.then(function (response) {
                                $rootScope.cities = response;
                                $rootScope.cities.unshift({id:0, defaultName: 'No location'});
                            });
                            $rootScope.upload = function (target) {
                                $rootScope.modalInstance = $modal.open({
                                    templateUrl: 'views/modalUpload.html',
                                    controller: function ($scope, target, id, $window, $modalInstance) {

                                        $scope.target = target;
                                        $scope.id = id;
                                        $scope.$window = $window;
                                        $scope.photo = {};

                                        $scope.close = function () {
                                            $modalInstance.dismiss('close');
                                        };

                                        $scope.changePhotoTitle = function (flow, title) {
                                            flow.opts.target = flow.opts.target + title;
                                        };

                                        $scope.uploader = {
                                            success: function ($flow, $file, $message) {
                                                var message = angular.fromJson($message);
                                                setTimeout(function () {
                                                    $modalInstance.close(message.status);
                                                }, 1000);
                                            }
                                        };


                                    },
                                    backdrop: 'static',
                                    windowClass: 'modal-upload',
                                    resolve: {
                                        target: function () {
                                            return target;
                                        },
                                        id: function () {
                                            return $rootScope.$stateParams.entityId;
                                        }
                                    }
                                }).result.then(function (status) {
                                        if(status === 'success') {
                                            $rootScope.autoscroll = false;
                                            $rootScope.$state.go($rootScope.$state.current, {route: $rootScope.$stateParams.route, entityId: $rootScope.$stateParams.entityId}, {reload: true, inherit: false, notify: true});
                                        }
                                    });
                            };

                            $rootScope.removeCover = function (id) {
                                $http.post($window.smmConfig.restUrlBase + '/api/studios/' + $rootScope.$stateParams.entityId + '/deleteCover?coverId=' + id, {cache: false}).success(function (response) {
                                    console.log(response);
                                    $rootScope.autoscroll = false;
                                    $rootScope.$state.go($rootScope.$state.current, {route: $rootScope.$stateParams.route, entityId: $rootScope.$stateParams.entityId}, {reload: true, inherit: false, notify: true});

                                }).error(function (response, status) {
                                    console.error(response);
                                    console.error(status);
                                });
                            };

                            $rootScope.updateTitle = function (cover) {
                                cover.showSpinner = true;
                                RestApi.update({route: 'covers', id: cover.id}, cover).$promise.then(function (res) {
                                    console.log(res);
                                    cover.showSpinner = false;
                                });
                            };

                        }

                      if ($rootScope.$stateParams.route === 'locations') {
                        RestApi.query({route: 'cities'}).$promise.then(function (response) {
                          $rootScope.cities = response;
                        });
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

                        $rootScope.clearFilters = function () {
                            $rootScope.search = {};
                        };
                        $rootScope.clearFilters();

                        if ($rootScope.$stateParams.route === 'memberships') {
                            $rootScope.clearPhotoFilter = function(){
                                if($rootScope.search.photo === "false"){
                                    delete $rootScope.search.photo;
                                }
                            }
                        }

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

                        $scope.specialFieldType = function (fieldType) {
                            return _.indexOf(['checkbox', 'photo', 'entity'], fieldType) > -1;
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
                            $scope.showSpinner = true;
                            $scope.entity.$save({route: $rootScope.$stateParams.route}).then(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                                $rootScope.$state.go('admin.entity.item', {route: $rootScope.$stateParams.route, entityId: (res.data.id || res.data.code)});
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
                            };
                        }

                    }
            })
            .state('admin.entity.item', {
                url : '/:entityId/',
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
                            $scope.showSpinner = true;
                            $scope.entity.$update({route: $rootScope.$stateParams.route, id: $rootScope.$stateParams.entityId}).then(function (res) {
                                console.log(res);
                                $scope.showSpinner = false;
                            });
                        };

                        $scope.remove = function () {
                            $scope.entity.$delete({route: $rootScope.$stateParams.route, id: $rootScope.$stateParams.entityId}).then(function (res) {
                                console.log(res);
                                $rootScope.$state.go('admin.entity.list', {route: $rootScope.$stateParams.route});
                            });
                        };

                    },
                onEnter: function($rootScope){
                    $rootScope.autoscroll = false;
                },
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }

            })
            .state('more', {
                url : '/p/more/',
                templateUrl: 'views/more.html',
                controller : 'MoreCtrl',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('about', {
                url : '/p/about/',
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('login', {
                url : '/p/login/',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
            .state('reset', {
                url : '/p/password/reset/:token',
                templateUrl: 'views/resetPassword.html',
                controller: 'ResetCtrl',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
            })
	        .state('impressum', {
	            url : '/p/impressum/',
	            templateUrl: 'views/impressum.html',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
	        })
	        .state('faq', {
	            url : '/p/faq/',
	            templateUrl: 'views/faq.html',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
	        })
	        .state('agb', {
	            url : '/p/agb/',
	            templateUrl: 'views/agb.html',
                onExit: function($rootScope){
                    $rootScope.autoscroll = true;
                }
	        });
    }]);
