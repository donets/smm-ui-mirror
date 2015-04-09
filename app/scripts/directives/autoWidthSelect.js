'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:autoWidthSelect
 * @description
 * # autoWidthSelect
 */
angular.module('boltApp')
	.directive('autoWidthSelect', function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				$(element).change(function() {
                    $('#width_tmp').html($(element).find('option:selected').text());
                    var pad = $rootScope.desktop ? -20 : 7;
					$(this).width($('#width_tmp').width() + pad);
				});
			}
		};
	});
