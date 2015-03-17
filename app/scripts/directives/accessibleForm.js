'use strict';

/**
 * @ngdoc directive
 * @name boltApp.directive:accessibleForm
 * @description
 * # toggleList
 */
angular.module('boltApp')
	.directive('accessibleForm', function() {
		return {
			restrict: 'A',
			link: function(scope, elem) {

				// set up event handler on the form element
				elem.on('submit', function() {

					// find the first invalid element
					var firstInvalid = angular.element(
						elem[0].querySelector('.ng-invalid'))[0];

					// if we find one, set focus
					if (firstInvalid) {
						firstInvalid.focus();
					}
				});
			}
		};
	});
