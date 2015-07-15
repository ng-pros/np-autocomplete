# Np-autocomplete
Np-autocomplete is a full-functional autocomplete (typeahead alternative) AngularJS directive.

### Key Features:
- The easiest to setup.
- 100% compatible and optimised by default for bootstrap 3.3.5+
- Provides 3 models: ngModel, input model and the selected item.
- Uses the transclusion, which gives the flexibility with the input element.
- Customizable in the way you like.
- Multiple states (closed, opened and loading).

### Requirements:
- JQuery 2.1.4+.
- AngularJS 1.3.16+.
- Bootstrap 3.3.5+ (for default template).

### Getting Started:
Download the package, then include **dist/np-autocomplete.min.js** and **dist/np-autocomplete.min.css** in your page.
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

### Attributes:
Attribute | Required | Description
:-------- | :------- | :----------
np-autocomplete | Yes | Passes options object to the directive.
ng-model | No | Holds the value of an attribute of the selected item, e.g. "id".
np-input-model | No | Holds the input element value.
np-selected-item | No  | Holds the whole selected item object.

### Options:
Attribute | Type | Required | Default Value | Example | Description
:-------- | :--- | :------- | :------------ | :------ | :----------
url | String | Yes |  | https://api.github.com/search/repositories | Data source url.
nameAttr | String | No | name | full_name | Defines the attribute which will be shown in the list (usually, it is the search field).
valueAttr | String | No | id | downloads_url | Defines the attribute which will be assigned to the ng-model attribute.
limit | Integer | No | 5 | 10 | Sets the value of the limit query param.
limitParam | String | No | limit | per_page | Query param holds the limit value in requests.
searchParam | String | No | search | query | Query param holds the search text in requests.
delay | Integer | No | 500 (ms) | 1000 (ms) | Time in milliseconds which delays request after changing the search text.
minlength | Integer | No | 2 | 5 | The minimum length of string required before start searching.
clearOnSelect | Boolean | No | false | true | Either clear the search text after selecting an item or not.
template (HTML) | String | No |  |  | Overrides the default template.
templateUrl | String | No |  |  | Gets template with $templateCache to overrides the default template.
itemTemplate (HTML) | String | No |  |  | Overrides the default template of the list item.
itemTemplateUrl | String | No |  |  | Gets template with $templateCache to overrides the default template of the list item.
params | Object | No |  | `{ sort: 'stars' }` | Extra params to send with each request.
closedClass | String | No | np-autocomplete-closed | np-autocomplete-closed closed1 | Class(es) to be added to directive in 'closed' state.
openedClass | String | No | np-autocomplete-opened | np-autocomplete-opened opened1 | Class(es) to be added to directive in 'opened' state.
loadingClass | String | No | np-autocomplete-loading | np-autocomplete-loading loading1 | Class(es) to be added to directive in 'loading' state.
each | Function | No |  | `function(item) {`<br>`console.log(item);`<br>`}` | Iterates over elements of retrived data.
onSelect | Function | No |  | `function(item) {`<br>`console.log(item);`<br>`}` | A callback function called when a selection is made.
onDeselect |Function | No |  | `function() {`<br>`console.log('Lost selection');`<br>`}` | A callback function called when the selection is lost.
onError | Function | No |  | `function(errorData) {`<br>`console.log(errorData);`<br>`}` | A callback function called when an error occurred.
