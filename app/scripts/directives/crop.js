'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:crop
 * @description
 * # crop
 */
angular.module('boltApp')
    .directive('crop', function($window) {
        return {
            restrict: 'A',
            replace: true,
            scope: { src:'@', selected:'&' },
            link: function(scope, element) {
                var myImg;
                var clear = function() {
                    if (myImg) {
                        myImg.next().remove();
                        myImg.remove();
                        myImg = undefined;
                    }
                };
                scope.$watch('src', function(nv) {
                    clear();
                    if (nv) {
                        element.hide();
                        element.after('<img />');
                        myImg = element.next();
                        myImg.attr('src',nv);
                        $(myImg).Jcrop({
                            trackDocument: true,
                            bgFade: true,
                            aspectRatio: scope.$parent.target === 'cover' ? 1.5 : 1,
                            boxWidth: 910,
                            minSize: scope.$parent.target === 'cover' ? [2560, 1708] : [400, 400],
                            setSelect: [0, 0, 150, 150],
                            onSelect: function(x) {

                                console.info(x);

                                if (x.x >= 0 && x.y >= 0 && x.w > 0 && x.h > 0) {

                                    if (scope.$parent.target === 'avatar') {
                                        scope.$parent.$flow.opts.target = $window.smmConfig.restUrlBase + '/api/membership/uploadPhoto' +
                                            '?x=' + Math.floor(x.x) +
                                            '&y=' + Math.floor(x.y) +
                                            '&w=' + Math.floor(x.w) +
                                            '&h=' + Math.floor(x.h);
                                    } else {
                                        scope.$parent.$flow.opts.target = $window.smmConfig.restUrlBase + '/api/studios/' + scope.$parent.id + '/uploadCover' +
                                            '?x=' + Math.floor(x.x) +
                                            '&y=' + Math.floor(x.y) +
                                            '&w=' + Math.floor(x.w) +
                                            '&h=' + Math.floor(x.h) + '&title=';
                                    }
                                }
                            }
                        });
                    }
                });
                scope.$on('$destroy', clear);
            }
        };
    });
