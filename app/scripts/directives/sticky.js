'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:sticky
 * @description
 * # sticky
 */
angular.module('boltApp')
    .directive('sticky', function($window, $rootScope) {
        return {
            link: function(scope, element, attrs) {

                var $win = angular.element($window);

                if (scope._stickyElements === undefined) {
                    scope._stickyElements = [];

                    $win.bind('scroll.sticky', function() {
                        var pos = $win.scrollTop();
                        for (var i=0; i<scope._stickyElements.length; i++) {

                            var item = scope._stickyElements[i];

                            if (!item.isStuck && pos > item.start) {
                                item.element.addClass('stuck');
                                item.isStuck = true;

                                if (item.placeholder) {
                                    item.placeholder = angular.element('<div></div>')
                                        .css({height: item.element.outerHeight() + 'px'})
                                        .insertBefore(item.element);
                                }
                            }
                            else if (item.isStuck && pos < item.start) {
                                item.element.removeClass('stuck');
                                item.isStuck = false;

                                if (item.placeholder) {
                                    item.placeholder.remove();
                                    item.placeholder = true;
                                }
                            }
                        }
                    });

                    var recheckPositions = function() {
                        for (var i=0; i<scope._stickyElements.length; i++) {
                            var item = scope._stickyElements[i];
                            if (!item.isStuck) {
                                item.start = item.element.offset().top;
                            } else if (item.placeholder) {
                                item.start = item.placeholder.offset().top;
                            }
                        }
                    };
                    $win.bind('load', recheckPositions);
                    $win.bind('resize', recheckPositions);
                    $win.bind('scroll', recheckPositions);
                    $rootScope.$on('$stateChangeSuccess', function() {
                        if($rootScope.$state.includes('main')) {
                            $win.bind('scroll', recheckPositions);
                        } else {
                            $win.unbind('scroll', recheckPositions);
                        }
                    });

                }

                var item = {
                    element: element,
                    isStuck: false,
                    placeholder: attrs.usePlaceholder !== undefined,
                    start: element.offset().top
                };

                return attrs.disable !== 'true' ? scope._stickyElements.push(item) : 0;

            }
        };
    });
