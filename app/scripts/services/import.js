'use strict';

/**
 * @ngdoc service
 * @name boltApp.Events
 * @description
 * # Events
 * Factory in the boltApp.
 */
angular.module('boltApp.services.websocket', [])
    .factory('ImportData', ['$websocket', '$window',
        function ($websocket, $window) {
            // Open a WebSocket connection
            var dataStream = $websocket($window.smmConfig.restUrlBase.replace('https', 'wss') + '/api/rest/events/bulk');
            var stats = { 'processed': 0, 'total': null };

            dataStream.onMessage(function (message) {
                if (message.data) {
                    stats.processed = JSON.parse(message.data).processed;
                    stats.total = JSON.parse(message.data).total;
                }
            });

            var methods = {
                submit: function (json) {
                    return dataStream.send(json);
                },
                stats: stats,
                close: function() {
                    dataStream.close();
                },
                reload: function() {
                    dataStream.reconnect();
                    stats.processed = 0;
                    stats.total = null;
                }
            };

            return methods;
        }
    ]);
