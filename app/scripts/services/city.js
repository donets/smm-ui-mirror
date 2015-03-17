'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.city', [])
	.factory('CityFactory', ['RestApi', '$location', '$cookieStore', '$rootScope', '$http', '$q', 'UserMap',
		function(RestApi, $location, $cookieStore, $rootScope, $http, $q, UserMap) {
			var rootCampaign;

			var broadcast = function(CityFactory) {
				$rootScope.$broadcast('CityFactory.update', rootCampaign);
			};

			var update = function(newState) {
				rootCampaign = newState;
				broadcast(rootCampaign);
			};

			var getVariable = function() {
				return rootCampaign;
			}

			var guessCity = function(cities) {
				var deferred = $q.defer(),
					citiesList = cities,
					city,
					cityId,
					returnObject = {},
					campaign;
				city = $location.search().city;
				cityId = $cookieStore.get('cityId') || citiesList[0].id;
				var invitation = $location.search().invitation;
				var discipline = $location.search().discipline;
				var disciplinesList = getDisciplines().data;

				if (invitation) {
					$cookieStore.put('invitation', true);
				}
				if (city) {
					campaign = _.findWhere(citiesList, {
						shortCode: city
					});
					cityId = campaign && campaign.id && campaign.active ? campaign.id : cityId;
					$cookieStore.put('cityId', cityId);
				} else if (cityId) {
					campaign = _.findWhere(citiesList, {
						id: cityId
					});
				} else {
					campaign = disciplinesList.disciplines[discipline];
				}
				returnObject = {
					campaign: (campaign || citiesList[0]),
					city: city,
					cityId: cityId
				};
				deferred.resolve(returnObject);
				return deferred.promise;
				// return(campaign || citiesList[0]);
			};

			var changeCity = function(reqCity, cityList) {
				var deferred = $q.defer(),
					returnObject = {},
					city,
					campaign,
					supportPhone;
				var citiesList = cityList;


				city = reqCity.shortCode;
				campaign = _.findWhere(citiesList, {
					shortCode: city
				});

				supportPhone = campaign.supportPhone;

				RestApi.query({
					route: 'studios',
					cityId: campaign.id
				}).$promise.then(function(res) {
					return res;
				}).then(function(res) {
					RestApi.query({
						route: 'plans',
						cityId: campaign.id
					}).$promise.then(function(res1) {
						returnObject.studios = res;
						returnObject.cards = res1;
						deferred.resolve(returnObject);
					});
				});
				UserMap.create(campaign);
				return deferred.promise;

			};

			var getDisciplines = function() {
				return $http.get('json/disciplines.json', {
					cache: true
				});
			};

			return {
				update: update,
				rootCampaign: rootCampaign,
				guessCity: guessCity,
				changeCity: changeCity,
				getVariable: getVariable,
				getCities: function() {
					return RestApi.query({
						route: 'cities'
					}).$promise;
				}
			};
		}
	]);
