YUI.add('gallery-namespace-with-array', function (Y, NAME) {

/**
 * 遇到下级为数字则初始为数组
 * @param {String} namespace 字符串，如 a.b.c
 * @param {Object} v
 * @param {Object} parent
 * @return {Object|false} 若遇到非 L.isValue 的值则返回 false
 */
function namespaceWithArray(namespace, v, parent) {
    var p = parent || this,
        n = namespace.split('.'),
        len = n.length,
        i,
        s;
    for(i = 0; i < n.length; i++) {
        s = n[i];
        if(typeof p[s] === 'undefined' || p[s] === null) {
            if( ! isNaN(parseInt(n[i + 1], 10))) {
                p[s] = [];
            } else {
                p[s] = {};
            }
            // last one
            if((i === len - 1) && typeof v !== 'undefined') {
                p[s] = v;
            }
        } else if(typeof p[s] !== 'object') {
            return false;
        }
        p = p[s];
    }
    return p;
}

Y.namespaceWithArray = namespaceWithArray;



}, 'gallery-2013.03.27-22-06', {"requires": ["yui-base"]});
