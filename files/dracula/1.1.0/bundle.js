'use strict';

/* eslint-disable */

/*
        Bellman-Ford

    Path-finding algorithm, finds the shortest paths from one node to all nodes.


        Complexity

    O( |E| · |V| ), where E = edges and V = vertices (nodes)


        Constraints

    Can run on graphs with negative edge weights as long as they do not have
    any negative weight cycles.

 */
function bellman_ford(g, source) {
  var i = void 0,
      l = void 0;

  /* STEP 1: initialisation */
  for (var n in g.nodes) {
    g.nodes[n].distance = Infinity;
  }

  /* predecessors are implicitly zero */
  source.distance = 0;

  step('Initially, all distances are infinite and all predecessors are null.');

  /* STEP 2: relax each edge (this is at the heart of Bellman-Ford) */
  /* repeat this for the number of nodes minus one */
  for (i = 1, l = g.nodes.length; i < l; i++) {

    /* for each edge */
    for (var e in g.edges) {
      var edge = g.edges[e];
      if (edge.source.distance + edge.weight < edge.target.distance) {
        step('Relax edge between ' + edge.source.id + ' and ' + edge.target.id + '.');
        edge.target.distance = edge.source.distance + edge.weight;
        edge.target.predecessor = edge.source;
      }
      // Added by Jake Stothard (Needs to be tested)
      // if(!edge.style.directed) {
      // if(edge.target.distance + edge.weight < edge.source.distance) {
      // g.snapShot("Relax edge between " + edge.target.id + " and " + edge.source.id + ".");
      // edge.source.distance = edge.target.distance + edge.weight;
      // edge.source.predecessor = edge.target;
      // }
      // }
    }
  }step('Ready.');

  /* STEP 3: TODO Check for negative cycles */
  /* For now we assume here that the graph does not contain any negative
     weights cycles. (this is left as an excercise to the reader[tm]) */
}
'use strict';

/* eslint-disable */
/*
   A simple binary min-heap serving as a priority queue
   - takes an array as the input, with elements having a key property
   - elements will look like this:
        {
            key: "... key property ...",
            value: "... element content ..."
        }
    - provides insert(), min(), extractMin() and heapify()
    - example usage (e.g. via the Firebug or Chromium console):
        var x = {foo: 20, hui: "bla"};
        var a = new BinaryMinHeap([x,{foo:3},{foo:10},{foo:20},{foo:30},{foo:6},{foo:1},{foo:3}],"foo");
        console.log(a.extractMin());
        console.log(a.extractMin());
        x.foo = 0; // update key
        a.heapify(); // call this always after having a key updated
        console.log(a.extractMin());
        console.log(a.extractMin());
    - can also be used on a simple array, like [9,7,8,5]
 */
function BinaryMinHeap(array, key) {

  /* Binary tree stored in an array, no need for a complicated data structure */
  var tree = [];

  key = key || 'key';

  /* Calculate the index of the parent or a child */
  var parent = function parent(index) {
    return Math.floor((index - 1) / 2);
  };
  var right = function right(index) {
    return 2 * index + 2;
  };
  var left = function left(index) {
    return 2 * index + 1;
  };

  /* Helper function to swap elements with their parent
     as long as the parent is bigger */
  function bubble_up(i) {
    var p = parent(i);
    while (p >= 0 && tree[i][key] < tree[p][key]) {

      /* swap with parent */
      tree[i] = tree.splice(p, 1, tree[i])[0];

      /* go up one level */
      i = p;
      p = parent(i);
    }
  }

  /* Helper function to swap elements with the smaller of their children
     as long as there is one */
  function bubble_down(i) {
    var l = left(i);
    var r = right(i);

    /* as long as there are smaller children */
    while (tree[l] && tree[i][key] > tree[l][key] || tree[r] && tree[i][key] > tree[r][key]) {

      /* find smaller child */
      var child = tree[l] ? tree[r] ? tree[l][key] > tree[r][key] ? r : l : l : l;

      /* swap with smaller child with current element */
      tree[i] = tree.splice(child, 1, tree[i])[0];

      /* go up one level */
      i = child;
      l = left(i);
      r = right(i);
    }
  }

  /* Insert a new element with respect to the heap property
     1. Insert the element at the end
     2. Bubble it up until it is smaller than its parent */
  this.insert = function (element) {

    /* make sure there's a key property */
    if (element[key] === undefined) {
      element = { key: element };
    }

    /* insert element at the end */
    tree.push(element);

    /* bubble up the element */
    bubble_up(tree.length - 1);
  };

  /* Only show us the minimum */
  this.min = function () {
    return tree.length === 1 ? undefined : tree[0];
  };

  /* Return and remove the minimum
     1. Take the root as the minimum that we are looking for
     2. Move the last element to the root (thereby deleting the root)
     3. Compare the new root with both of its children, swap it with the
        smaller child and then check again from there (bubble down)
  */
  this.extractMin = function () {
    var result = this.min();

    /* move the last element to the root or empty the tree completely */
    /* bubble down the new root if necessary */
    if (tree.length === 1) {
      tree = [];
    } else {
      tree[0] = tree.pop();
      bubble_down(0);
    }

    return result;
  };

  /* currently unused, TODO implement */
  this.changeKey = function (index, key) {
    throw 'function not implemented';
  };

  this.heapify = function () {
    var start = void 0;
    for (start = Math.floor((tree.length - 2) / 2); start >= 0; start--) {
      bubble_down(start);
    }
  };

  /* insert the input elements one by one only when we don't have a key property (TODO can be done more elegant) */
  var i = void 0;
  for (i in array || []) {
    this.insert(array[i]);
  }
}
'use strict';

/* eslint-disable */

/*
   Path-finding algorithm Dijkstra

   - worst-case running time is O((|E| + |V|) · log |V| ) thus better than
     Bellman-Ford for sparse graphs (with less edges), but cannot handle
     negative edge weights
 */
