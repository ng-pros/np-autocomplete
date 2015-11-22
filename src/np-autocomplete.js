'use strict';

(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular);
  }
}(window, function(angular) {

  angular.module('ng-pros.directive.autocomplete', [])

  .directive('npAutocomplete', ['$timeout', '$http', '$compile', '$templateCache', '$sce', function($timeout, $http, $compile, $templateCache, $sce) {

    $templateCache.put('np-autocomplete/template.tpl.html',
      '<div id="np-autocomplete-transclude"></div>' +
      '<div id="np-do-not-touch" style="display: none;">' +
      ' <button' +
      '   type="button"' +
      '   ng-click="clear()"' +
      '   ng-class="options.messageClass"' +
      '   ng-bind="options.noResultsMessage"' +
      '   ng-if="!searchResults.length && !loading && !hasError">' +
      ' </button>' +
      ' <button' +
      '   type="button"' +
      '   ng-if="hasError && !loading"' +
      '   ng-click="clear()"' +
      '   ng-class="options.messageClass"' +
      '   ng-bind="options.errorStateMessage">' +
      ' </button>' +
      ' <a' +
      '   ng-if="loading"' +
      '   ng-class="options.messageClass"' +
      '   ng-bind="options.loadStateMessage">' +
      ' </a>' +
      '</div>'
    );

    $templateCache.put('np-autocomplete/item-template.tpl.html',
      '<button type="button"' +
      '  ng-click="select(item)"' +
      '  ng-class="getItemClasses($index)"' +
      '  ng-repeat="item in searchResults"' +
      '  ng-bind-html="highlight($eval(\'item.\' + options.nameAttr))"' +
      '  ng-mouseenter="onItemMouseenter($index)">' +
      '</button>'
    );

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
        var id = attrs.id;
        var input = null;
        var template = null;
        var timeoutId = null;
        var listElement = null;
        var itemTemplate = null;
        var hasSelection = false;
        var isBlurHandlerActive = true;
        var internalModelChange = false;
        var internalInputChange = false;
        var isFocusHandlerActive = true;

        var options = {
          limit: 5,
          delay: 500,
          params: {},
          nameAttr: 'name',
          minlength: 1,
          valueAttr: 'id',
          listClass: 'list-group',
          itemClass: 'list-group-item',
          limitParam: 'limit',
          templateUrl: 'np-autocomplete/template.tpl.html',
          searchParam: 'search',
          messageClass: 'list-group-item',
          itemFocusClass: 'active',
          highlightClass: 'bg-info text-info',
          openStateClass: 'np-autocomplete-open',
          loadStateClass: 'np-autocomplete-load',
          errorStateClass: 'has-error',
          closeStateClass: 'np-autocomplete-close',
          itemTemplateUrl: 'np-autocomplete/item-template.tpl.html',
          noResultsMessage: 'No results found.',
          loadStateMessage: 'Loading...',
          errorStateMessage: 'Something went wrong.',
          hasSelectionClass: 'has-success',
          highlightExactSearch: true
        };

        var open = function() {
          resize();

          listElement.css('display', '');

          element.removeClass(scope.options.closeStateClass);
          element.addClass(scope.options.openStateClass);
        };

        var close = function() {
          listElement.css('display', 'none');

          element.removeClass(scope.options.openStateClass);
          element.addClass(scope.options.closeStateClass);
        };

        var updateSelectionMode = function(valid, item) {
          element.removeClass(scope.options.errorStateClass);

          scope.hasError = false;

          if (valid) {
            element.addClass(scope.options.hasSelectionClass);

            if (item && !hasSelection && scope.options.onSelect) {
              scope.options.onSelect(item);
            }
          } else {
            element.removeClass(scope.options.hasSelectionClass);

            if (hasSelection && scope.options.onDeselect) {
              scope.options.onDeselect();
            }
          }

          hasSelection = valid;
        };

        var flush = function(val) {
          $timeout.cancel(timeoutId);

          scope.focusedItemIndex = -1;

          if (attrs.npSelectedItem) {
            scope.npSelectedItem = null;
          }

          if (attrs.ngModel) {
            internalModelChange = true;

            ngModelCtrl.$setViewValue();
          }

          updateSelectionMode(false);

          val = val !== undefined ? val : input.val();

          if (attrs.npInputModel) {
            internalInputChange = true;

            scope.npInputModel = val;
          }

          $timeout(function() {
            scope.searchResults = [];
          });

          return val;
        };

        var change = function(delay) {
          close();

          var val = flush();

          if (val && val.length >= scope.options.minlength) {
            timeoutId = $timeout(function() {
              scope.loading = true;

              element.addClass(scope.options.loadStateClass);

              open();

              scope.options.params[scope.options.searchParam] = val;

              $http.get(scope.options.url, {
                params: scope.options.params
              }).finally(function() {
                scope.loading = false;

                element.removeClass(scope.options.loadStateClass);
              }).then(function(response) {
                var data = response.data;

                if (scope.options.dataHolder) {
                  data = eval('data.' + scope.options.dataHolder);
                }

                if (scope.options.each) {
                  var resultsLength = data.length;

                  for (var i = 0; i < resultsLength; i++) {
                    scope.options.each(data[i]);
                  }
                }

                scope.searchResults = data;

                scope.focusedItemIndex = 0;
              }).catch(function(data) {
                scope.hasError = true;

                element.addClass(scope.options.errorStateClass);

                if (scope.options.onError) {
                  scope.options.onError(data);
                }
              });

            }, delay);
          }
        };

        var blurHandler = function(evt) {
          if (isBlurHandlerActive && !angular.element.contains(listElement[0], evt.target) && input[0] !== evt.target) {
            close();

            if (scope.options.onBlur) {
              scope.options.onBlur();
            }
          }

          isBlurHandlerActive = true;
        };

        var focusHandler = function() {
          if (isFocusHandlerActive) {
            var val = input.val();

            if (val && val.length >= scope.options.minlength && !hasSelection) {
              open();
            }
          }

          isFocusHandlerActive = true;
        };

        var resize = function() {
          var inputOffset = input.position();

          listElement.css({
            top: inputOffset.top + input.outerHeight(),
            width: input.outerWidth()
          });

          if (listElement.css('direction') === 'ltr') {
            listElement.css('left', inputOffset.left);
          } else {
            listElement.css('right', inputOffset.right);
          }
        };

        var focusNextListItem = function() {
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
        input.on('input', function() {
          change(scope.options.delay);
        });

        input.keydown(function(evt) {
          var preventDefault = false;

          if (!scope.loading && scope.searchResults.length && !hasSelection) {

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

          if (!scope.$$phase) {
            scope.$apply();
          }

          if (preventDefault) {
            evt.preventDefault();
          }
        });

        input.focus(focusHandler);

        angular.element(window).on('resize', resize);
        angular.element(document).on('click keyup', blurHandler);

        // scope methods.
        scope.select = function(item) {
          $timeout.cancel(timeoutId);

          close();

          if (attrs.ngModel) {
            internalModelChange = true;

            ngModelCtrl.$setViewValue(eval('item.' + scope.options.valueAttr));
          }

          updateSelectionMode(true, item);

          var val = scope.options.clearOnSelect ? '' : eval('item.' + scope.options.nameAttr);

          if (attrs.npInputModel) {
            scope.npInputModel = val;
          } else {
            input.val(val);
          }

          if (attrs.npSelectedItem) {
            scope.npSelectedItem = item;
          }

          isFocusHandlerActive = isBlurHandlerActive = false;

          input.focus();
        };

        scope.clear = function() {
          close();

          input.val(flush(''));

          scope.searchResults = [];

          isFocusHandlerActive = false;

          input.focus();
        };

        scope.highlight = function(val) {
          var pattern = input.val().trim().replace(/([{}()[\]\\.?*+^$|=!:~-])/g, '\\$1');
          var regex = new RegExp(scope.options.highlightExactSearch ? pattern : pattern.replace(/\s+/, '|'), 'ig');
          var result = val ? val : '';

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
        if (attrs.ngModel) {
          scope.$watch('ngModel', function(val) {
            if (!internalModelChange) {
              $timeout.cancel(timeoutId);

              // the following checks exact val states so it won't be false in case if ngModel has been set to 0
              updateSelectionMode(val !== undefined && val !== null && val !== '');

              close();
            }

            internalModelChange = false;
          });
        }

        if (attrs.npInputModel) {
          scope.$watch('npInputModel', function(val) {
            if (!internalInputChange) {
              input.val(val);
            }

            internalInputChange = false;
          });
        }

        if (attrs.npAuto) {
          scope.$watch('npAuto', function(val) {
            if (val) {
              $timeout.cancel(timeoutId);

              scope.npAuto = null;

              if (val !== input.val()) {
                input.val(val);

                change(0);

                isFocusHandlerActive = false;
              }

              isBlurHandlerActive = false;

              input.focus();
            }
          });
        }

        // scope events.
        scope.$on('$destroy', function() {
          angular.element(window).off('resize', resize);
          angular.element(document).off('click keyup', blurHandler);
        });
      }
    };
  }]);
}));
