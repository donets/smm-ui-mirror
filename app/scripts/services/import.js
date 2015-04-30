'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.websocket', [])
    .factory('ImportData', function($websocket) {
        // Open a WebSocket connection
        var dataStream = $websocket('wss://stage-smm-api.herokuapp.com/api/rest/events/bulk');
        var stats = { "processed":0, "total": null };

        dataStream.onMessage(function(message) {
            if (message.data) {
                stats.processed = JSON.parse(message.data).processed;
                stats.total = JSON.parse(message.data).total;
            }
        });

        var methods = {
            submit: function(json) {
                return dataStream.send(json);
            },
            stats: stats
        };

        return methods;
    });
