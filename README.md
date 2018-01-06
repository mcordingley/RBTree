# RB Tree

[![Build Status](https://travis-ci.org/mcordingley/RBTree.svg?branch=master)](https://travis-ci.org/mcordingley/RBTree)

Maintains a collection in sorted order. Use this whenever you would otherwise have a collection that gets sorted every
time that a new value is added. Can be used to store elements of any type, be they objects or even identifiers for
objects that are stored elsewhere. See the API documentation below for examples that store and retrieve object IDs, but
keep the collection sorted according to a property on the objects themselves.

Built for use with Vuex, but it should be usable anywhere. If this doesn't work with your favorite tool, please file an
issue with all of the details. Documented pull requests will be merged faster. :)

## Getting Started

If you're using NPM, install `mcordingley/rb-tree`. If you instead want a browser global, just grab `dist/RBTree.js` and
drop it into a script tag. `dist/RBTree.js` is built in UMD style for use with CommonJS, AMD, etc.

If you would instead prefer ES6 style imports, simply `import` from `src/RBTree.js`. `RBTree` is the default and only
export.

## API Documentation

For storing primitive values with an inherent order, just create a new tree. Inserted values will be compared directly
for ordering purposes.

```javascript
const tree = new RBTree();
```

If the sorting logic is more complex or if the inserted values are keys to objects stored elsewhere, pass a comparator
function into the constructor. In this example, the stored values are keys for objects stored in another index. The
objects are retrieved from that other index and the property on which the object keys are to be sorted is compared.

```javascript
const tree = new VuexRBTree((a, b) => {
    const aValue = state.fooById[a].bar,
        bValue = state.fooById[b].bar;

    if (aValue < bValue) return -1;
    else if (aValue > bValue) return 1;
    else return 0;
});
```

New values may be inserted with the `insert` method. Keeping with the above example of storing keys to reference objects
stored elsewhere, the value passed to `insert` should be the key to store. Values inserted that compare as being equal
according to the comparator function are considered to be duplicates and are not inserted.

```javascript
tree.insert(foo.id);
```

Likewise, values may be removed.

```javascript
tree.delete(foo.id);
```

The tree exposes a handful of properties and methods that may be used to query its contents.

The `length` property maintains a count of the number of elements currently in the tree.

```javascript
const elementCount = tree.length;
```

The tree may be queried to see if it contains a value with `contains`.

```javascript
const hasElement = tree.contains(foo.id);
```

The minimum and maximum values can be found with methods of the same name. Pass an integer to instead receive an array
of the top or bottom values in the tree, sorted in order from most extreme to least.

```javascript
const maxValue = tree.maximum(),
    minValue = tree.minimum();

const topFive = tree.maximum(5);
```

The values of the tree are accessible as an array via the `values` method. The values will be in sorted order. This is a
good starting point for using array-based methods, such as `filter`, `each`, and `map`. 

```javascript
const elementArray = tree.values();
```

To efficiently find values that fall within a range, call the `range` method with values that define the start and end
of the desired range. These values may also be replaced with functions that will be called with only the current value
and should return a negative, zero, or positive value to show if the current value is before, directly on, or after the
boundary, respectively.

```javascript
const subArray = tree.range(min.id, id => {
    if (foo(id)) return -1; // id is for a record less than the boundary
    else if (bar(id)) return 1; // id is for a record greater than the boundary
    else return 0; // id lies directly on the boundary and will be included
});
```