YUI.add('gallery-compare', function(Y) {

Y.Compare = function (a, b) {

    if ((a === null && b !== null) ||
        (b === null && a !== null) ||
        (a === undefined && b !== undefined) ||
        (b === undefined && a !== undefined)) {
            return false;
        }

    if (Y.Lang.isFunction(a)) {
        return Y.Compare.functions(a, b);
    } else if (Y.Lang.isArray(a)) {
        return Y.Compare.arrays(a, b);
    } else if (Y.Lang.isObject(a)) {
        return Y.Compare.objects(a, b);
    } else if (a != b) {
        return false;
    } else {
        return true;
    }

};

Y.aggregate(Y.Compare, {

    functions : function (a, b) {
        if (typeof(a) != typeof(b) || (a.toString() != b.toString())) {
            return false;
        }
        return true;
    },

    objects : function (a, b, ignoreKeys) {
        if (!Y.Lang.isObject(a) || !Y.Lang.isObject(b)) {
            return false;
        }
        
        var o, p;

        for(p in a) {
            if (Y.Object.owns(a, p)) {
                o = a[p];

                if (typeof b[p] != typeof o) {
                    return false;
                }

                if (o) {
                    if (!(p in b)) {
                        return false;
                    }
                    if (Y.Lang.isFunction(o)) {
                        if (!Y.Compare.functions(o, b[p])) {
                            return false;
                        }
                    } else if (Y.Lang.isArray(o)) {
                        if (!Y.Compare.arrays(o, b[p])) {
                            return false;
                        }
                    } else if (Y.Lang.isObject(o)) {
                        if (!Y.Compare.objects(o, b[p])) {
                            return false;
                        }
                    } else {
                        if (o != b[p]) {
                            return false;
                        }
                    }
                } else {
                    if (b[p]) {
                        return false;
                    }
                }
            }
        }

        for (p in b) {
            if (!(p in a)) {
                return false;
            }
        }

        return true;
    },

    arrays : function (a, b) {
        if (!Y.Lang.isArray(a) || !Y.Lang.isArray(b)) {
            return false;
        }

        if (a.length != b.length) {
            return false;
        }

        for (var i = 0, l = a.length; i < l; i++) {
            if (Y.Lang.isFunction(a[i])) {
                if (!Y.Compare.functions(a[i], b[i])) {
                    return false;
                }
            } else if (Y.Lang.isArray(a[i])) {
                if (!Y.Compare.arrays(a[i], b[i])) {
                    return false;
                }
            } else if (Y.Lang.isObject(a[i])) {
                if (!Y.Compare.objects(a[i], b[i])) {
                    return false;
                }
            } else {
                if (a[i] != b[i]) {
                    return false;
                }
            }
        }

        return true;
    }

});


}, 'gallery-2011.02.16-20-31' ,{requires:['yui']});