function dijkstra(g, source) {

  /* initially, all distances are infinite and all predecessors are null */
  for (var n in g.nodes) {
    g.nodes[n].distance = Infinity;
  } /* predecessors are implicitly null */

  g.snapShot('Initially, all distances are infinite and all predecessors are null.');

  source.distance = 0;

  /* set of unoptimized nodes, sorted by their distance (but a Fibonacci heap
     would be better) */
  var q = new BinaryMinHeap(g.nodes, 'distance');

  /* pointer to the node in focus */
  var node = void 0;

  /* get the node with the smallest distance
     as long as we have unoptimized nodes. q.min() can have O(log n). */
  while (q.min() !== undefined) {

    /* remove the latest */
    node = q.extractMin();
    node.optimized = true;

    /* no nodes accessible from this one, should not happen */
    if (node.distance === Infinity) throw 'Orphaned node!';

    /* for each neighbour of node */
    node.edges.forEach(function (e) {
      var other = node === e.target ? e.source : e.target;

      if (other.optimized) {
        return;
      }

      /* look for an alternative route */
      var alt = node.distance + e.weight;

      /* update distance and route if a better one has been found */
      if (alt < other.distance) {

        /* update distance of neighbour */
        other.distance = alt;

        /* update priority queue */
        q.heapify();

        /* update path */
        other.predecessor = node;
        g.snapShot('Enhancing node.');
      }
    });
  }
}
'use strict';

/* eslint-disable */

/* All-Pairs-Shortest-Paths */
/* Runs at worst in O(|V|³) and at best in Omega(|V|³) :-)
   complexity Sigma(|V|²) */
/* This implementation is not yet ready for general use, but works with the
   Dracula graph library. */
function floyd_warshall(g, source) {

  /* Step 1: initialising empty path matrix (second dimension is implicit) */
  var path = [];
  var next = [];
  var n = g.nodes.length;
  var i = void 0,
      j = void 0,
      k = void 0,
      e = void 0;

  /* construct path matrix, initialize with Infinity */
  for (j in g.nodes) {
    path[j] = [];
    next[j] = [];
    for (i in g.nodes) {
      path[j][i] = j === i ? 0 : Infinity;
    }
  }

  /* initialize path with edge weights */
  for (e in g.edges) {
    path[g.edges[e].source.id][g.edges[e].target.id] = g.edges[e].weight;
  } /* Note: Usually, the initialisation is done by getting the edge weights
       from a node matrix representation of the graph, not by iterating through
       a list of edges as done here. */

  /* Step 2: find best distances (the heart of Floyd-Warshall) */
  for (k in g.nodes) {
    for (i in g.nodes) {
      for (j in g.nodes) {
        if (path[i][j] > path[i][k] + path[k][j]) {
          path[i][j] = path[i][k] + path[k][j];

          /* Step 2.b: remember the path */
          next[i][j] = k;
        }
      }
    }
  }

  /* Step 3: Path reconstruction, get shortest path */
  function getPath(i, j) {
    if (path[i][j] === Infinity) throw 'There is no path.';
    var intermediate = next[i][j];
    if (intermediate === undefined) return null;else return getPath(i, intermediate).concat([intermediate]).concat(getPath(intermediate, j));
  }

  /* TODO use the knowledge, e.g. mark path in graph */
}
'use strict';

/* eslint-disable */

/**
 *
 * @param {Graph} graph
 * @returns {Array}
 */
function topologicalSort(graph) {
    var processed = [],
        unprocessed = [],
        queue = [];

    /**
     *
     * @param arr
     * @param callback
     * @this {Object}
     */
    function each(arr, callback) {
        var i = void 0;

        // if Array, then process as array
        if (arr instanceof Array) {
            for (i = 0; i < arr.length; i++) {
                callback.call(arr[i], i);
            }
        }

        // if object, iterate over property/keys
        else {
                for (i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        callback.call(arr[i], i);
                    }
                }
            }
    }

    function processStartingPoint(node) {
        if (node === undefined) {
            throw 'You have a cycle!!';
        }
        each(node.edges, function () {
            node.sortImportance--;
        });
        processed.push(node);
    }

    var populateIndegreesAndUnprocessed = function populateIndegreesAndUnprocessed() {
        each(graph.nodes, function () {
            var self = this;
            unprocessed.push(this);
            if (!Object.prototype.hasOwnProperty.call(self, 'sortImportance')) {
                self.sortImportance = 0;
            }

            each(self.edges, function () {
                self.sortImportance++;
            });
        });
    };

    populateIndegreesAndUnprocessed();

    while (unprocessed.length > 0) {
        for (var i = 0; i < unprocessed.length; i++) {
            var node = unprocessed[i];
            if (node.sortImportance === 0) {
                queue.push(node);
                unprocessed.splice(i, 1); // Remove this node, its all done.
                i--; // decrement i since we just removed that index from the iterated list;
            } else {
                node.sortImportance--;
            }
        }

        if (queue.length > 0) {
            processStartingPoint(queue.shift());
        }
    }

    return processed;
}
"use strict";

/* eslint-disable */

/*
 * Various algorithms and data structures, licensed under the MIT-license.
 * (c) 2010 by Johann Philipp Strathausen <philipp@stratha.us>
 *
 */

/*
   Ford-Fulkerson

    Max-Flow-Min-Cut Algorithm finding the maximum flow through a directed
    graph from source to sink.


        Complexity

    O(E * max(f)), max(f) being the maximum flow


        Description

    As long as there is an open path through the residual graph, send the
    minimum of the residual capacities on the path.


        Constraints

    The algorithm works only if all weights are integers. Otherwise it is
    possible that the Ford–Fulkerson algorithm will not converge to the maximum
    value.


        Input

    g - Graph object
    s - Source ID
    t - Target (sink) ID


        Output

    Maximum flow from Source s to Target t

 */
/*
        Edmonds-Karp

    Max-Flow-Min-Cut Algorithm finding the maximum flow through a directed
    graph from source to sink. An implementation of the Ford-Fulkerson
    algorithm.


        Complexity

    O(|V|*|E|²)


        Input

    g - Graph object (with node and edge lists, capacity is a property of edge)
    s - source ID
    t - sink ID

 */
