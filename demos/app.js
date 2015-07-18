angular.module('app', ['ng-pros.directive.autocomplete'])

.controller('ctrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.countriesOptions = {
		url: 'https://api.github.com/search/repositories',
		searchParam: 'q',
		dataHolder: 'items',
		limitParam: 'per_page',
		loadingClass: 'has-feedback'
	};

	$timeout(function() {
		$scope.selectedItem = {
			id: 1,
			name: 'AppDF'
		};
	}, 2000);
}]);