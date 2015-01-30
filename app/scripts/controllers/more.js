'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:MoreCtrl
 * @description
 * # MoreCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.More', [])
    .controller('MoreCtrl', ['$scope', '$rootScope', '$sce', 'navigator', function ($scope, $rootScope, $sce, navigator) {
        $scope.videoAPI = null;
        $scope.platformMobile = navigator.platform() === 'mobile';
        $scope.video = {
            sources: [
                {src: $sce.trustAsResourceUrl('//assets.so-much-more.de/video/20150130_smm_header.mp4'), type: 'video/mp4'}
            ],
            autoHide: true,
            autoHideTime: 3000,
            autoPlay: false,
            stretch: 'fill',
            responsive: true,
            poster: {
                url: '/images/video_cover.jpg'
            },
            onPlayerReady: function(videoAPI) {
                $scope.videoAPI = videoAPI;
            }
        };
    }]);