function edmonds_karp(g, s, t) {}

/*
    Quick Sort:
        1. Select some random value from the array, the median.
        2. Divide the array in three smaller arrays according to the elements
           being less, equal or greater than the median.
        3. Recursively sort the array containg the elements less than the
           median and the one containing elements greater than the median.
        4. Concatenate the three arrays (less, equal and greater).
        5. One or no element is always sorted.
    TODO: This could be implemented more efficiently by using only one array object and several pointers.
*/
function quickSort(arr) {

  /* recursion anchor: one element is always sorted */
  if (arr.length <= 1) return arr;

  /* randomly selecting some value */
  var median = arr[Math.floor(Math.random() * arr.length)];
  var arr1 = [],
      arr2 = [],
      arr3 = [],
      i = void 0;
  for (i in arr) {
    if (arr[i] < median) {
      arr1.push(arr[i]);
    }
    if (arr[i] === median) {
      arr2.push(arr[i]);
    }
    if (arr[i] > median) {
      arr3.push(arr[i]);
    }
  }

  /* recursive sorting and assembling final result */
  return quickSort(arr1).concat(arr2).concat(quickSort(arr3));
}

/*
   Selection Sort:
   1. Select the minimum and remove it from the array
   2. Sort the rest recursively
   3. Return the minimum plus the sorted rest
   4. An array with only one element is already sorted
   */
function selectionSort(arr) {

  /* recursion anchor: one element is always sorted */
  if (arr.length === 1) return arr;
  var minimum = Infinity;
  var index = void 0;
  for (var i in arr) {
    if (arr[i] < minimum) {
      minimum = arr[i];
      index = i; /* remember the minimum index for later removal */
    }
  }

  /* remove the minimum */
  arr.splice(index, 1);

  /* assemble result and sort recursively (could be easily done iteratively as well)*/
  return [minimum].concat(selectionSort(arr));
}

/*
   Merge Sort:
   1. Cut the array in half
   2. Sort each of them recursively
   3. Merge the two sorted arrays
   4. An array with only one element is considered sorted

*/
function mergeSort(arr) {

  /* merges two sorted arrays into one sorted array */
  function merge(a, b) {

    /* result set */
    var c = [];

    /* as long as there are elements in the arrays to be merged */
    while (a.length > 0 || b.length > 0) {

      /* are there elements to be merged, if yes, compare them and merge */
      var n = a.length > 0 && b.length > 0 ? a[0] < b[0] ? a.shift() : b.shift() : b.length > 0 ? b.shift() : a.length > 0 ? a.shift() : null;

      /* always push the smaller one onto the result set */
      if (n !== null) {
        c.push(n);
      }
    }
    return c;
  }

  /* this mergeSort implementation cuts the array in half, wich should be fine with randomized arrays, but introduces the risk of a worst-case scenario */
  median = Math.floor(arr.length / 2);
  var part1 = arr.slice(0, median); /* for some reason it doesn't work if inserted directly in the return statement (tried so with firefox) */
  var part2 = arr.slice(median - arr.length);
  return arr.length <= 1 ? arr : merge(mergeSort(part1), /* first half */
  mergeSort(part2) /* second half */
  );
}

/* Balanced Red-Black-Tree */
function RedBlackTree(arr) {}

function BTree(arr) {}

function NaryTree(n, arr) {}

/**
 * Knuth-Morris-Pratt string matching algorithm - finds a pattern in a text.
 * FIXME: Doesn't work correctly yet.
 */
function kmp(p, t) {

  /**
   * PREFIX, OVERLAP or FALIURE function for KMP. Computes how many iterations
   * the algorithm can skip after a mismatch.
   *
   * @input p - pattern (string)
   * @result array of skippable iterations
   */
  function prefix(p) {

    /* pi contains the computed skip marks */
    var pi = [0],
        k = 0;
    for (q = 1; q < p.length; q++) {
      while (k > 0 && p.charAt(k) !== p.charAt(q)) {
        k = pi[k - 1];
      }if (p.charAt(k) === p.charAt(q)) {
        k++;
      }

      pi[q] = k;
    }
    return pi;
  }

  /* The actual KMP algorithm starts here. */

  var pi = prefix(p),
      q = 0,
      result = [];

  for (var i = 0; i < t.length; i++) {

    /* jump forward as long as the character doesn't match */
    while (q > 0 && p.charAt(q) !== t.charAt(i)) {
      q = pi[q];
    }if (p.charAt(q) === t.charAt(i)) {
      q++;
    }

    if (q === p.length) {
      result.push(i - p.length);
      q = pi[q];
    }
  }

  return result;
}

