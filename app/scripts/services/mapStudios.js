'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.mapStudios', [])
  .factory('mapStudios', ['RestApi', '$location', '$cookieStore', '$rootScope', '$http', 'uiGmapGoogleMapApi',
    function(RestApi, $location, $cookieStore, $rootScope, $http, uiGmapGoogleMapApi) {


      var create = function(city) {
        RestApi.query({
          route: 'locations',
          cityId: city.id
        }).$promise.then(function(res) {
          $rootScope.locations = _.reject(res, function(obj) {
            return obj.latitude === null || obj.longitude === null;
          });
          _.map($rootScope.locations, function(obj) {
            obj.icon = '/images/marker.svg';
          });
        });
        uiGmapGoogleMapApi.then(function() {

          $rootScope.map = {
            center: {
              latitude: city.lat,
              longitude: city.lon
            },
            zoom: 12,
            options: {
              mapTypeControl: false,
              overviewMapControl: false,
              panControl: false,
              zoomControl: true,
              streetViewControl: true,
              scrollwheel: false
            }
          };

          var markerIcon = new Image().src = '/images/marker.svg';
          var markerIconHover = new Image().src = '/images/marker-hover.svg';

          $rootScope.markerEvents = {
            mouseover: function(marker, eventName, model) {
              marker.setIcon(markerIconHover);
              model.show = true;
            },
            mouseout: function(marker, eventName, model) {
              marker.setIcon(markerIcon);
              model.show = false;
            }
          };

        });
      }

      return {
        create: create
      }

    }
  ]);
