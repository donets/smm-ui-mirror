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
				elem.on('click', function() {
					// find the first invalid element
					var firstInvalid = elem.parents('form:first').find('.ng-invalid')[0];

					console.log(firstInvalid);

					// if we find one, set focus
					if (firstInvalid) {
						var scrollEl = $(firstInvalid).offset().top - 200;
						$('html, body').animate({
	                        scrollTop: scrollEl
	                    }, 300);
						// firstInvalid.focus();
					}
				});
			}
		};
	});
