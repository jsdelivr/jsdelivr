YUI.add('gallery-nodelist-extras', function(Y) {

/**
 * An expanded collection of methods for Y.NodeList
 *
 * @module gallery-nodelist-extras
 * @class NodeList
 */

var NodeList = Y.NodeList,
    NodeListPrototype = NodeList.prototype,
    _selectorFilter = NodeListPrototype.filter,
    ISSTRING = Y.Lang.isString,
    ISFUNCTION = Y.Lang.isFunction,
    ISNUMBER = Y.Lang.isNumber,
    ISVALUE = Y.Lang.isValue;

/**
 * Filters the NodeList instance to only the matching nodes
 * @method filter
 * @param {string|function} filter A CSS selector string to apply to the list,
 * or a boolean function to apply to each element in the list. The function
 * will be passed three arguments, a Y.Node instance of the current node, the
 * current index in the list, and the NodeList instance.
 * @return {NodeList} NodeList containing the updated collection
 */
NodeListPrototype.filter = function(filter) {
    var newList;
    if (ISSTRING(filter)) {
        return _selectorFilter.apply(this, arguments);
    }
    if (ISFUNCTION(filter)) {
        newList = new NodeList([]);
        this.each(function(node, index, list) {
            if (filter(node, index, list)) {
                newList.push(node);
            }
        });
        return newList;
    }

    Y.log("Unrecognized filter type, returning list");
    return this;
};
/**
 * This inverse of filter. Applies :not to a selector, or builds a NodeList
 * consisting of all the nodes for which the argument is false
 * @method reject
 * @param {string|function} filter A CSS selector string to apply to the list,
 * or a boolean function to apply to each element in the list. The function
 * will be passed three arguments, a Y.Node instance of the current node, the
 * current index in the list, and the NodeList instance.
 * @return {NodeList} NodeList containing the updated collection
 */
NodeListPrototype.reject = function(filter) {
    if (ISSTRING(filter)) {
        return this.filter(function(item) {
                    return !item.test(filter);
                });
    }
    if (ISFUNCTION(filter)) {
        return this.filter(function(item, i, a) {
                    return !filter.call(null, item, i, a);
                });
    }

    Y.log("Unrecognized filter type, returning list");
    return this;
};

/**
 * Returns either the first node in the list, if there is no arugment provided,
 * the first n-items in the list, if provided a numeric argument, or the first
 * item in the list which tests 'true' to the provide boolean function
 * @method first
 * @param {Integer|Function} first The number of items to return or the boolean
 * function to execute against the list.
 * @return {Node|NodeList}
 */
NodeListPrototype.first = function(first) {
    var i, length, currentNode;
    if (!ISVALUE(first)) {
        return this.item(0);
    }
    if (ISNUMBER(first)) {
        return this.slice(0, first);
    }
    if (ISFUNCTION(first)) {
        length = this.size();
        for (i = 0 ; i < length ; i++) {
            currentNode = this.item(i);
            if (first(currentNode)) { return currentNode; }
        }
    }
};

/**
 * Returns either the last node in the list, if there is no arugment provided,
 * the last n-items in the list, if provided a numeric argument, or the last
 * item in the list which tests 'true' to the provide boolean function
 * @method last
 * @param {Integer|Function} last The number of items to return or the boolean
 * function to execute against the list.
 * @return {Node|NodeList}
 */
NodeListPrototype.last = function(last) {
    var i, length, currentNode;
    if (!ISVALUE(last)) {
        return this.item(this.size()-1);
    }
    if (ISNUMBER(last)) {
        return this.slice(-last);
    }
    if (ISFUNCTION(last)) {
        length = this.size();
        for (i = length - 1 ; i >= 0 ; i--) {
            currentNode = this.item(i);
            if (last(currentNode)) { return currentNode; }
        }
    }
};


}, 'gallery-2011.03.16-21-24' ,{requires:['node']});
