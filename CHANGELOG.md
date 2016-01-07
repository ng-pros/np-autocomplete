## 2.1.0
- New #4: `queryMode` param which determines if the `searchParam` will be in query mode or a param mode.

## 2.0.4
- Bug: fixes #2.

## 2.0.3
- Enh: require `angular` when use with `CommonJS` or `AMD`.
- Enh: add the css to the main in `bower.json` to be `wiredep` friendly.

## 2.0.2
- Bug: fix `each` iterator.

## 2.0.1
- Bug:
  - change the position of list element to `absolute`.
  - unset error state over input change.

## 2.0.0
- Bug:
  - fix resize and repositioning on window resize functionality.
  - passed options object won't be changed so it's possible to pass it to another np-autocomplete.
- Chg:
  - Attributes:
    - `npInputModel` and `ngModel` are not linked with `selectedItem` anymore.
  - Scope Methods:
    - ~~`match`~~: became `highlight`.
  - Scope Properties:
    - ~~`isLoading`~~: became `loading`.
  - Template:
    - list element: `id` and `style` attributes has been added.
    - list element: ~~`class`~~, ~~`ng-style`~~ and ~~`ng-if`~~ attributes has been removed.
    - message items: new one has been added for the error state.
    - message items: `ng-class` attribute has been added.
    - message items: fixed ~~**list-group-item**~~ class has been removed.
    - transclusion element: `id` became **np-autocomplete-transclude**.
    - all angular expressions replaced with `ng-bind`.
  - Item Template:
    - ~~`class`~~: has been removed.
  	- highlight text: wrapper tag changed from ~~`span`~~ to `mark`.
  	- highlight text: fixed ~~**np-autocomplete-match**~~ class has been removed.
  - Params:
    - `openedClass`: became `openStateClass`.
    - `closedClass`: became `closeStateClass`.
    - `loadingClass`: became `loadStateClass`.
    - `loadingMessage`: became `loadStateMessage`.
  - Default param value:
    - `minlength`: **1**.
    - `openStateClass` (~~openedClass~~): **np-autocomplete-open**.
    - `loadStateClass` (~~loadingClass~~): **np-autocomplete-load**.
    - `closeStateClass` (~~closedClass~~): **np-autocomplete-close**.
- New:
  - Core Functionalities:
    - navigation by keyboard arrows.
  - Attributes:
    - `npAuto`: to give the ability to programmatically load.
  - Params:
    - `onBlur`: defines a callback function to be called when the directive loses focus.
    - `listClass`: defines a class or set of classes for the list.
    - `itemClass`: defines a class or set of classes for each item in the list.
    - `messageClass`: defines a class or set of classes for all messages items.
    - `errorStateMessage`: defines the message which will be shown when an error occur.
    - `highlightClass`: defines a class or set of classes for the highlighted texts.
    - `itemFocusClass`: defines a class or set of classes for the focused list item.
    - `errorStateClass`: defines a class or set of classes for error state.
    - `hasSelectionClass`: makes you able to add a class or set of classes when a selection is made.
    - `highlightExactSearch`: decides either highlight with exact pattern or each portion separately.
  - Scope Methods:
  	- `getItemClasses`: returns all desired classes of the item.
    - `onItemMouseenter`: updates `focusedItemIndex` property of scope with currently index of focused item.
  - Scope Properties:
    - `hasError`: holds a boolean whether there is a load error or not.
    - `focusedItemIndex`: holds the current index of the focused item.

## 1.0.5
- Enh: replace keyup and paste jquery events with input.

## 1.0.4
- Bug: updating input value when npInputModel or npSelectedItem is being programaticlly updated.

## 1.0.3
- Bug: trim search text.

## 1.0.2
- Bug: escape regex patterns in highlight and escape html tags from source data.