/* step for algorithm visualisation */
function step(comment, funct) {
  funct();
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Testing for string or number data type
var isId = function isId(x) {
  return !!~['string', 'number'].indexOf(typeof x === 'undefined' ? 'undefined' : _typeof(x));
};
var edges = 'edges'; // Symbol('edges')
var nodes = 'nodes'; // Symbol('nodes')

/**
 * Graph Data Structure
 */

var Dracula = function () {
  function Dracula() {
    _classCallCheck(this, Dracula);

    this[nodes] = {};
    this[edges] = [];
  }

  /**
   * Creator for the new haters :)
   * @returns {Dracula} a new graph instance
   */


  _createClass(Dracula, [{
    key: 'addNode',


    /**
     * Add node if it doesn't exist yet.
     *
     * This method does not update an existing node.
     * If you want to update a node, just update the node object.
     *
     * @param {string|number|object} id or node data
     * @param {object|} nodeData (optional)
     * @returns {Node} the new or existing node
     */
    value: function addNode(id, nodeData) {
      // Node initialisation shorthands
      if (!nodeData) {
        nodeData = isId(id) ? { id: id } : id;
      } else {
        nodeData.id = id;
      }
      if (!nodeData.id) {
        nodeData.id = (0, _uuid2.default)();
        // Don't create a new node if it already exists
      } else if (this[nodes][nodeData.id]) {
        return this[nodes][nodeData.id];
      }
      this[nodes][nodeData.id] = nodeData;
      return nodeData;
    }

    /**
     * @param {string|number|object} source node or ID
     * @param {string|number|object} target node or ID
     * @param {object|} (optional) edge data, e.g. styles
     * @returns {Edge}
     */

  }, {
    key: 'addEdge',
    value: function addEdge(source, target) {
      var edgeData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var sourceNode = this.addNode(source);
      var targetNode = this.addNode(target);
      edgeData.source = sourceNode;
      edgeData.target = targetNode;
      this[edges].push(edgeData);
      return edgeData;
    }

    /**
     * @param {string|number|Node} node node or ID
     * @return {Node}
     */

  }, {
    key: 'removeNode',
    value: function removeNode(node) {
      var id = isId(node) ? node : node.id;
      node = this[nodes][id];
      // Delete node from index
      delete this[nodes][id];
      // Delete node from all the edges
      this[edges] = this[edges].filter(function (edge) {
        return edge.source !== node && edge.target !== node;
      });
      return node;
    }

    /**
     * Remove an edge by providing either two nodes (or ids) or the edge instance
     * @param {string|number|Node|Edge} node edge, node or ID
     * @param {string|number|Node} node node or ID
     * @return {Edge}
     */

  }, {
    key: 'removeEdge',
    value: function removeEdge(source, target) {
      var found = void 0;
      // Fallback to only one parameter
      if (!target) {
        target = source.target;
        source = source.source;
      }
      // Normalise node IDs
      if (isId(source)) source = { id: source };
      if (isId(target)) target = { id: target };
      // Find and remove edge
      this[edges] = this[edges].filter(function (edge) {
        if (edge.source.id === source.id && edge.target.id === target.id) {
          found = edge;
          return false;
        }
        return true;
      });
      // Return removed edge
      return found;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { nodes: this[nodes], edges: this[edges] };
    }
  }], [{
    key: 'create',
    value: function create() {
      return new Dracula();
    }
  }]);

  return Dracula;
}();

exports.default = Dracula;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dracula = require('./dracula');

var _dracula2 = _interopRequireDefault(_dracula);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Dracula', function () {

  describe('#constructor', function () {

    it('exposes nodes and edges', function () {
      var graph = _dracula2.default.create();
      _assert2.default.equal(Object.keys(graph).length, 2);
    });
  });

  describe('#addNode', function () {

    it('via string ID', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode('bar');
      _assert2.default.deepEqual(node, { id: 'bar' });
    });

    it('via number ID', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode(23);
      _assert2.default.deepEqual(node, { id: 23 });
    });

    it('via object with id', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode({ id: 23 });
      _assert2.default.deepEqual(node, { id: 23 });
    });

    it('via object without id', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode({ foo: 'bar' });
      _assert2.default.deepEqual(_typeof(node.id), 'string');
    });

    it('via id and object', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode(23, { foo: 'bar' });
      _assert2.default.deepEqual(node, { foo: 'bar', id: '23' });
    });

    it('do not replace existing nodes', function () {
      var graph = _dracula2.default.create();
      var n1 = graph.addNode('a');
      var n2 = graph.addNode('a');
      _assert2.default.strictEqual(n1, n2);
    });
  });

  describe('#removeNode', function () {

    it('via id', function () {
      var graph = _dracula2.default.create();
      graph.addNode(23, { foo: 'bar' });
      var node = graph.removeNode(23);
      _assert2.default.deepEqual(node, { foo: 'bar', id: '23' });
      _assert2.default.equal(Object.keys(graph.toJSON().nodes).length, 0);
    });

    it('via node instance', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode(23, { foo: 'bar' });
      var deleted = graph.removeNode(node);
      _assert2.default.deepEqual(node, { foo: 'bar', id: '23' });
      _assert2.default.deepEqual(deleted, { foo: 'bar', id: '23' });
      _assert2.default.equal(Object.keys(graph.toJSON().nodes).length, 0);
    });
  });

  describe('#addEdge', function () {

    it('create edge', function () {
      var graph = _dracula2.default.create();
      var edge = graph.addEdge('a', 'b');
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 1);
    });

    it('create edge with data', function () {
      var graph = _dracula2.default.create();
      var edge = graph.addEdge('a', 'b', { style: 'fancy' });
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' }, style: 'fancy' });
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 1);
    });
  });

  describe('#removeEdge', function () {

    it('remove by providing two node ids', function () {
      var graph = _dracula2.default.create();
      graph.addEdge('a', 'b');
      var edge = graph.removeEdge('a', 'b');
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 0);
    });

    it('remove by providing two nodes', function () {
      var graph = _dracula2.default.create();
      var edge = graph.addEdge('a', 'b');
      var removed = graph.removeEdge({ id: 'a' }, { id: 'b' });
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.deepEqual(removed, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 0);
    });

    it('remove by providing edge', function () {
      var graph = _dracula2.default.create();
      var edge = graph.addEdge('a', 'b');
      var removed = graph.removeEdge(edge);
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.deepEqual(removed, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 0);
    });

    it('remove something else', function () {
      var graph = _dracula2.default.create();
      var edge = graph.addEdge('a', 'b');
      var removed = graph.removeEdge('b', 'c');
      _assert2.default.deepEqual(edge, { source: { id: 'a' }, target: { id: 'b' } });
      _assert2.default.deepEqual(removed, undefined);
      _assert2.default.equal(Object.keys(graph.toJSON().edges).length, 1);
    });
  });

  describe('#toJSON', function () {

    it('represent graph structure', function () {
      var graph = _dracula2.default.create();
      var node = graph.addNode(23);
      var edge = graph.addEdge(23, 'c');
      _assert2.default.deepEqual(node, { id: 23 });
      _assert2.default.deepEqual(edge, { source: { id: 23 }, target: { id: 'c' } });
      _assert2.default.deepEqual(graph.toJSON(), {
        edges: [{ source: { id: 23 }, target: { id: 'c' } }],
        nodes: { 23: { id: 23 }, c: { id: 'c' } }
      });
    });
  });
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _collection = require('lodash/collection');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class for distributing nodes algorithms
 */
