'use strict';

/**
 * @ngdoc directive
 * @name uiApp.directive:togglePopup
 * @description
 * # togglePopup
 */
angular.module('boltApp')
    .directive('togglePopup', ['$document', function($document) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                scope.isPopupVisible = false;

                scope.togglePopup = function(){
                    scope.isPopupVisible = !scope.isPopupVisible;
                };

                $document.bind('click', function(event){
                    var isClickedElementChildOfPopup = element
                        .find(event.target)
                        .length > 0;

                    if (isClickedElementChildOfPopup && element) {
                        return;
                    }

                    scope.isPopupVisible = false;
                    scope.$apply();
                });
            }
        };
    }]);

