# Vuex Red-Black Tree

Maintains a collection in sorted order.

## API Documentation

For storing primitive values with an inherent order, just create a new tree. Inserted values will be compared directly
for ordering purposes.

```javascript
const tree = new VuexRBTree();
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

The minimum and maximum values can be found with methods of the same name.

```javascript
const maxValue = tree.maximum(),
    minValue = tree.minimum();
```

The values of the tree are accessible as an array via the `values` method. The values will be in sorted order. This is a
good starting point for using array-based methods, such as `filter`, `each`, and `map`. 

```javascript
const elementArray = tree.values();
```

To efficiently find values that fall within a range, call the `range` method with values that define the start and end
of the desired range. These values may also be replaced with functions that are called with only the current value and
should return -1, 0, or 1 to define the start and end of the desired range. 

```javascript
const subArray = tree.range(min.id, max.id);
```

The tree is also iterable, so it may directly be used within `for...of` loops.

```javascript
for (let element of tree) {
    //
}
```