var Layout = function () {
  function Layout(graph) {
    _classCallCheck(this, Layout);

    this.graph = graph;
  }

  _createClass(Layout, [{
    key: 'layout',
    value: function layout() {
      this.initCoords();
      this.layoutPrepare();
      this.layoutCalcBounds();
    }
  }, {
    key: 'initCoords',
    value: function initCoords() {
      (0, _collection.each)(this.graph.nodes, function (node) {
        node.layoutPosX = 0;
        node.layoutPosY = 0;
      });
    }
  }, {
    key: 'layoutPrepare',
    value: function layoutPrepare() {
      throw new Error('not implemented');
    }
  }, {
    key: 'layoutCalcBounds',
    value: function layoutCalcBounds() {
      var minx = Infinity;
      var maxx = -Infinity;
      var miny = Infinity;
      var maxy = -Infinity;

      (0, _collection.each)(this.graph.nodes, function (node) {
        var x = node.layoutPosX;
        var y = node.layoutPosY;

        if (x > maxx) maxx = x;
        if (x < minx) minx = x;
        if (y > maxy) maxy = y;
        if (y < miny) miny = y;
      });

      this.graph.layoutMinX = minx;
      this.graph.layoutMaxX = maxx;
      this.graph.layoutMinY = miny;
      this.graph.layoutMaxY = maxy;
    }
  }]);

  return Layout;
}();

exports.default = Layout;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * OrderedTree is like Ordered but assumes there is one root
 * This way we can give non random positions to nodes on the Y-axis
 * It assumes the ordered nodes are of a perfect binary tree
 */
var OrderedTree = function (_Layout) {
  _inherits(OrderedTree, _Layout);

  function OrderedTree(graph, order) {
    _classCallCheck(this, OrderedTree);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OrderedTree).call(this, graph));

    _this.order = order;
    _this.layout();
    return _this;
  }

  _createClass(OrderedTree, [{
    key: 'layoutPrepare',
    value: function layoutPrepare() {
      // To reverse the order of rendering, we need to find out the
      // absolute number of levels we have. simple log math applies.
      var numNodes = this.order.length;
      var totalLevels = Math.floor(Math.log(numNodes) / Math.log(2));

      var counter = 1;
      this.order.forEach(function (node) {
        // Rank aka x coordinate
        var rank = Math.floor(Math.log(counter) / Math.log(2));
        // File relative to top
        var file = counter - Math.pow(rank, 2);

        node.layoutPosX = totalLevels - rank;
        node.layoutPosY = file;
        counter++;
      });
    }
  }]);

  return OrderedTree;
}(_layout2.default);

exports.default = OrderedTree;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _collection = require('lodash/collection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * TODO take ratio into account
 * TODO use integers for speed
 */
var Spring = function (_Layout) {
  _inherits(Spring, _Layout);

  function Spring(graph) {
    _classCallCheck(this, Spring);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Spring).call(this, graph));

    _this.iterations = 500;
    _this.maxRepulsiveForceDistance = 6;
    _this.k = 2;
    _this.c = 0.01;
    _this.maxVertexMovement = 0.5;
    _this.layout();
    return _this;
  }

  _createClass(Spring, [{
    key: 'layout',
    value: function layout() {
      this.layoutPrepare();
      for (var i = 0; i < this.iterations; i++) {
        this.layoutIteration();
      }
      this.layoutCalcBounds();
    }
  }, {
    key: 'layoutPrepare',
    value: function layoutPrepare() {
      (0, _collection.each)(this.graph.nodes, function (node) {
        node.layoutPosX = 0;
        node.layoutPosY = 0;
        node.layoutForceX = 0;
        node.layoutForceY = 0;
      });
    }
  }, {
    key: 'layoutIteration',
    value: function layoutIteration() {
      var _this2 = this;

      // Forces on nodes due to node-node repulsions
      var prev = [];
      (0, _collection.each)(this.graph.nodes, function (node1) {
        prev.forEach(function (node2) {
          _this2.layoutRepulsive(node1, node2);
        });
        prev.push(node1);
      });

      // Forces on nodes due to edge attractions
      this.graph.edges.forEach(function (edge) {
        _this2.layoutAttractive(edge);
      });

      // Move by the given force
      (0, _collection.each)(this.graph.nodes, function (node) {
        var xmove = _this2.c * node.layoutForceX;
        var ymove = _this2.c * node.layoutForceY;

        var max = _this2.maxVertexMovement;

        if (xmove > max) xmove = max;
        if (xmove < -max) xmove = -max;
        if (ymove > max) ymove = max;
        if (ymove < -max) ymove = -max;

        node.layoutPosX += xmove;
        node.layoutPosY += ymove;
        node.layoutForceX = 0;
        node.layoutForceY = 0;
      });
    }
  }, {
    key: 'layoutRepulsive',
    value: function layoutRepulsive(node1, node2) {
      if (!node1 || !node2) {
        return;
      }
      var dx = node2.layoutPosX - node1.layoutPosX;
      var dy = node2.layoutPosY - node1.layoutPosY;
      var d2 = dx * dx + dy * dy;
      if (d2 < 0.01) {
        dx = 0.1 * Math.random() + 0.1;
        dy = 0.1 * Math.random() + 0.1;
        d2 = dx * dx + dy * dy;
      }
      var d = Math.sqrt(d2);
      if (d < this.maxRepulsiveForceDistance) {
        var repulsiveForce = this.k * this.k / d;
        node2.layoutForceX += repulsiveForce * dx / d;
        node2.layoutForceY += repulsiveForce * dy / d;
        node1.layoutForceX -= repulsiveForce * dx / d;
        node1.layoutForceY -= repulsiveForce * dy / d;
      }
    }
  }, {
    key: 'layoutAttractive',
    value: function layoutAttractive(edge) {
      var node1 = edge.source;
      var node2 = edge.target;

      var dx = node2.layoutPosX - node1.layoutPosX;
      var dy = node2.layoutPosY - node1.layoutPosY;
      var d2 = dx * dx + dy * dy;
      if (d2 < 0.01) {
        dx = 0.1 * Math.random() + 0.1;
        dy = 0.1 * Math.random() + 0.1;
        d2 = dx * dx + dy * dy;
      }
      var d = Math.sqrt(d2);
      if (d > this.maxRepulsiveForceDistance) {
        d = this.maxRepulsiveForceDistance;
        d2 = d * d;
      }
      var attractiveForce = (d2 - this.k * this.k) / this.k;
      if (!edge.attraction) edge.attraction = 1;
      attractiveForce *= Math.log(edge.attraction) * 0.5 + 1;

      node2.layoutForceX -= attractiveForce * dx / d;
      node2.layoutForceY -= attractiveForce * dy / d;
      node1.layoutForceX += attractiveForce * dx / d;
      node1.layoutForceY += attractiveForce * dy / d;
    }
  }], [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(this, [null].concat(args)))();
    }
  }]);

  return Spring;
}(_layout2.default);

