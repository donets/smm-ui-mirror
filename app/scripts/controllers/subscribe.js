'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SubscribeCtrl
 * @description
 * # SubscribeCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Subscribe', [])
    .controller('SubscribeCtrl', [ '$scope', '$rootScope', '$window', '$http', 'CityFactory', '$cookieStore', function ($scope, $rootScope, $window, $http, CityFactory, $cookieStore) {

        $scope.getCurentCity = function() {
            CityFactory.getCities().then(function(res) {
				$scope.citiesList = _.sortBy(res, 'id').filter(function(c) {
					return c.countryCode === $rootScope.countryCode;
				});
                $scope.currentCity = $scope.citiesList[0];
			});
            $scope.$on('CityFactory.update', function() {
                var currentCityVar = CityFactory.getVariable();
                $scope.currentCity = _.findWhere($scope.citiesList, {id: currentCityVar.id});
            });
        };

        $scope.getCurentCity();


        $scope.subscribe = function() {
            $scope.loadingUpdate = true;
            $scope.successUpdate = false;
            $scope.errorUpdate = false;
            var newsletter = {
                email: $scope.email,
                newsletter: true,
                landingUrl: $cookieStore.get('landingUrl'),
                lang: $rootScope.lang,
                cityId: $scope.currentCity.id
            };
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', newsletter).success(function () {
                $scope.loadingUpdate = false;
                $scope.successUpdate = true;
                $scope.email = '';
                $scope.form.$setPristine();
                $window.ga('set', 'dimension1', '1');
                $window.ga('send', 'event', 'content', 'signup_app_waitlist');
                $.getScript('//www.googleadservices.com/pagead/conversion_async.js').done( function() {
                    $window.google_trackConversion({
                        google_conversion_id: 970072239,
                        google_conversion_language: 'de',
                        google_conversion_format: '3',
                        google_conversion_color: 'ffffff',
                        google_conversion_label: 'fiXPCMmi_wkQr8HIzgM',
                        google_remarketing_only: false
                    });
                    $window.google_trackConversion({
                        google_conversion_id: 968958845,
                        google_conversion_language: 'de',
                        google_conversion_format: '3',
                        google_conversion_color: 'ffffff',
                        google_conversion_label: 'GgJECOPfhgsQ_caEzgM',
                        google_remarketing_only: false
                    });
                });
            }).error(function (response, status) {
                $scope.loadingUpdate = false;
                $scope.errorUpdate = true;
                console.error(status);
            });
        };

    }]);
