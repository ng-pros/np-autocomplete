angular.module('app', ['ng-pros.directive.autocomplete'])

.controller('ctrl', ['$scope', function($scope) {
	$scope.countriesOptions = {
		url: 'https://api.github.com/search/repositories',
		searchParam: 'q',
		dataHolder: 'items',
		limitParam: 'per_page',
		loadingClass: 'has-feedback'
	};
}]);