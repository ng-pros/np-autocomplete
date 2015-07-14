angular.module('app', ['np-autocomplete'])

.controller('ctrl', ['$scope', function($scope) {
	$scope.countriesOptions = {
		url: 'https://api.github.com/search/repositories',
		nameAttr: 'full_name',
		valueAttr: 'id',
		searchParam: 'q',
		dataHolder: 'items',
		limitParam: 'per_page',
		limit: 5,
		changeDelay: 500,
		additionalLoadingClass: 'has-feedback'
	};
}]);