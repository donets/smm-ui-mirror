'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.city', [])
	.factory('CityFactory', ['RestApi', '$location', '$cookieStore', '$rootScope', '$http', '$q', 'mapStudios',
		function(RestApi, $location, $cookieStore, $rootScope, $http, $q, mapStudios) {
			var rootCity;

			var broadcast = function(CityFactory) {
				$rootScope.$broadcast('CityFactory.update', rootCity);
			};

			var update = function(newState) {
				rootCity = newState;
				broadcast(rootCity);
			};

			var getVariable = function() {
				return rootCity;
			}

			var guessCity = function(cities) {
				var deferred = $q.defer(),
					citiesList = cities,
					city,
					cityId,
					returnObject = {},
					currentCity;
				city = $location.search().city;
				cityId = $cookieStore.get('cityId') || citiesList[0].id;
				var invitation = $location.search().invitation;
				var discipline = $location.search().discipline;
				var disciplinesList = getDisciplines().data;

				if (invitation) {
					$cookieStore.put('invitation', true);
				}
				if (city) {
					currentCity = _.findWhere(citiesList, {
						shortCode: city
					});
					cityId = currentCity && currentCity.id && currentCity.active ? currentCity.id : cityId;
					$cookieStore.put('cityId', cityId);
				} else if (cityId) {
					currentCity = _.findWhere(citiesList, {
						id: cityId
					});
				} else {
					currentCity = disciplinesList.disciplines[discipline];
				}
				returnObject = {
					currentCity: (currentCity || citiesList[0]),
					city: city,
					cityId: cityId
				};
				deferred.resolve(returnObject);
				return deferred.promise;
			};

			var changeCity = function(reqCity, cityList) {
				var deferred = $q.defer(),
					returnObject = {},
					city,
					currentCity,
					supportPhone;
				var citiesList = cityList;


				city = reqCity.shortCode;
				currentCity = _.findWhere(citiesList, {
					shortCode: city
				});

				supportPhone = currentCity.supportPhone;

				RestApi.query({
					route: 'studios',
					cityId: currentCity.id
				}).$promise.then(function(res) {
					return res;
				}).then(function(res) {
					RestApi.query({
						route: 'plans',
						cityId: currentCity.id
					}).$promise.then(function(res1) {
						returnObject.studios = res;
						returnObject.cards = res1;
						deferred.resolve(returnObject);
					});
				});
				mapStudios.create(currentCity);
				return deferred.promise;

			};

			var getDisciplines = function() {
				return $http.get('json/disciplines.json', {
					cache: true
				});
			};

			return {
				update: update,
				rootCity: rootCity,
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
