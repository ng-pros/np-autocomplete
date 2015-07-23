angular.module('ng-pros.directive.autocomplete', [
	"templates-npAutocomplete"
])

.directive('npAutocomplete', ['$timeout', '$http', '$compile', '$templateCache', '$sce', function($timeout, $http, $compile, $templateCache, $sce) {
	return {
		require: '?ngModel',
		restrict: 'A',
		transclude: true,
		scope: {
			npAuto: '=',
			ngModel: '=',
			npInputModel: '=',
			npSelectedItem: '=',
			npAutocomplete: '='
		},
		link: function(scope, element, attrs, ngModelCtrl, transclude) {
			var id = attrs.id,
				input = null,
				lastVal = '',
				template = null,
				timeoutId = null,
				skipWatch = false,
				closeOnBlur = true,
				listElement = null,
				itemTemplate = null,
				hasSelection = false,
				isListChange = false,
				internalModelChange = false,
				internalInputChange = false,
				options = {
					limit: 5,
					delay: 500,
					params: {},
					nameAttr: 'name',
					minlength: 1,
					valueAttr: 'id',
					listClass: 'list-group',
					itemClass: 'list-group-item',
					limitParam: 'limit',
					templateUrl: 'np-autocomplete-template.tpl.html',
					searchParam: 'search',
					loadStateMessage: 'Loading...',
					messageClass: 'list-group-item',
					errorStateMessage: 'Something went wrong.',
					itemFocusClass: 'active',
					highlightClass: 'bg-info text-info',
					openStateClass: 'np-autocomplete-open',
					loadStateClass: 'np-autocomplete-load',
					errorStateClass: 'has-error',
					closeStateClass: 'np-autocomplete-close',
					itemTemplateUrl: 'np-autocomplete-item-template.tpl.html',
					noResultsMessage: 'No results found.',
					hasSelectionClass: 'has-success',
					highlightExactSearch: true
				},
				open = function() {
					resize();

					listElement.css('display', '');

					element.removeClass(scope.options.closeStateClass);
					element.addClass(scope.options.openStateClass);
				},
				close = function() {
					listElement.css('display', 'none');

					element.removeClass(scope.options.openStateClass);
					element.addClass(scope.options.closeStateClass);
				},
				updateSelectionMode = function(valid) {
					element.removeClass(scope.options.errorStateClass);

					scope.hasError = false;

					if (valid) {
						element.addClass(scope.options.hasSelectionClass);

						if (!hasSelection && scope.options.onSelect)
							scope.options.onSelect(item);
					} else {
						element.removeClass(scope.options.hasSelectionClass);

						if (hasSelection && scope.options.onDeselect)
							scope.options.onDeselect();
					}

					hasSelection = valid;
				},
				flush = function() {
					$timeout.cancel(timeoutId);

					scope.focusedItemIndex = -1;

					if (attrs.npSelectedItem)
						scope.npSelectedItem = null;

					if (attrs.ngModel) {
						internalModelChange = true;

						ngModelCtrl.$setViewValue();
					} else
						updateSelectionMode(false);
				},
				updateInputModel = function() {
					var val = input.val();

					$timeout(function() {
						if (attrs.npInputModel) {
							internalInputChange = true;

							scope.npInputModel = val;
						}
					});

					return val;
				},
				changeHandler = function(evt) {
					flush();

					var val = updateInputModel();

					timeoutId = $timeout(function() {
						if (val && val.length >= scope.options.minlength) {
							if (val !== lastVal) {
								scope.loading = true;
								scope.searchResults = [];

								element.addClass(scope.options.loadStateClass);

								scope.options.params[scope.options.searchParam] = val;

								$http.get(scope.options.url, {
									params: scope.options.params
								}).finally(function() {
									scope.loading = false;

									element.removeClass(scope.options.loadStateClass);
								}).then(function(response) {
									var data = response.data;

									if (scope.options.dataHolder)
										data = eval('data.' + scope.options.dataHolder);

									if (scope.options.each)
										scope.options.each(data);

									scope.searchResults = data;

									scope.focusedItemIndex = 0;
								}).catch(function(data) {
									scope.hasError = true;

									element.addClass(scope.options.errorStateClass);

									if (scope.options.onError)
										scope.options.onError(data);
								});
							}

							open();
						} else {
							close();

							scope.searchResults = [];
						}

						lastVal = val;

					}, !evt ? 0 : scope.options.delay);
				},
				blurHandler = function(evt) {
					if (!angular.element.contains(listElement[0], evt.target) && !isListChange && input[0] !== evt.target) {

						if (closeOnBlur)
							close();

						if (scope.options.onBlur)
							scope.options.onBlur();
					} else
						input.focus();

					isListChange = false;

					closeOnBlur = true;
				},
				focusHandler = function() {
					if (lastVal && lastVal.length >= scope.options.minlength && !hasSelection)
						open();
				},
				resize = function() {
					$timeout(function() {
						var inputOffset = input.offset();

						listElement.css({
							'top': inputOffset.top + input.outerHeight() - angular.element(document).scrollTop(),
							'left': inputOffset.left,
							'width': input.outerWidth()
						});
					});
				},
				focusNextListItem = function() {
					scope.focusedItemIndex = scope.focusedItemIndex < 0 ? 0 : ++scope.focusedItemIndex % scope.searchResults.length;
				};

			// merge options with defaults and initial scope variables.
			scope.options = angular.extend({}, options, scope.npAutocomplete);
			scope.searchResults = [];
			scope.focusedItemIndex = -1;

			scope.options.delay = scope.options.delay > 100 ? scope.options.delay : 100;
			scope.options.params[scope.options.limitParam] = scope.options.limit;

			// set directive id if it has not been set.
			if (!id) {
				id = 'np-autocomplete-' + Date.now();
				element.attr('id', id);
			}

			// configure template.
			template = angular.element(scope.options.template || $templateCache.get(scope.options.templateUrl));

			itemTemplate = scope.options.itemTemplate || $templateCache.get(scope.options.itemTemplateUrl);

			listElement = template.closest('#np-do-not-touch');
			listElement.removeAttr('id');
			listElement.addClass(scope.options.listClass);
			listElement.append(itemTemplate);

			element.html($compile(template)(scope));
			element.find('#np-autocomplete-transclude').replaceWith(transclude());
			element.addClass('np-autocomplete-wrapper');
			element.addClass(scope.options.closeStateClass);

			// find input element.
			input = element.find('input');

			// resize list once.
			resize();

			// jquery events.
			input.on('input', null, null, changeHandler);

			input.keydown(function(evt) {
				var preventDefault = false;

				if (!scope.loading && scope.searchResults.length) {

					preventDefault = true;

					switch (evt.keyCode) {
						case 38:
							scope.focusedItemIndex = scope.focusedItemIndex < 1 ? scope.searchResults.length - 1 : scope.focusedItemIndex - 1;
							break;

						case 40:
							focusNextListItem();
							break;

						case 13:
							scope.select(scope.searchResults[scope.focusedItemIndex]);
							break;

						case 9:
							focusNextListItem();
							break;

						default:
							preventDefault = false;
							break;
					}
				}

				if (!scope.$$phase)
					scope.$apply();

				if (preventDefault)
					evt.preventDefault();
			});

			input.focus(focusHandler);

			angular.element(window).on('resize scroll', resize);
			angular.element(document).on('click keyup', blurHandler);

			// scope methods.
			scope.select = function(item) {
				$timeout.cancel(timeoutId);

				isListChange = true;

				close();

				if (attrs.ngModel)
					ngModelCtrl.$setViewValue(eval('item.' + scope.options.valueAttr));
				else
					updateSelectionMode(true);

				var val = scope.options.clearOnSelect ? '' : eval('item.' + scope.options.nameAttr);

				if (attrs.npInputModel)
					scope.npInputModel = lastVal = val;
				else
					input.val(lastVal = val);

				if (attrs.npSelectedItem)
					scope.npSelectedItem = item;

				var searchResultsLength = scope.searchResults.length;

				for (var i = searchResultsLength - 1; i >= 0; i--) {
					if (angular.equals(item, scope.searchResults[i]))
						scope.searchResults = scope.searchResults.splice(i, 1);
				}
			};

			scope.clear = function() {
				isListChange = true;

				close();

				flush();

				if (attrs.npInputModel) {
					scope.npInputModel = lastVal = '';
				} else
					input.val(lastVal = '');

				scope.searchResults = [];
			};

			scope.highlight = function(val) {
				var pattern = input.val().trim().replace(/([{}()[\]\\.?*+^$|=!:~-])/g, '\\$1'),
					regex = new RegExp(scope.options.highlightExactSearch ? pattern : pattern.replace(/\s+/, '|'), 'ig'),
					result = val ? val : '';

				return $sce.trustAsHtml(result.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(regex, '<mark class="' + scope.options.highlightClass + '">$&</mark>'));
			};

			scope.onItemMouseenter = function(index) {
				scope.focusedItemIndex = index;
			};

			scope.getItemClasses = function(index) {
				var classes = {};

				classes[scope.options.itemClass] = scope.options.itemClass;
				classes[scope.options.itemFocusClass] = scope.options.itemFocusClass && index === scope.focusedItemIndex;

				return classes;
			};

			// models watchers.
			if (attrs.ngModel)
				scope.$watch('ngModel', function(val) {
					if (!internalModelChange) {
						$timeout.cancel(timeoutId);

						close();
					}

					internalModelChange = false;

					updateSelectionMode(!!val);
				});

			if (attrs.npInputModel)
				scope.$watch('npInputModel', function(val) {
					if (!internalInputChange)
						input.val(lastVal = val);

					internalInputChange = false;
				});

			if (attrs.npAuto)
				scope.$watch('npAuto', function(val) {
					if (!skipWatch) {
						skipWatch = true;

						scope.npAuto = null;

						if (val !== input.val()) {
							input.val(val);

							changeHandler();
						} else {
							closeOnBlur = false;

							focusHandler();
						}
					} else
						skipWatch = false;
				});

			// scope events.
			scope.$on('$destroy', function() {
				angular.element(window).off('resize scroll', resize);
				angular.element(document).off('click keyup', blurHandler);
			});
		}
	};
}]);