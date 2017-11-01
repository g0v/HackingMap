# Dynamic tags

## Functionality

This component lets the user input and delete a list of tags. Modified from [an example](http://element.eleme.io/2.0/#/zh-CN/component/tag) of ElementUI tag component.

## Example Usage

`<dynamic-tags v-model="myTags" max="10" min="1"></dynamic-tags>`


## Attributes

| attribute | type | description
| --- | --- | ---
| `value` | String[] | v-model binding value the tags.
| `max` | Number *optional* | Maximun number of tags. If provided, hide input box when length of `value` exceed this number.
| `min` | Number *optional* | Maximun number of tags. If provided, shows *close icons* of tags only if length of `value` is greater then this number.
