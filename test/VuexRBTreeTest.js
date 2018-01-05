if (typeof chai === 'undefined') {
    var chai = require('chai');
}

if (typeof VuexRBTree === 'undefined') {
    var VuexRBTree = require('../dist/VuexRBTree');
}

var assert = chai.assert,
    randomIntSequence = [3, 9, 5, 7, 0, 2, 4, 6, 1, 8];

function buildTestTree() {
    var tree = new VuexRBTree();

    randomIntSequence.forEach(function(value) { tree.insert(value) });

    return tree;
}

describe('VuexRBTree', function () {
    it('should initialize with zero length', function () {
        var tree = new VuexRBTree();

        assert.strictEqual(tree.length, 0);
    });

    it('should update length on insertion', function () {
        var tree = buildTestTree();

        assert.strictEqual(tree.length, 10);
    });

    it('should update length on deletion', function () {
        var tree = buildTestTree();

        tree.delete(3);
        tree.delete(5);

        assert.strictEqual(tree.length, 8);
    });

    it('should cast to array with elements in order', function () {
        var tree = buildTestTree();

        var treeValues = tree.values();

        assert.isArray(treeValues);

        treeValues.forEach(function(value, index) { assert.strictEqual(value, index) });
    });

    it('should delete values when asked', function () {
        var tree = buildTestTree();

        tree.delete(3);
        tree.delete(5);

        var treeValues = tree.values();

        assert.isArray(treeValues);

        assert.strictEqual(treeValues[0], 0);
        assert.strictEqual(treeValues[1], 1);
        assert.strictEqual(treeValues[2], 2);
        assert.strictEqual(treeValues[3], 4);
        assert.strictEqual(treeValues[4], 6);
        assert.strictEqual(treeValues[5], 7);
        assert.strictEqual(treeValues[6], 8);
        assert.strictEqual(treeValues[7], 9);
    });

    it('should know what it contains', function () {
        var tree = buildTestTree();

        assert.isTrue(tree.contains(3));
        assert.isTrue(tree.contains(8));
        assert.isFalse(tree.contains(10));
        assert.isFalse(tree.contains(2.5));
    });

    it('should handle range queries', function () {
        var tree = buildTestTree();

        var treeValues = tree.range(2.5, 7);

        assert.isArray(treeValues);

        assert.strictEqual(treeValues[0], 3);
        assert.strictEqual(treeValues[1], 4);
        assert.strictEqual(treeValues[2], 5);
        assert.strictEqual(treeValues[3], 6);
        assert.strictEqual(treeValues[4], 7);
    });

    it('should return the minimal element', function () {
        var tree = buildTestTree();

        assert.strictEqual(tree.minimum(), 0);
    });

    it('should return N minimal elements', function () {
        var tree = buildTestTree(),
            treeValues = tree.minimum(3);

        assert.isArray(treeValues);

        assert.strictEqual(treeValues[0], 0);
        assert.strictEqual(treeValues[1], 1);
        assert.strictEqual(treeValues[2], 2);
    });

    it('should return the maximal element', function () {
        var tree = buildTestTree();

        assert.strictEqual(tree.maximum(), 9);
    });

    it('should return N maximal elements', function () {
        var tree = buildTestTree(),
            treeValues = tree.maximum(3);

        assert.isArray(treeValues);

        assert.strictEqual(treeValues[0], 9);
        assert.strictEqual(treeValues[1], 8);
        assert.strictEqual(treeValues[2], 7);
    });
});
