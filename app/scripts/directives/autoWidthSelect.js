'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:autoWidthSelect
 * @description
 * # autoWidthSelect
 */
angular.module('boltApp')
	.directive('autoWidthSelect', function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				$(element).change(function() {
                    $("#width_tmp").html($(element).find('option:selected').text());
					$(this).width($("#width_tmp").width()-20);
				});
			}
		};
	});
