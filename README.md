# Np-autocomplete
Np-autocomplete is a full-functional autocomplete (typeahead alternative) AngularJS directive.

### Key Features:
- The easiest to setup.
- 100% compatible and optimised by default for bootstrap 3.3.5+
- Provides 4 models: `ngModel`, `npInputModel`, `npAuto` and `selectedItem`.
- You are free to use built-in angular directives such `ngForm` and `ngRequired`.
- Uses the transclusion, which gives the flexibility with the input element.
- Customizable in the way you like.
- Multiple states (close, open, load and error).

### Requirements:
- JQuery 2.1.4+.
- AngularJS 1.3.16+.
- Bootstrap 3.3.5+ (for default template).

### Getting Started:
Download the package, then include `dist/np-autocomplete.min.js` and `dist/np-autocomplete.min.css` in your page.
```
bower install np-autocomplete --save
```
Now, add it to your angular module dependencies list as the following:
```js
angular.module('yourModule', [
  'ng-pros.directive.autocomplete',
  ...
]);
```

**Note:** if you were using version `1.0.x` then refer to [CHANGELOG](https://github.com/ng-pros/np-autocomplete/blob/master/CHANGELOG.md).

### Quick Usage:
##### html:
```html
<div class="form-group" np-autocomplete="npAutocompleteOptions" ng-model="repoID">
  <label class="control-label">Repository</label>
  <input class="form-control" type="text"/>
</div>
```
##### js:
```js
myAngularApp.controller('ctrl', ['$scope', function($scope) {
  $scope.npAutocompleteOptions = {
    url: 'https://api.github.com/search/repositories'
  };
}]);
```
You can also see the [demos](http://ng-pros.github.io/np-autocomplete/demos.html).

### Attributes:
Attribute | Required | Description
:-------- | :------- | :----------
np-autocomplete | Yes | Passes options object to the directive.
ng-model | No | Holds the value of an attribute of the selected item, e.g. "id".
np-input-model | No | Holds the input element value.
np-selected-item | No  | Holds the whole selected item object.
np-auto | No  | A model which by updating it the following will happen: update np-input-model with its value, clear ng-model, make a request then flushes itself.

### Options:
Attribute | Type | Required | Default Value | Example | Description
:-------- | :--- | :------- | :------------ | :------ | :----------
url | String | Yes |  | http://example.com | Data source url.
nameAttr | String | No | name | full_name | Defines the attribute which will be shown in the list (usually, it is the search field).
valueAttr | String | No | id | downloads_url | Defines the attribute which will be assigned to the ng-model attribute.
limit | Integer | No | 5 | 10 | Sets the value of the limit query param.
limitParam | String | No | limit | per_page | Query param holds the limit value in requests.
searchParam | String | No | search | query | Query param holds the search text in requests.
queryMode | Boolean | No | true | false | Determines if the `searchParam` will be in query mode or param mode, in case it has been set to `false (param mode)` then you should include `:searchParam` string in your url where the search value goes.
delay | Integer | No | 500 (ms) | 1000 (ms) | Time in milliseconds which delays request after changing the search text.
minlength | Integer | No | 1 | 5 | The minimum length of string required before start searching.
dataHoder | String | No |  | items | The name of the field in the retrieved data which holds the array of objects those will be used for the autocomplete.
clearOnSelect | Boolean | No | false | true | Either clear the search text after selecting an item or not.
highlightExactSearch | Boolean | No | true | false | either highlight with exact pattern or each portion separately.
template | String (HTML) | No |  |  | Overrides the default template.
templateUrl | String | No |  |  | Gets template with $templateCache to overrides the default template.
itemTemplate | String (HTML) | No |  |  | Overrides the default template of the list item.
itemTemplateUrl | String | No |  |  | Gets template with $templateCache to overrides the default template of the list item.
params | Object | No |  | `{ sort: 'stars' }` | Extra params to send with each request.
errorMessage | String | No | Something went wrong. | An error occurred. | A message to be shown when an error occur.
noResultsMessage | String | No | No results found. | Couldn't find anything. | A message to be shown when no results found.
listClass | String | No | list-group | list-group np-list | Class(es) to be added to the list.
itemClass | String | No | list-group-item | list-group-item np-list-item | Class(es) to be added to each item in the list.
messageClass | String | No | list-group-item | list-group-item np-message-item | Class(es) to be added to each message item.
highlightClass | String | No | bg-info text-info | np-highlight | Class(es) to be added to the highlighted text.
itemFocusClass | String | No | active | np-active | Class(es) to be added to the focused item.
hasSelectionClass | String | No | np-autocomplete-has-selection | has-selection | Class(es) to be added to the directive wrapper when a selection made.
openStateClass | String | No | np-autocomplete-open | np-autocomplete-open open-state | Class(es) to be added to the directive wrapper in 'open' state.
loadStateClass | String | No | np-autocomplete-load | np-autocomplete-load load-state | Class(es) to be added to the directive wrapper in 'load' state.
closeStateClass | String | No | np-autocomplete-close | np-autocomplete-close close-state | Class(es) to be added to the directive wrapper in 'closed' state.
errorStateClass | String | No | np-autocomplete-error | np-autocomplete-error error-state | Class(es) to be added to the directive wrapper in 'load' state.
each | Function | No |  | `function(item) {`<br>`console.log(item);`<br>`}` | Iterates over elements of retrived data.
onBlur | Function | No |  | `function() {`<br>`console.log('focus lost');`<br>`}` | a callback function called when the directive loses focus.
onError | Function | No |  | `function(errorData) {`<br>`console.log(errorData);`<br>`}` | A callback function called when an error occur.
onSelect | Function | No |  | `function(item) {`<br>`console.log(item);`<br>`}` | A callback function called when a selection is made.
onDeselect |Function | No |  | `function() {`<br>`console.log('Lost selection');`<br>`}` | A callback function called when the selection is lost.
