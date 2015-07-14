angular.module('np-autocomplete', [
	"templates-npAutocomplete"
])

.directive('npAutocomplete', ['$timeout', '$http', '$compile', '$templateCache', '$sce', function($timeout, $http, $compile, $templateCache, $sce) {
	return {
		require: '?ngModel',
		restrict: 'A',
		transclude: true,
		scope: {
			npInputModel: '=',
			npSelectedItem: '=',
			npAutocomplete: '=',
		},
		link: function(scope, element, attrs, ngModelCtrl, transclude) {
			element.addClass('np-autocomplete-wrapper');
			element.addClass('np-autocomplete-closed');
			element.addClass(scope.npAutocomplete.additionalClosedClass);

			var id = attrs.id,
				input = null,
				limit = parseInt(scope.npAutocomplete.limit, 10) || false,
				params = {},
				lastVal = null,
				template = $templateCache.get(scope.npAutocomplete.templateUrl) || scope.npAutocomplete.template,
				timeoutId = null,
				limitParam = scope.npAutocomplete.limitParam || 'limit',
				changeDelay = parseInt(scope.npAutocomplete.changeDelay, 10),
				listElement = null,
				hasSelected = false,
				searchParam = scope.npAutocomplete.searchParam || 'search',
				isKeyPressed = false,
				itemTemplate = $templateCache.get(scope.npAutocomplete.itemTemplateUrl) || scope.npAutocomplete.itemTemplate,
				isPasteChange = false,
				pasteTimeoutId = null,
				open = function() {
					$timeout(function() {
						scope.isOpened = true;
						element.removeClass('np-autocomplete-closed');
						element.removeClass(scope.npAutocomplete.additionalClosedClass);
						element.addClass('np-autocomplete-opened');
						element.addClass(scope.npAutocomplete.additionalOpenedClass);
					});
				},
				close = function() {
					$timeout(function() {
						scope.isOpened = false;
						element.removeClass('np-autocomplete-opened');
						element.removeClass(scope.npAutocomplete.additionalOpenedClass);
						element.addClass('np-autocomplete-closed');
						element.addClass(scope.npAutocomplete.additionalClosedClass);
					});
				},
				deselect = function() {
					hasSelected = false;

					if (attrs.selectItem)
						scope.selectItem = null;

					if (attrs.ngModel)
						ngModelCtrl.$setViewValue();

					if (scope.npAutocomplete.onDeselect && typeof scope.npAutocomplete.onDeselect === 'function')
						scope.npAutocomplete.onDeselect();
				},
				changeHandler = function() {
					deselect();

					$timeout.cancel(timeoutId);

					timeoutId = $timeout(function() {
						var val = input.val();

						if (attrs.npInputModel)
							scope.npInputModel = val;

						open();

						if (val) {
							if (val !== lastVal) {
								scope.searchResults = [];

								scope.isLoading = true;

								element.addClass('np-autocomplete-loading');
								element.addClass(scope.npAutocomplete.additionalLoadingClass);

								params[searchParam] = val;

								$http.get(scope.npAutocomplete.url, {
									params: scope.npAutocomplete.params ? angular.extend({}, scope.npAutocomplete.params, params) : params
								}).finally(function() {
									scope.isLoading = false;

									element.removeClass('np-autocomplete-loading');
									element.removeClass(scope.npAutocomplete.additionalLoadingClass);
								}).then(function(response) {
									var data = response.data;

									if (scope.npAutocomplete.map)
										data = scope.npAutocomplete.map(data);
									else if (scope.npAutocomplete.dataHolder)
										data = eval('data.' + scope.npAutocomplete.dataHolder);

									scope.searchResults = data;
								}).catch(function(data) {
									if (scope.npAutocomplete.onError)
										scope.npAutocomplete.onError(data);
								});
							}
						} else {
							close();

							scope.searchResults = [];
						}

						lastVal = val;

					}, changeDelay);
				},
				blurHandler = function(evt) {
					if (!angular.element(evt.target).parents('#' + id).length)
						close();
				};

			if (!id) {
				id = 'np-autocomplete-' + Date.now();
				element.attr('id', id);
			}

			template = angular.element(template || $templateCache.get('np-autocomplete-template.tpl.html'));

			itemTemplate = itemTemplate || $templateCache.get('np-autocomplete-item-template.tpl.html');

			listElement = template.closest('.np-autocomplete-list');
			listElement.append(itemTemplate);

			element.html($compile(template)(scope));
			element.find('#np-autocomplete-input').replaceWith(transclude());

			input = element.find('input');

			$timeout(function() {
				console.log();
				listElement.css('top', input.position().top + input.outerHeight());
				listElement.css('width', input.outerWidth());
			}, 0);

			scope.loadingMessage = scope.npAutocomplete.loadingMessage || 'Loading...';
			scope.noResultsMessage = scope.npAutocomplete.noResultsMessage || 'No results found.';

			changeDelay = changeDelay && changeDelay > 100 ? changeDelay : 100;

			if (limit)
				params[limitParam] = limit;

			input.keydown(function() {
				isKeyPressed = true;
			});

			input.keyup(function() {
				if (!isPasteChange)
					changeHandler();

				isKeyPressed = isPasteChange = false;
			});

			input.on('paste', function(evt) {
				isPasteChange = isKeyPressed;

				$timeout.cancel(pasteTimeoutId);

				pasteTimeoutId = $timeout(changeHandler, 100);
			});

			input.focus(function() {
				if (lastVal && !hasSelected)
					open();
			});

			angular.element(document).on('click keyup', blurHandler);

			scope.selectItem = function(item) {
				close();

				hasSelected = true;

				var val = scope.npAutocomplete.clearOnSelect ? '' : eval('item.' + scope.npAutocomplete.nameAttr);

				input.val(lastVal = val);

				if (attrs.ngModel)
					ngModelCtrl.$setViewValue(eval('item.' + scope.npAutocomplete.valueAttr));

				if (attrs.npInputModel)
					scope.npInputModel = val;

				if (attrs.npSelectedItem)
					scope.npSelectedItem = item;

				if (scope.npAutocomplete.onSelect)
					scope.npAutocomplete.onSelect(item);
			};

			scope.clear = function() {
				close();

				if (attrs.npInputModel)
					scope.npInputModel = null;

				lastVal = '';

				input.val('');

				input.focus();
			};

			scope.match = function(val) {
				var regex = new RegExp(lastVal, 'ig'),
					result = val ? val : '';

				return $sce.trustAsHtml(result.replace(regex, function(match, i) {
					return '<span class="np-autocomplete-match">' + match + '</span>';
				}));
			};

			scope.$on('$destroy', function() {
				angular.element(document).off('click keyup', blurHandler);
			});
		}
	};
}]);