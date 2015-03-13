'use strict';

/**
* @ngdoc service
* @name boltApp.Events
* @description
* # Events
* Factory in the boltApp.
*/
angular.module('boltApp.services.city', [])
.factory('CityFactory', ['RestApi', '$location', '$cookieStore', '$rootScope', '$http',
function(RestApi, $location, $cookieStore, $rootScope, $http) {
    var studios,
    cards;
    var guessCity = function(cities) {
        var citiesList = cities;
        $rootScope.city = $location.search().city;
        $rootScope.cityId = $cookieStore.get('cityId') || citiesList[0].id;
        var invitation = $location.search().invitation;
        var discipline = $location.search().discipline;
        var disciplinesList = getDisciplines().data;

        if (invitation) {
            $cookieStore.put('invitation', true);
        }
        if ($rootScope.city) {
            $rootScope.campaign = _.findWhere(citiesList, {shortCode: $rootScope.city});
            $rootScope.cityId = $rootScope.campaign && $rootScope.campaign.id && $rootScope.campaign.active ? $rootScope.campaign.id : $rootScope.cityId;
            $cookieStore.put('cityId', $rootScope.cityId);
        }
        else if ($rootScope.cityId) {
            $rootScope.campaign = _.findWhere(citiesList, {id: $rootScope.cityId});
        }
        else {
            $rootScope.campaign = disciplinesList.disciplines[discipline];
        }
        return($rootScope.campaign || citiesList[0]);
    };

    var changeCity = function(city, cityList) {
        console.log(city);
        var citiesList = cityList;

        $rootScope.city = city.shortCode;
        $rootScope.campaign = _.findWhere(citiesList, {shortCode: $rootScope.city});
        $rootScope.supportPhone = $rootScope.campaign.supportPhone;

        RestApi.query({route: 'studios', cityId: $rootScope.campaign.id}).$promise.then(function (res) {
            studios = res;
        });
        RestApi.query({route: 'plans', cityId: $rootScope.campaign.id}).$promise.then(function (res) {
            cards = res;
        });
        return [studios, cards];
    }

    var getDisciplines = function() {
        return $http.get('json/disciplines.json', {cache: true});
    }


    return {
        guessCity: guessCity,
        changeCity: changeCity,
        getCities: function() {
            return RestApi.query({route: 'cities'}).$promise;
        }
    }
}]);
