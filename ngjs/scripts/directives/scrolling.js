angular.module('scrolling', [])
	.directive('scrolling', function(){
			var ddo = {};

			ddo.restrict = "E";

			ddo.scope = {
            	titulo: '@'
        	};
        	ddo.transclude = true;

        	ddo.templateUrl = '/scripts/directives/scrolling.html';

			return ddo;
	});