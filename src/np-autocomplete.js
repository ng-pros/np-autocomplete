angular.module('ng-pros.directive.autocomplete', [
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

			var id = attrs.id,
				input = null,
				lastVal = '',
				template = null,
				timeoutId = null,
				listElement = null,
				hasSelected = false,
				isKeyPressed = false,
				itemTemplate = null,
				isPasteChange = false,
				pasteTimeoutId = null,
				options = {
					limit: 5,
					delay: 500,
					params: {},
					nameAttr: 'name',
					minlength: 2,
					valueAttr: 'id',
					limitParam: 'limit',
					templateUrl: 'np-autocomplete-template.tpl.html',
					searchParam: 'search',
					closedClass: 'np-autocomplete-closed',
					openedClass: 'np-autocomplete-opened',
					loadingClass: 'np-autocomplete-loading',
					loadingMessage: 'Loading...',
					itemTemplateUrl: 'np-autocomplete-item-template.tpl.html',
					noResultsMessage: 'No results found.',
				},
				open = function() {
					$timeout(function() {
						scope.isOpened = true;

						element.removeClass(options.closedClass);
						element.addClass(options.openedClass);
					}, 100);
				},
				close = function() {
					$timeout(function() {
						scope.isOpened = false;

						element.removeClass(options.openedClass);
						element.addClass(options.closedClass);
					});
				},
				deselect = function() {
					hasSelected = false;

					if (attrs.npSelectedItem)
						scope.npSelectedItem = null;

					if (attrs.ngModel)
						ngModelCtrl.$setViewValue();

					if (options.onDeselect)
						options.onDeselect();
				},
				changeHandler = function() {
					deselect();

					$timeout.cancel(timeoutId);

					timeoutId = $timeout(function() {
						var val = input.val();

						if (attrs.npInputModel)
							scope.npInputModel = val;

						if (val && val.length >= options.minlength) {
							open();

							if (val !== lastVal) {
								scope.searchResults = [];

								scope.isLoading = true;

								element.addClass(options.loadingClass);

								options.params[options.searchParam] = val;

								$http.get(options.url, {
									params: options.params
								}).finally(function() {
									scope.isLoading = false;

									element.removeClass(options.loadingClass);
								}).then(function(response) {
									var data = response.data;

									if (options.dataHolder)
										data = eval('data.' + options.dataHolder);

									if (options.each)
										options.each(data);

									scope.searchResults = data;
								}).catch(function(data) {
									if (options.onError)
										options.onError(data);
								});
							}
						} else {
							close();

							scope.searchResults = [];
						}

						lastVal = val;

					}, options.delay);
				},
				blurHandler = function(evt) {
					if (!angular.element(evt.target).parents('#' + id).length)
						close();
				},
				resize = function() {
					$timeout(function() {
						scope.inputBounds = {
							'top': input.position().top + input.outerHeight(),
							'width': input.outerWidth()
						};
					});
				};

			scope.npAutocomplete = options = angular.extend(options, scope.npAutocomplete);

			if (!id) {
				id = 'np-autocomplete-' + Date.now();
				element.attr('id', id);
			}

			element.addClass('np-autocomplete-wrapper');
			element.addClass(options.closedClass);

			template = angular.element(options.template || $templateCache.get(options.templateUrl));

			itemTemplate = options.itemTemplate || $templateCache.get(options.itemTemplateUrl);

			listElement = template.closest('.np-autocomplete-list');
			listElement.append(itemTemplate);

			element.html($compile(template)(scope));
			element.find('#np-autocomplete-input').replaceWith(transclude());

			resize();

			input = element.find('input');

			options.delay = options.delay > 100 ? options.delay : 100;

			if (options.limit)
				options.params[options.limitParam] = options.limit;

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
				if (lastVal && lastVal.length >= options.minlength && !hasSelected)
					open();
			});

			angular.element(window).on('resize', resize);
			angular.element(document).on('click keyup', blurHandler);

			scope.select = function(item) {
				close();

				hasSelected = true;

				var val = options.clearOnSelect ? '' : eval('item.' + options.nameAttr);

				input.val(lastVal = val);

				if (attrs.ngModel)
					ngModelCtrl.$setViewValue(eval('item.' + options.valueAttr));

				if (attrs.npInputModel)
					scope.npInputModel = val;

				if (attrs.npSelectedItem)
					scope.npSelectedItem = item;

				if (options.onSelect)
					options.onSelect(item);
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
				var regex = new RegExp(lastVal.replace(/([{}()[\]\\.?*+^$|=!:~-])/g, '\\$1'), 'ig'),
					result = val ? val : '';

				return $sce.trustAsHtml(result.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(regex, '<span class="np-autocomplete-match">$&</span>'));
			};

			scope.$on('$destroy', function() {
				angular.element(window).off('resize', resize);
				angular.element(document).off('click keyup', blurHandler);
			});
		}
	};
}]);