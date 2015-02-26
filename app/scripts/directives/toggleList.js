'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:toggleList
 * @description
 * # toggleList
 */
 angular.module('boltApp')
	 .directive('toggleList', function() {
	 	return {
	 		restrict: 'A',
	 		link: function (scope, element) {
	 			var elementClass = $(element).attr('class');
	 			$(element).find('h2').click(function() {
	 				$('.' + elementClass).each(function(index, el) {
	 					$(el).find('p').slideUp('slow');
	 				});
	 				element.find('p').stop().slideDown('slow');
	 			});
	 		}
	 	};
	 });