exports.default = Spring;
'use strict';

var _dracula = require('../dracula');

var _dracula2 = _interopRequireDefault(_dracula);

var _spring = require('./spring');

var _spring2 = _interopRequireDefault(_spring);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Spring Layout', function () {

  var graph = void 0;

  it('should not crash', function () {
    graph = _dracula2.default.create();
    graph.addEdge('a', 'b');
    _spring2.default.create(graph);
  });

  it('have a distance between the nodes', function () {
    var _graph$nodes = graph.nodes;
    var a = _graph$nodes.a;
    var b = _graph$nodes.b;

    var diffX = Math.abs(a.layoutPosX - b.layoutPosX);
    var diffY = Math.abs(a.layoutPosY - b.layoutPosY);
    (0, _assert2.default)(diffX > 0);
    (0, _assert2.default)(diffY > 0);
  });

  it('has layout props', function () {
    (0, _assert2.default)(graph.layoutMinX, 'no min x');
    (0, _assert2.default)(graph.layoutMinY, 'no min y');
    (0, _assert2.default)(graph.layoutMaxX, 'no max x');
    (0, _assert2.default)(graph.layoutMaxY, 'no max y');
  });
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _collection = require('lodash/collection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TournamentTree = function (_Layout) {
  _inherits(TournamentTree, _Layout);

  /**
   * @param {Graph} graph
   * @param {Array[Node]} order
   */
  function TournamentTree(graph, order) {
    _classCallCheck(this, TournamentTree);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TournamentTree).call(this));

    _this.graph = graph;
    _this.order = order;
    _this.layout();
    return _this;
  }

  _createClass(TournamentTree, [{
    key: 'layout',
    value: function layout() {
      this.layoutPrepare();
      this.layoutCalcBounds();
    }
  }, {
    key: 'layoutPrepare',
    value: function layoutPrepare() {
      (0, _collection.each)(this.graph.nodes, function (node) {
        node.layoutPosX = 0;
        node.layoutPosY = 0;
      });

      // To reverse the order of rendering, we need to find out the
      // absolute number of levels we have. simple log math applies.
      var numNodes = this.order.length;
      var totalLevels = Math.floor(Math.log(numNodes) / Math.log(2));

      var counter = 1;
      this.order.forEach(function (node) {
        var depth = Math.floor(Math.log(counter) / Math.log(2));
        var offset = Math.pow(2, totalLevels - depth);
        var final_x = offset + (counter - Math.pow(2, depth)) * Math.pow(2, totalLevels - depth + 1);
        node.layoutPosX = final_x;
        node.layoutPosY = depth;
        counter++;
      });
    }
  }]);

  return TournamentTree;
}(_layout2.default);

exports.default = TournamentTree;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raphael = require('raphael');

var _raphael2 = _interopRequireDefault(_raphael);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Is not bundled for the standalone browser version (e.g. for CDN)
var Raphael = typeof window !== 'undefined' && window.Raphael || _raphael2.default;

var dragify = function dragify(shape) {
  var r = shape.paper;
  shape.items.forEach(function (item) {
    item.set = shape;
    if (item.type === 'text') {
      return;
    }
    item.node.style.cursor = 'move';
    item.drag(function dragMove(dx, dy, x, y) {
      dx = this.set.ox;
      dy = this.set.oy;
      var bBox = this.set.getBBox();
      var newX = x - dx + (bBox.x + bBox.width / 2);
      var newY = y - dy + (bBox.y + bBox.height / 2);
      var clientX = x - (newX < 20 ? newX - 20 : newX > r.width - 20 ? newX - r.width + 20 : 0);
      var clientY = y - (newY < 20 ? newY - 20 : newY > r.height - 20 ? newY - r.height + 20 : 0);
      this.set.translate(clientX - Math.round(dx), clientY - Math.round(dy));
      shape.connections.forEach(function (connection) {
        connection.draw();
      });

      this.set.ox = clientX;
      this.set.oy = clientY;
    }, function dragEnter(x, y) {
      this.set.ox = x;
      this.set.oy = y;
      this.animate({ 'fill-opacity': 0.2 }, 500);
    }, function dragOut() {
      this.animate({ 'fill-opacity': 0.0 }, 500);
    });
  });
};

var RaphaelRenderer = function (_Renderer) {
  _inherits(RaphaelRenderer, _Renderer);

  function RaphaelRenderer(element, graph, width, height) {
    _classCallCheck(this, RaphaelRenderer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RaphaelRenderer).call(this, element, graph, width, height));

    _this.canvas = Raphael(_this.element, _this.width, _this.height);
    _this.lineStyle = {
      stroke: '#443399',
      'stroke-width': '2px'
    };
    return _this;
  }

  _createClass(RaphaelRenderer, [{
    key: 'drawNode',
    value: function drawNode(node) {
      var color = Raphael.getColor();
      // TODO update / cache shape
      node.shape = this.canvas.set();
      node.shape.connections = [];
      node.shape.push(this.canvas.ellipse(0, 0, 30, 20).attr({ stroke: color, 'stroke-width': 2, fill: color, 'fill-opacity': 0 })).push(this.canvas.text(0, 30, node.label || node.id)).translate(node.point[0], node.point[1]);
      // .drag(move, dragger, up)
      dragify(node.shape);
    }
  }, {
    key: 'drawEdge',
    value: function drawEdge(edge) {
      if (!edge.shape) {
        edge.shape = this.canvas.connection(edge.source.shape, edge.target.shape);
        // edge.shape.line.attr(this.lineStyle)
        edge.source.shape.connections.push(edge.shape);
        edge.target.shape.connections.push(edge.shape);
      }
    }
  }]);

  return RaphaelRenderer;
}(_renderer2.default);

