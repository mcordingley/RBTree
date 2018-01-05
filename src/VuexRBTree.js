export default class {
    constructor(comparator) {
        this.comparator = comparator ? comparator : (a, b) => {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
        };

        this._nil = {
            left: null,
            parent: null,
            red: false,
            right: null,
            value: null,
        };

        this._root = this._nil;
        this.length = 0;
    }

    minimum(count) {
        let node = this._minimum(this._root);

        if (typeof count === 'undefined') {
            return node === this._nil ? null : node.value;
        }

        let values = [];

        count = Math.abs(parseInt(count, 10));

        while (node !== this._nil && count) {
            values.push(node.value);

            node = this._successor(node);
            count--;
        }

        return values;
    }

    _minimum(node) {
        while (node.left !== this._nil) {
            node = node.left;
        }

        return node;
    }

    maximum(count) {
        let node = this._maximum(this._root);

        if (typeof count === 'undefined') {
            return node === this._nil ? null : node.value;
        }

        let values = [];

        count = Math.abs(parseInt(count, 10));

        while (node !== this._nil && count) {
            values.push(node.value);

            node = this._predecessor(node);
            count--;
        }

        return values;
    }

    _maximum(node) {
        while (node.right !== this._nil) {
            node = node.right;
        }

        return node;
    }

    insert(value) {
        let node = this._root,
            parent = this._nil;

        const child = {
            left: this._nil,
            parent: this._nil,
            red: true,
            right: this._nil,
            value: value,
        };

        while (node !== this._nil) {
            let compare = this.comparator(value, node.value);
            parent = node;

            if (compare < 0) {
                node = node.left;
            } else if (compare > 0) {
                node = node.right;
            } else {
                return;
            }
        }

        child.parent = parent;

        if (parent === this._nil) {
            this._root = child;
        } else if (this.comparator(child.value, parent.value) < 0) {
            parent.left = child;
        } else {
            parent.right = child;
        }

        this.length++;

        this._insertFixup(child);
    }

    _insertFixup(node) {
        while (node.parent.red) {
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;

                if (uncle.red) {
                    uncle.red = false;

                    node.parent.red = false;
                    node.parent.parent.red = true;

                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;

                        this._leftRotate(node);
                    }

                    node.parent.red = false;
                    node.parent.parent.red = true;

                    this._rightRotate(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent.left;

                if (uncle.red) {
                    uncle.red = false;

                    node.parent.red = false;
                    node.parent.parent.red = true;

                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;

                        this._rightRotate(node);
                    }

                    node.parent.red = false;
                    node.parent.parent.red = true;

                    this._leftRotate(node.parent.parent);
                }
            }
        }

        this._root.red = false;
    }

    _leftRotate(node) {
        const other = node.right;

        node.right = other.left;

        if (other.left !== this._nil) {
            other.left.parent = node;
        }

        other.parent = node.parent;

        if (node.parent === this._nil) {
            this._root = other;
        } else if (node === node.parent.left) {
            node.parent.left = other;
        } else {
            node.parent.right = other;
        }

        other.left = node;
        node.parent = other;
    }

    _rightRotate(node) {
        const other = node.left;

        node.left = other.right;

        if (other.right !== this._nil) {
            other.right.parent = node;
        }

        other.parent = node.parent;

        if (node.parent === this._nil) {
            this._root = other;
        } else if (node === node.parent.right) {
            node.parent.right = other;
        } else {
            node.parent.left = other;
        }

        other.right = node;
        node.parent = other;
    }

    delete(value) {
        const node = this._find(this._root, value);

        if (node === this._nil) {
            return;
        }

        let originalRed = node.red,
            target = null;

        if (node.left === this._nil) {
            target = node.right;

            this._transplant(node, node.right);
        } else if (node.right === this._nil) {
            target = node.left;

            this._transplant(node, node.left);
        } else {
            const other = this._minimum(node.right);

            originalRed = other.red;
            target = other.right;

            if (other.parent === node) {
                target.parent = other;
            } else {
                this._transplant(other, other.right);

                other.right = node.right;
                other.right.parent = other;
            }

            this._transplant(node, other);

            other.left = node.left;
            other.left.parent = other;
            other.red = node.red;
        }

        this.length--;

        if (!originalRed) {
            this._deleteFixup(target);
        }
    }

    _find(node, value) {
        for (
            let compare = node === node._nil ? 0 : this.comparator(value, node.value);
            compare;
            compare = node === node._nil ? 0 : this.comparator(value, node.value)
        ) {
            node = compare < 0 ? node.left: node.right
        }

        return node;
    }

    _transplant(a, b) {
        if (a.parent === this._nil) {
            this._root = b;
        } else if (a === a.parent.left) {
            a.parent.left = b;
        } else {
            a.parent.right = b;
        }

        b.parent = a.parent;
    }

    _deleteFixup(node) {
        while (node !== this._root && !node.red) {
            if (node === node.parent.left) {
                let other = node.parent.right;

                if (other.red) {
                    other.red = false;
                    node.parent.red = true;

                    this._leftRotate(node.parent);

                    other = node.parent.right;
                }

                if (!other.left.red && !other.right.red) {
                    other.red = true;

                    node = node.parent;
                } else {
                    if (!other.right.red) {
                        other.left.red = false;
                        other.red = true;

                        this._rightRotate(other);

                        other = node.parent.right;
                    }

                    other.red = node.parent.red;

                    node.parent.red = false;
                    other.right.red = false;

                    this._leftRotate(node.parent);

                    node = this._root;
                }
            } else {
                let other = node.parent.left;

                if (other.red) {
                    other.red = false;
                    node.parent.red = true;

                    this._rightRotate(node.parent);

                    other = node.parent.left;
                }

                if (!other.left.red && !other.right.red) {
                    other.red = true;

                    node = node.parent;
                } else {
                    if (!other.left.red) {
                        other.right.red = false;
                        other.red = true;

                        this._leftRotate(other);

                        other = node.parent.left;
                    }

                    other.red = node.parent.red;

                    node.parent.red = false;
                    other.left.red = false;

                    this._rightRotate(node.parent);

                    node = this._root;
                }
            }
        }

        node.red = false;
    }

    contains(value) {
        return this._find(this._root, value) !== this._nil;
    }

    values() {
        let values = [],
            node = this._minimum(this._root);

        while (node !== this._nil) {
            values.push(node.value);

            node = this._successor(node);
        }

        return values;
    }

    _successor(node) {
        if (node.right !== this._nil) {
            return this._minimum(node.right);
        }

        let parent = node.parent;

        while (parent !== this._nil && node === parent.right) {
            node = parent;
            parent = parent.parent;
        }

        return parent;
    }

    _predecessor(node) {
        if (node.left !== this._nil) {
            return this._maximum(node.left);
        }

        let parent = node.parent;

        while (parent !== this._nil && node === parent.left) {
            node = parent;
            parent = parent.parent;
        }

        return parent;
    }

    range(least, greatest) {
        if (typeof least !== 'function') {
            least = partial(this.comparator, least);
        }

        if (typeof greatest !== 'function') {
            greatest = partial(this.comparator, greatest);
        }

        let node = this._root,
            parent = this._nil,
            compare;

        while (compare = node === this._nil ? 0 : least(node.value)) {
            parent = node;
            node = compare < 0 ? node.left : node.right;
        }

        if (node === this._nil) {
            node = parent;

            if (node !== this._nil && least(node.value) > 0) {
                node = this._successor(node);
            }
        }

        const range = [];

        while (node !== this._nil && greatest(node.value) >= 0) {
            range.push(node.value);

            node = this._successor(node);
        }

        return range;
    }
}

function partial(func) {
    let bound = Array.prototype.slice.call(arguments, 1);

    return function () {
        let unbound = Array.prototype.slice.call(arguments);

        return func.apply(this, bound.concat(unbound));
    };
}
