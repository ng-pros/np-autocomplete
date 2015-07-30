describe('np-autocomplete', function() {
  var $httpBackend, $compile, $timeout, $scope, scope, element, listElement, inputElement;

  beforeEach(module('ng-pros.directive.autocomplete'));

  beforeEach(inject(function(_$httpBackend_, _$compile_, _$timeout_, $rootScope) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;

    $scope = $rootScope.$new();
  }));
});