// <Raphael.fn.connection>

/* coordinates for potential connection coordinates from/to the objects */


exports.default = RaphaelRenderer;
var getConnectionPoints = function getConnectionPoints(obj1, obj2) {

  /* get bounding boxes of target and source */
  var bb1 = obj1.getBBox();
  var bb2 = obj2.getBBox();

  var off1 = 0;
  var off2 = 0;

  return [

  /* NORTH 1 */
  { x: bb1.x + bb1.width / 2, y: bb1.y - off1 },

  /* SOUTH 1 */
  { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + off1 },

  /* WEST  1 */
  { x: bb1.x - off1, y: bb1.y + bb1.height / 2 },

  /* EAST  1 */
  { x: bb1.x + bb1.width + off1, y: bb1.y + bb1.height / 2 },

  /* NORTH 2 */
  { x: bb2.x + bb2.width / 2, y: bb2.y - off2 },

  /* SOUTH 2 */
  { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + off2 },

  /* WEST  2 */
  { x: bb2.x - off2, y: bb2.y + bb2.height / 2 },

  /* EAST  2 */
  { x: bb2.x + bb2.width + off2, y: bb2.y + bb2.height / 2 }];
};

Raphael.fn.connection = function Connection(obj1, obj2, style) {
  var self = this;

  /* create and return new connection */
  var edge = {

    /* eslint-disable complexity */
    draw: function draw() {

      var p = getConnectionPoints(obj1, obj2);

      /* distances between objects and according coordinates connection */
      var d = {};
      var dis = [];
      var dx = void 0;
      var dy = void 0;

      /*
       * find out the best connection coordinates by trying all possible ways
       */
      /* loop the first object's connection coordinates */
      for (var i = 0; i < 4; i++) {

        /* loop the second object's connection coordinates */
        for (var j = 4; j < 8; j++) {
          dx = Math.abs(p[i].x - p[j].x);
          dy = Math.abs(p[i].y - p[j].y);
          if (i === j - 4 || (i !== 3 && j !== 6 || p[i].x < p[j].x) && (i !== 2 && j !== 7 || p[i].x > p[j].x) && (i !== 0 && j !== 5 || p[i].y > p[j].y) && (i !== 1 && j !== 4 || p[i].y < p[j].y)) {
            dis.push(dx + dy);
            d[dis[dis.length - 1].toFixed(3)] = [i, j];
          }
        }
      }
      var res = dis.length === 0 ? [0, 4] : d[Math.min.apply(Math, dis).toFixed(3)];

      /* bezier path */
      var x1 = p[res[0]].x;
      var y1 = p[res[0]].y;
      var x4 = p[res[1]].x;
      var y4 = p[res[1]].y;
      dx = Math.max(Math.abs(x1 - x4) / 2, 10);
      dy = Math.max(Math.abs(y1 - y4) / 2, 10);
      var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
      var y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
      var x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
      var y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

      /* assemble path and arrow */
      var path = ['M' + x1.toFixed(3), y1.toFixed(3), 'C' + x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(',');

      /* arrow */
      if (style && style.directed) {
        (function () {
          // magnitude, length of the last path vector
          var mag = Math.sqrt((y4 - y3) * (y4 - y3) + (x4 - x3) * (x4 - x3));
          // vector normalisation to specified length
          var norm = function norm(x, l) {
            return -x * (l || 5) / mag;
          };
          // calculate array coordinates (two lines orthogonal to the path vector)
          var arr = [{
            x: (norm(x4 - x3) + norm(y4 - y3) + x4).toFixed(3),
            y: (norm(y4 - y3) + norm(x4 - x3) + y4).toFixed(3)
          }, {
            x: (norm(x4 - x3) - norm(y4 - y3) + x4).toFixed(3),
            y: (norm(y4 - y3) - norm(x4 - x3) + y4).toFixed(3)
          }];
          path = path + ',M' + arr[0].x + ',' + arr[0].y + ',L' + x4 + ',' + y4 + ',L' + arr[1].x + ',' + arr[1].y;
        })();
      }

      /* function to be used for moving existent path(s), e.g. animate() or attr() */
      var move = 'attr';

      /* applying path(s) */
      if (edge.fg) {
        edge.fg[move]({ path: path });
      } else {
        edge.fg = self.path(path).attr({ stroke: style && style.stroke || '#000', fill: 'none' }).toBack();
      }
      if (edge.bg) {
        edge.bg[move]({ path: path });
      } else if (style && style.fill && style.fill.split) {
        edge.bg = self.path(path).attr({
          stroke: style.fill.split('|')[0],
          fill: 'none',
          'stroke-width': style.fill.split('|')[1] || 3
        }).toBack();
      }

      /* setting label */
      if (style && style.label) {
        if (edge.label) {
          edge.label.attr({ x: (x1 + x4) / 2, y: (y1 + y4) / 2 });
        } else {
          edge.label = self.text((x1 + x4) / 2, (y1 + y4) / 2, style.label).attr({
            fill: '#000',
            'font-size': style['font-size'] || '10px',
            'fill-opacity': '0.6'
          });
        }
      }

      if (style && style.label && style['label-style'] && edge.label) {
        edge.label.attr(style['label-style']);
      }

      if (style && style.callback) {
        style.callback(edge);
      }
    }
  };
  edge.draw();
  return edge;
};

// </Raphael.fn.connection>
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _collection = require('lodash/collection');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class for rendering nodes
 *
 * Can transform coordinates to fit onto the canvas
 */
var Renderer = function () {

  /**
   * @param {DomElement|String} element target dom element or querySelector
   * @param {Graph} graph Dracula Graph instance
   * @param {number} width (optional) width of the canvas, default 400
   * @param {number} height (optional) height of the canvas, default 300
   */
  function Renderer(element, graph, width, height) {
    _classCallCheck(this, Renderer);

    this.graph = graph;
    // Convert a query into a dom element
    if (typeof element === 'string') {
      var selector = typeof $ !== 'undefined' ? $ : function (q) {
        return document.querySelector(q);
      };
      element = selector(element);
    }
    this.element = element;
    this.width = width || 400;
    this.height = height || 300;
    this.radius = 40;
  }

  /**
   * Scale the nodes within the canvas dimensions
   * Keep a distance to the canvas edges of half a node radius
   */


  _createClass(Renderer, [{
    key: 'draw',
    value: function draw() {
      var _this = this;

      this.factorX = (this.width - 2 * this.radius) / (this.graph.layoutMaxX - this.graph.layoutMinX);

      this.factorY = (this.height - 2 * this.radius) / (this.graph.layoutMaxY - this.graph.layoutMinY);

      (0, _collection.each)(this.graph.nodes, function (node) {
        node.point = _this.translate([node.layoutPosX, node.layoutPosY]);
        _this.drawNode(node);
      });
      (0, _collection.each)(this.graph.edges, function (edge) {
        _this.drawEdge(edge);
      });
    }
  }, {
    key: 'translate',
    value: function translate(point) {
      return [Math.round((point[0] - this.graph.layoutMinX) * this.factorX + this.radius), Math.round((point[1] - this.graph.layoutMinY) * this.factorY + this.radius)];
    }
  }, {
    key: 'drawNode',
    value: function drawNode(node) {
      // eslint-disable-line no-unused-vars
      throw new Error('not implemented');
    }
  }, {
    key: 'drawEdge',
    value: function drawEdge(edge) {
      // eslint-disable-line no-unused-vars
      throw new Error('not implemented');
    }
  }], [{
    key: 'render',
    value: function render() {
      for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
        a[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(Renderer, [null].concat(a)))();
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;
'use strict';

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graphMock = {
  layoutMinX: 0,
  layoutMaxX: 10,
  layoutMinY: -6,
  layoutMaxY: 10,
  edges: [{}],
  nodes: {
    1: { layoutPosX: 3, layoutPosY: 4 },
    2: {}
  }
};

var domEl = {};

describe('Renderer', function () {

  describe('#constructor', function () {

    it('using document querySelector', function () {
      var origDoc = global.document;
      var spyDoc = _sinon2.default.spy();
      // Document stub
      global.document = { querySelector: spyDoc };
      _renderer2.default.render('#element', graphMock);
      (0, _assert2.default)(spyDoc.calledOnce);
      global.document = origDoc;
    });

    it('using jQuery', function () {
      var origJQ = global.$;
      var spyJQ = _sinon2.default.spy();
      // jQuery stub
      global.$ = spyJQ;
      _renderer2.default.render('#element', graphMock);
      (0, _assert2.default)(spyJQ.calledOnce);
      global.$ = origJQ;
    });

    it('using dom element', function () {
      var origDoc = global.document;
      var spyDoc = _sinon2.default.spy();

      var origJQ = global.$;
      var spyJQ = _sinon2.default.spy();

      _renderer2.default.render(domEl, graphMock);

      (0, _assert2.default)(!spyJQ.called);
      (0, _assert2.default)(!spyDoc.called);

      global.document = origDoc;
      global.$ = origJQ;
    });

    it('set default width and height', function () {
      var renderer = _renderer2.default.render(domEl, graphMock);
      _assert2.default.equal(renderer.width, 400);
      _assert2.default.equal(renderer.height, 300);
    });
  });

  describe('#draw', function () {
    var renderer = _renderer2.default.render(domEl, graphMock);
    renderer.drawNode = _sinon2.default.spy();
    renderer.drawEdge = _sinon2.default.spy();
    renderer.draw();

    it('set factorX and factorY', function () {
      _assert2.default.equal(renderer.factorX, 32);
      _assert2.default.equal(renderer.factorY, 13.75);
    });

    it('calls drawNode', function () {
      (0, _assert2.default)(renderer.drawNode.called);
    });

    it('calls drawEdge', function () {
      (0, _assert2.default)(renderer.drawEdge.called);
    });
  });

  describe('#translate', function () {
    _renderer2.default.render(domEl, graphMock);

    it('scales coordinates into frame', function () {
      _assert2.default.deepEqual(graphMock.nodes[1].point, [136, 178]);
    });
  });
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _snapsvg = require('snapsvg');

var _snapsvg2 = _interopRequireDefault(_snapsvg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RaphaelRenderer = function (_Renderer) {
  _inherits(RaphaelRenderer, _Renderer);

  function RaphaelRenderer(element, graph, width, height) {
    _classCallCheck(this, RaphaelRenderer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RaphaelRenderer).call(this, element, graph, width, height));

    _this.canvas = new _snapsvg2.default(_this.width, _this.height, element);
    _this.lineStyle = {
      stroke: '#abcdef',
      'stroke-width': '2px'
    };
    return _this;
  }

  _createClass(RaphaelRenderer, [{
    key: 'drawNode',
    value: function drawNode(node) {
      // TODO update / cache shape
      node.shape = this.canvas.circle(node.point[0], node.point[1], 10);
    }
  }, {
    key: 'drawEdge',
    value: function drawEdge(edge) {
      var p1 = edge.source.point;
      var p2 = edge.target.point;
      edge.shape = this.canvas.line(p1[0], p1[1], p2[0], p2[1]);
      edge.shape.attr(this.lineStyle);
    }
  }]);

  return RaphaelRenderer;
}(_renderer2.default);

exports.default = RaphaelRenderer;
