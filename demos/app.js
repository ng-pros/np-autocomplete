angular.module('app', ['ng-pros.directive.autocomplete'])

.controller('ctrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.inputModel = '';
	$scope.options = {
		url: 'https://api.github.com/search/repositories',
		delay: 0,
		minlength: 1,
		nameAttr: 'name',
		dataHolder: 'items',
		limitParam: 'per_page',
		searchParam: 'q',
		highlightExactSearch: false,
		programmaticallyLoad: true,
		loadingClass: 'has-feedback',
		itemTemplate: '<button type="button" ng-class="getItemClasses($index)" ng-mouseenter="onItemMouseenter($index)" ng-repeat="item in searchResults" ng-click="select(item)">' +
			'<div class="media">' +
			'<div class="media-left">' +
			'<img class="media-object img-circle" ng-src="{{item.owner.avatar_url}}" alt="{{item.owner.login}}" width="48"/>' +
			'</div>' +
			'<div class="media-body">' +
			'<h5 class="media-heading"><strong ng-bind-html="highlight(item.full_name)"></strong></h5>' +
			'<span ng-bind-html="highlight(item.description)"></span>' +
			'</div>' +
			'</div>' +
			'</button>'
	};

	$scope.programmaticallyLoad = function() {
		$scope.autoModel = 'np-autocomplete';
	};

	// $scope.inputModel = 'asdf'

	/*$timeout(function() {
		$scope.selectedItem = {
			id: 1,
			name: 'np-autocomplete'
		};

		// $scope.idModel = 1;
		$scope.inputModel = 'np-autocomplete';
	}, 2000);*/
}]);