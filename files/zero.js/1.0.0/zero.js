/* Zero 1.0.0 - zero detect event ajax form fx callbacks deferred */




var Zero = (function() {
    var undefined, key, classList, arr = Array.prototype, slice = arr.slice, filter = arr.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagIdClassSelectorRE = /^(?:#([\w-]+)*|(\w+)|\.([\w-]+))$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        class2type = {},
        toString = class2type.toString,
        uniq,
        tempParent = document.createElement('div')

    // getComputedStyle shouldn't freak out when called
    // without a valid element as argument
    try {
        getComputedStyle(undefined)
    } catch(e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function(element){
            try {
                return nativeGetComputedStyle(element)
            } catch(e) {
                return null
            }
        }
    }

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }

    function isFunction(value)  { return type(value) == "function" }
    function isWindow(obj)      { return obj != null && obj == obj.window }
    function isDocument(obj)    { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
    function isObject(obj)      { return type(obj) == "object" }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }
    function isArray(value) { return value instanceof Array }
    function likeArray(obj) { return typeof obj.length == 'number' }

    function compact(array) { return filter.call(array, function(item){ return item != null }) }
    function flatten(array) { return array.length > 0 ? arr.concat.apply([], array) : array }
    function camelize(str)  { return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }
    uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

    function classRE(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getComputedStyle(element, '').getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }

    function children(element) {
        return 'children' in element ?
            slice.call(element.children) :
            $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
    }

    // `Zero` is the base object. When calling this
    // function just call `$.init`, which makes the implementation
    // details of selecting nodes and creating Zero collections
    // patchable in plugins.
    Zero = function(selector, context){
        return new $.init(selector, context)
    }
    var $ = Zero // Alias

    // `$.isZ` should return `true` if the given object is a Zero
    // collection. This method can be overriden in plugins.
    $.isZ = function(object) {
        return object instanceof Zero
    }

    $.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.msMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~$.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }

    // `$.fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    $.fragment = function(html, name, properties) {
        var dom, nodes, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = document.createElement(RegExp.$1)

        if (!dom) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
            if (!(name in containers)) name = '*'

            container = containers[name]
            container.innerHTML = '' + html
            dom = $.each(slice.call(container.childNodes), function(){
                container.removeChild(this)
            })
        }

        if (isPlainObject(properties)) {
            nodes = $(dom)
            $.each(properties, function(key, value) {
                if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                else nodes.attr(key, value)
            })
        }

        return dom
    }

    // `$.init` is Zero's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overriden in plugins.
    $.init = function(selector, context) {
        var dom
        // If nothing given, return an empty Zero collection
        if (!selector) return this
        // If the selector is a string, assume its a query selector or html fragment
        else if (type(selector) === "string"){
            // If it's a html fragment, create nodes from it
            if ((selector = selector.trim()) && selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
                fragmentRE.test(selector)
                dom = $.fragment(selector, RegExp.$1, context), selector = null
            }
            // If there's a context, create a collection on that context first, and select
            // nodes from there
            else if (context !== undefined) return $(context).find(selector)
            // And last but no least, if it's a CSS selector, use it to select nodes.
            else dom = $.qsa(document, selector)
        }
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zero collection is given, just return it
        else if ($.isZ(selector)) return selector
        else if (isArray(selector)) dom = selector
        // Wrap DOM nodes.
        else if (isObject(selector)) dom = [selector], selector = null
        else return this

        dom = dom || []
        dom = isArray(dom) ? dom : [dom]
        $.merge(this, dom)
        this.selector = selector || ''
    }

    function extend(target, source, deep) {
        for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {}
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
    }

    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
    }

    // `$.qsa` is Zero's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overriden in plugins.
    $.qsa = function(root, selector) {
		var node
        if (root.nodeType !== 1 && root.nodeType !== 9) return []
		if (tagIdClassSelectorRE.test(selector)) {
            if (RegExp.$2) return slice.call(root.getElementsByTagName(RegExp.$2))
            else if (RegExp.$3) return slice.call(root.getElementsByClassName(RegExp.$3))
            else if (RegExp.$1) {
                if (isDocument(root)) return ((node = root.getElementById(RegExp.$1)) ? [node] : [])
                else if (root.ownerDocument && (node = root.ownerDocument.getElementById(RegExp.$1))) return [node]
            }
            else if (RegExp.$_.length == 1) return []
        }
        return slice.call(root.querySelectorAll(selector))

	}

    function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
    }

    $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
    }

    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }

    function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }

    // access className property while respecting SVGAnimatedString
    function className(node, value){
        var klass = node.className,
            svg = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }

    // "true"    => true
    // "false" => false
    // "null"    => null
    // "42"        => 42
    // "42.5"    => 42.5
    // JSON        => parse if valid
    // String    => self
    function deserializeValue(value) {
        var num
        try {
            return value ?
                value == "true" ||
                ( value == "false" ? false :
                    value == "null" ? null :
                    !isNaN(num = Number(value)) ? num :
                    /^[\[\{]/.test(value) ? $.parseJSON(value) :
                    value )
                : value
        } catch(e) {
            return value
        }
    }

    $.type = type
    $.isFunction = isFunction
    $.isWindow = isWindow
    $.isArray = isArray
    $.isPlainObject = isPlainObject

    $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
    }

    $.inArray = function(elem, array, i){
        return arr.indexOf.call(array, elem, i)
    }

    $.camelCase = camelize
    $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
    }

    // plugin compatibility
    $.uuid = 0
    $.support = { }
    $.expr = { }

    $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i)
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback(elements[key], key)
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
    }

    $.merge = function( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length
        
        for ( ; j < len; j++ ) first[i++] = second[j]
        
        first.length = i
        
        return first
    }

    $.grep = function(elements, callback){
        return filter.call(elements, callback)
    }

    if (window.JSON) $.parseJSON = JSON.parse

    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
    })

    // Define methods that will be available on all
    // Zero collections
    $.fn = $.init.prototype = $.prototype = {
        // Allow fetching of the length directly on the Zero object
        get length() { return this._length || 0 },
        set length(n) {
            var len = this._length
            if (len > n) arr.reduce.call(this, len - (n - len), (n - len))
            this._length = n
        },

        noop: function(){},

        // Have to define custom versions of these to work on the context
        forEach: arr.forEach,
        reduce: arr.reduce,
        push: arr.push,
        sort: arr.sort,
        indexOf: arr.indexOf,
        concat: arr.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
            return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
            return $(slice.apply(this, arguments))
        },

        ready: function(callback){
            if (readyRE.test(document.readyState)) callback($)
            else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
            return this
        },
        get: function(idx){
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
            return this.length
        },
        remove: function(){
            return this.each(function(){
                if (this.parentNode != null)
                    this.parentNode.removeChild(this)
            })
        },
        each: function(callback){
            arr.every.call(this, function(el, idx){
                return callback.call(el, idx, el) !== false
            })
            return this
        },
        filter: function(selector){
            if (isFunction(selector)) return this.not(this.not(selector))
            return $(filter.call(this, function(element){
                return $.matches(element, selector)
            }))
        },
        add: function(selector,context){
            return $(uniq(arr.concat(this.get(), $(selector,context).get())))
        },
        is: function(selector){
            return this.length > 0 && $.matches(this[0], selector)
        },
        not: function(selector){
            var nodes=[]
            if (isFunction(selector) && selector.call !== undefined)
                this.each(function(idx){
                    if (!selector.call(this,idx)) nodes.push(this)
                })
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                this.forEach(function(el){
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return $(nodes)
        },
        has: function(selector){
            return this.filter(function(){
                return isObject(selector) ?
                    $.contains(this, selector) :
                    $(this).find(selector).size()
            })
        },
        eq: function(idx){
            return $(idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1))
        },
        first: function(){
            var el = this[0]
            return el && !isObject(el) ? el : $(el)
        },
        last: function(){
            var el = this[this.length - 1]
            return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
            var result, $this = this
            if (typeof selector == 'object')
                result = $(selector).filter(function(){
                    var node = this
                    return arr.some.call($this, function(parent){
                        return $.contains(parent, node)
                    })
                })
            else if (this.length == 1) result = $($.qsa(this[0], selector))
            else result = this.map(function(){ return $.qsa(this, selector) })
            return result
        },
        closest: function(selector, context){
            var node = this[0], collection = false
            if (typeof selector == 'object') collection = $(selector)
            while (node && !(collection ? collection.indexOf(node) >= 0 : $.matches(node, selector)))
                node = node !== context && !isDocument(node) && node.parentNode
            return $(node)
        },
        parents: function(selector){
            var ancestors = [], nodes = this
            while (nodes.length > 0)
                nodes = $.map(nodes, function(node){
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node)
                        return node
                    }
                })
            return filtered(ancestors, selector)
        },
        parent: function(selector){
            return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
            return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
            return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
        },
        siblings: function(selector){
            return filtered(this.map(function(i, el){
                return filter.call(children(el.parentNode), function(child){ return child!==el })
            }), selector)
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
            return $.map(this, function(el){ return el[property] })
        },
        show: function(){
            return this.each(function(){
                this.style.display == "none" && (this.style.display = '')
                if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                    this.style.display = defaultDisplay(this.nodeName)
            })
        },
        replaceWith: function(newContent){
            return this.before(newContent).remove()
        },
        wrap: function(structure){
            var func = isFunction(structure)
            if (this[0] && !func)
                var dom     = $(structure).get(0),
                        clone = dom.parentNode || this.length > 1

            return this.each(function(index){
                $(this).wrapAll(
                    func ? structure.call(this, index) :
                        clone ? dom.cloneNode(true) : dom
                )
            })
        },
        wrapAll: function(structure){
            if (this[0]) {
                $(this[0]).before(structure = $(structure))
                var children
                // drill down to the inmost element
                while ((children = structure.children()).length) structure = children.first()
                $(structure).append(this)
            }
            return this
        },
        wrapInner: function(structure){
            var func = isFunction(structure)
            return this.each(function(index){
                var self = $(this), contents = self.contents(),
                        dom    = func ? structure.call(this, index) : structure
                contents.length ? contents.wrapAll(dom) : self.append(dom)
            })
        },
        unwrap: function(){
            this.parent().each(function(){
                $(this).replaceWith($(this).children())
            })
            return this
        },
        clone: function(){
            return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
            return this.css("display", "none")
        },
        toggle: function(setting){
            return this.each(function(){
                var el = $(this)
                ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
            })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
            return arguments.length === 0 ?
                (this.length > 0 ? this[0].innerHTML : null) :
                this.each(function(idx){
                    var originHtml = this.innerHTML
                    $(this).empty().append( funcArg(this, html, idx, originHtml) )
                })
        },
        text: function(text){
            return arguments.length === 0 ?
                (this.length > 0 ? this[0].textContent : null) :
                this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
        },
        attr: function(name, value){
            var result
            return (typeof name == 'string' && value === undefined) ?
                (this.length == 0 || this[0].nodeType !== 1 ? undefined :
                    (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
                    (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
                ) :
                this.each(function(idx){
                    if (this.nodeType !== 1) return
                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
        },
        removeAttr: function(name){
            return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
            return (value === undefined) ?
                (this[0] && this[0][name]) :
                this.each(function(idx){
                    this[name] = funcArg(this, value, idx, this[name])
                })
        },
        data: function(name, value){
            var data = this.attr('data-' + dasherize(name), value)
            return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
            return arguments.length === 0 ?
                (this[0] && (this[0].multiple ?
                     $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
                     this[0].value)
                ) :
                this.each(function(idx){
                    this.value = funcArg(this, value, idx, this.value)
                })
        },
        offset: function(coordinates){
            if (coordinates) return this.each(function(index){
                var $this = $(this),
                    coords = funcArg(this, coordinates, index, $this.offset()),
                    parentOffset = $this.offsetParent().offset(),
                    props = {
                        top:  coords.top  - parentOffset.top,
                        left: coords.left - parentOffset.left
                    }

                if ($this.css('position') == 'static') props['position'] = 'relative'
                $this.css(props)
            })
            if (this.length==0) return null
            var obj = this[0].getBoundingClientRect()
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
            }
        },
        css: function(property, value){
            if (arguments.length < 2) {
                var element = this[0], computedStyle = getComputedStyle(element, '')
                if(!element) return
                if (typeof property == 'string')
                    return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
                else if (isArray(property)) {
                    var props = {}
                    $.each(isArray(property) ? property: [property], function(_, prop){
                        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
                    })
                    return props
                }
            }

            var css = ''
            if (type(property) == 'string') {
                if (!value && value !== 0)
                    this.each(function(){ this.style.removeProperty(dasherize(property)) })
                else
                    css = dasherize(property) + ":" + maybeAddPx(property, value)
            } else {
                for (key in property)
                    if (!property[key] && property[key] !== 0)
                        this.each(function(){ this.style.removeProperty(dasherize(key)) })
                    else
                        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
            }

            return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
            return element ? this.indexOf($(element).get(0)) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
            return arr.some.call(this, function(el){
                return this.test(className(el))
            }, classRE(name))
        },
        addClass: function(name){
            return this.each(function(idx){
                classList = []
                var cls = className(this), newName = funcArg(this, name, idx, cls)
                newName.split(/\s+/g).forEach(function(klass){
                    if (!$(this).hasClass(klass)) classList.push(klass)
                }, this)
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
            })
        },
        removeClass: function(name){
            return this.each(function(idx){
                if (name === undefined) return className(this, '')
                classList = className(this)
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
                    classList = classList.replace(classRE(klass), " ")
                })
                className(this, classList.trim())
            })
        },
        toggleClass: function(name, when){
            return this.each(function(idx){
                var $this = $(this), names = funcArg(this, name, idx, className(this))
                names.split(/\s+/g).forEach(function(klass){
                    (when === undefined ? !$this.hasClass(klass) : when) ?
                        $this.addClass(klass) : $this.removeClass(klass)
                })
            })
        },
        scrollTop: function(value){
            if (!this.length) return
            var hasScrollTop = 'scrollTop' in this[0]
            if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
            return this.each(hasScrollTop ?
                function(){ this.scrollTop = value } :
                function(){ this.scrollTo(this.scrollX, value) })
        },
        position: function() {
            if (!this.length) return

            var elem = this[0],
                // Get *real* offsetParent
                offsetParent = this.offsetParent(),
                // Get correct offsets
                offset             = this.offset(),
                parentOffset = rootNodeRE.test(offsetParent.get(0).nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top    -= parseFloat( $(elem).css('margin-top') ) || 0
            offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

            // Add offsetParent borders
            parentOffset.top    += parseFloat( $(offsetParent.get(0)).css('border-top-width') ) || 0
            parentOffset.left += parseFloat( $(offsetParent.get(0)).css('border-left-width') ) || 0

            // Subtract the two offsets
            return {
                top:    offset.top    - parentOffset.top,
                left: offset.left - parentOffset.left
            }
        },
        offsetParent: function() {
            return this.map(function(){
                var parent = this.offsetParent || document.body
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                    parent = parent.offsetParent
                return parent
            })
        }
    }

    // for now
    $.fn.detach = $.fn.remove

    // Generate the `width` and `height` functions
    ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
            dimension.replace(/./, function(m){ return m[0].toUpperCase() })

        $.fn[dimension] = function(value){
            var offset, el = this[0]
            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
                isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
                (offset = this.offset()) && offset[dimension]
            else return this.each(function(idx){
                el = $(this)
                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
            })
        }
    })

    function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
    }

    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
            // arguments can be nodes, arrays of nodes, and HTML strings but not Zero objects
            var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg)
                var ret = argType == "object" || argType == "array" || argType == "null" ?
                    arg : $.fragment(arg)
                return $.isZ(ret) ? $.merge([],ret) : ret
            }),
            parent, copyByClone = this.length > 1
            if (nodes.length < 1) return this

            return this.each(function(_, target){
                parent = inside ? target : target.parentNode

                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                                 operatorIndex == 1 ? target.firstChild :
                                 operatorIndex == 2 ? target :
                                 null

                nodes.forEach(function(node){
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $(node).remove()

                    traverseNode(parent.insertBefore(node, target), function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                             (!el.type || el.type === 'text/javascript') && !el.src)
                            window['eval'].call(window, el.innerHTML)
                    })
                })
            })
        }

        // after   => insertAfter
        // prepend => prependTo
        // before  => insertBefore
        // append  => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
            $(html)[operator](this)
            return this
        }
    })

    // Export internal API functions in the `Zero` namespace
    $.uniq = uniq
    $.deserializeValue = deserializeValue

    return Zero
})()


window.Zero = Zero
window.$ === undefined && (window.$ = Zero)





;(function($){
    function detect(ua){
        var os = this.os = {}, browser = this.browser = {},
            webkit = ua.match(/WebKit\/([\d.]+)/),
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            safari = webkit && ua.match(/Mobile\//) && !chrome,
            webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
            ie = ua.match(/(MSIE\s([\d.]+))|(rv:([\d.]+))/)

        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]
        if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true
        if (webview) browser.webview = true
        if (ie) browser.ie = true, browser.version = ie[2] || ie[4]

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
        os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
    }

    detect.call($, navigator.userAgent)
    // make available to unit tests
    $.__detect = detect

})(Zero)





;(function($){
    var $$ = $.qsa, handlers = {}, _zid = 1, specialEvents={},
        hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
            return handler
                && (!event.e  || handler.e == event.e)
                && (!event.ns || matcher.test(handler.ns))
                && (!fn       || zid(handler.fn) === zid(fn))
                && (!selector || handler.sel == selector)
        })
    }
    function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }
    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eachEvent(events, fn, iterator){
        if ($.type(events) != "string") $.each(events, iterator)
        else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
    }

    function eventCapture(handler, captureSetting) {
        return handler.del &&
            (handler.e == 'focus' || handler.e == 'blur') ||
            !!captureSetting
    }

    function realEvent(type) {
        return hover[type] || type
    }

    function add(element, events, fn, selector, getDelegate, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        eachEvent(events, fn, function(event, fn){
            var handler = parse(event)
            handler.fn  = fn
            handler.sel = selector
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function(e){
                var related = e.relatedTarget
                if (!related || (related !== this && !$.contains(this, related)))
                    return handler.fn.apply(this, arguments)
            }
            handler.del   = getDelegate && getDelegate(fn, event)
            var callback  = handler.del || fn
            handler.proxy = function(e){
                var result = callback.apply(element, [e].concat(e.data))
                if (result === false) e.preventDefault(), e.stopPropagation()
                return result
            }
            handler.i = set.length
            set.push(handler)
            if ('addEventListener' in element)
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
    }
    function remove(element, events, fn, selector, capture){
        var id = zid(element)
        eachEvent(events || '', fn, function(event, fn){
            findHandlers(element, event, fn, selector).forEach(function(handler){
                delete handlers[id][handler.i]
            if ('removeEventListener' in element)
                element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        })
    }

    $.event = { add: add, remove: remove }

    $.proxy = function(fn, context) {
        if ($.isFunction(fn)) {
            var proxyFn = function(){ return fn.apply(context, arguments) }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (typeof context == 'string') {
            return $.proxy(fn[context], fn)
        } else {
            throw new TypeError("expected function")
        }
    }

    $.fn.bind = function(event, callback){
        return this.each(function(){
            add(this, event, callback)
        })
    }
    $.fn.unbind = function(event, callback){
        return this.each(function(){
            remove(this, event, callback)
        })
    }
    $.fn.one = function(event, callback){
        return this.each(function(i, element){
            add(this, event, callback, null, function(fn, type){
                return function(){
                    var result = fn.apply(element, arguments)
                    remove(element, type, fn)
                    return result
                }
            })
        })
    }

    var returnTrue = function(){return true},
            returnFalse = function(){return false},
            ignoreProperties = /^([A-Z]|layer[XY]$)/,
            eventMethods = {
                preventDefault: 'isDefaultPrevented',
                stopImmediatePropagation: 'isImmediatePropagationStopped',
                stopPropagation: 'isPropagationStopped'
            }
    function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        $.each(eventMethods, function(name, predicate) {
            proxy[name] = function(){
                this[predicate] = returnTrue
                return event[name].apply(event, arguments)
            }
            proxy[predicate] = returnFalse
        })
        return proxy
    }

    // emulates the 'defaultPrevented' property for browsers that have none
    function fix(event) {
        if (!('defaultPrevented' in event)) {
            event.defaultPrevented = false
            var prevent = event.preventDefault
            event.preventDefault = function(){
                event.defaultPrevented = true
                prevent.call(event)
            }
        }
    }

    $.fn.delegate = function(selector, event, callback){
        return this.each(function(i, element){
            add(element, event, callback, selector, function(fn){
                return function(e){
                    var evt, match = $(e.target).closest(selector, element).get(0)
                    if (match) {
                        evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                        return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
                    }
                }
            })
        })
    }
    $.fn.undelegate = function(selector, event, callback){
        return this.each(function(){
            remove(this, event, callback, selector)
        })
    }

    $.fn.on = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
            this.bind(event, selector || callback) : this.delegate(selector, event, callback)
    }
    $.fn.off = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
            this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
    }

    $.fn.trigger = function(event, data){
        if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
        fix(event)
        event.data = data
        return this.each(function(){
            // items in the collection might not be DOM elements
            if('dispatchEvent' in this) this.dispatchEvent(event)
            else $(this).triggerHandler(event, data)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function(event, data){
        var e, result
        this.each(function(i, element){
            e = createProxy(typeof event == 'string' ? $.Event(event) : event)
            e.data = data
            e.target = element
            $.each(findHandlers(element, event.type || event), function(i, handler){
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

    // shortcut methods for `.bind(event, fn)` for each event type
    ;('focusin focusout load resize scroll unload click dblclick '+
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
    'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
            return callback ?
                this.bind(event, callback) :
                this.trigger(event)
        }
    })

    ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
            if (callback) this.bind(name, callback)
            else this.each(function(){
                try { this[name]() }
                catch(e) {}
            })
            return this
        }
    })

    $.Event = function(type, props) {
        if (typeof type != 'string') props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        // Workaround for IE since it has a stupid bug where it resets defaultPrevented after triggering
        event.isDefaultPrevented = function(){ return event.hasPreventedDefault || event.defaultPrevented }
        var oldPreventDefault = event.preventDefault
        event.preventDefault = function(){
                event.hasPreventedDefault = true
                return oldPreventDefault.call(event)
        }
        return event
    }

})(Zero)




;(function ($) {
    var document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        //scriptTypeRE = /^(?:text|application)\/javascript/i,
        //xmlTypeRE = /^(?:text|application)\/xml/i,
        //jsonType = 'application/json',
        //htmlType = 'text/html',
        blankRE = /^\s*$/

    // Number of active Ajax requests
    $.active = 0

    // Empty function, used as default callback
    function empty() {}

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Default response type
        responseType: 'text',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        done: empty,
        // Callback that is executed the request fails
        fail: empty,
        // Callback that is executed on request complete (both: error and success)
        always: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport (XHR2)
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // Request headers
        headers: {},
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
        // Whether credential data should be sent with cross-domain requests
        withCredentials: false,
        // The username for same origin requests
        username: null,
        // The password for same origin requests
        password: null
    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    // do not serialize if we have an acceptable object type
    function serializeData(options) {
        if (options.data instanceof File ||
            options.data instanceof Blob ||
            options.data instanceof Document ||
            options.data instanceof FormData ||
            options.data instanceof ArrayBuffer)
            return
        if (options.processData && options.data && $.type(options.data) != "string"){
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded'
            options.data = $.param(options.data, options.traditional)
        }
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = appendQuery(options.url, options.data)
    }

    $.ajax = function (options) {
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var baseHeaders = {},
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr()

        baseHeaders['X-Requested-With'] = 'XMLHttpRequest'

        settings.headers = $.extend(baseHeaders, settings.headers || {})

        // Create a Zero object from the xhr object
        var zeroXHR = $(xhr)

        //HACK: this is a temporary fix for lack of support for the json responseType
        zeroXHR.on('load', function(){
            if (settings.responseType == 'json'){
                this.response2 = -1
                try {
                    this.response2 = blankRE.test(this.response) ? null : JSON.parse(this.response)
                } catch (ex){
                    this.response2 = null
                }
            }
            else
            {
                this.response2 = this.response
            }
        })
        if (settings.responseType == 'json') settings.headers['Accept'] = 'application/json'

        // Add function for upload progress hooking
        zeroXHR.uploadProgress = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr.upload).on('progress', function(e){
                callback.call(context, e, xhr)
            })

            // Return the Zero object for chaining
            return this
        }

        // Add function for done hooking
        zeroXHR.done = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('load', function(e){
                if ( !((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && protocol == 'file:')) ) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else if (this.response == null) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else {
                    callback.call(context, this.response2, this.statusText, this);
                }
            })

            // Return the Zero object for chaining
            return this
        }

        // Add function for fail hooking
        zeroXHR.fail = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('error timeout abort', function(e){
                callback.call(context, e.type, this, settings)
            })

            // Return the Zero object for chaining
            return this
        }

        // Add function for always hooking
        zeroXHR.always = function(func){
            if (typeof func !== 'function') throw TypeError('Expected func to be of type function.')
            var callback = func
            var context = settings.context
            $(xhr).on('loadend', function(e){
                callback.call(context, this, settings)
            })

            // Return the zero object for chaining
            return this
        }

        // Hook active request count
        zeroXHR.on('loadstart', function(){
            $.active++
        })
        zeroXHR.on('loadend', function(){
            $.active--
        })

        // Hook beforeSend
        zeroXHR.on('beforesend', function(){
            return settings.beforeSend.call(settings.context, xhr, settings)
        })

        // Now hook in done, fail and always functions
        zeroXHR.done(settings.done)
        zeroXHR.fail(settings.fail)
        zeroXHR.always(settings.always)
        
        // If settings.global is set to true then hook in global ajax events
        if (settings.global){
            zeroXHR.on('beforesend', function(e){
                var event = $.Event('ajaxBeforeSend')
                $(settings.context || document).trigger(event, [this, settings])
                return !event.isDefaultPrevented()
            })

            zeroXHR.on('loadstart', function(e){
                $(settings.context || document).trigger($.Event('ajaxStart'), [this, settings])
            })

            zeroXHR.on('load', function(e){
                if ( !((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && protocol == 'file:')) ) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else if (this.response == null) {
                    $(this).trigger($.Event('error', e))
                    e.stopImmediatePropagation()
                } else {
                    $(settings.context || document).trigger($.Event('ajaxSuccess'), [this, settings, this.response2])
                }
            })

            zeroXHR.on('error timeout abort', function(e){
                $(settings.context || document).trigger($.Event('ajaxError'), [this, settings, e.type])
            })

            zeroXHR.on('loadend', function(e){
                $(settings.context || document).trigger($.Event('ajaxStop'), [this, settings])
            })
        }

        xhr.open(settings.type, settings.url, true, settings.username, settings.password)

        // Set xhr fields
        xhr.withCredentials = settings.withCredentials
        xhr.responseType = settings.responseType
        xhr.timeout = settings.timeout

        // Add headers
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

        // Trigger beforeSend and check to make sure the request wasn't canceled
        var beforeSendEvent = $.Event('beforesend')
        zeroXHR.trigger(beforeSendEvent)
        if (beforeSendEvent.isDefaultPrevented() === true) {
            xhr.abort()
            return false
        }

        // avoid sending empty string
        xhr.send(settings.data ? settings.data : null)
        return zeroXHR
    }

    // handle optional data/done arguments
    function parseArguments(url, data, done, responseType) {
        var hasData = !$.isFunction(data)
        return {
            url: url,
            data: hasData ? data : undefined,
            done: !hasData ? data : $.isFunction(done) ? done : undefined,
            responseType: hasData ? responseType || done : done
        }
    }

    $.get = function (url, data, done, responseType) {
        return $.ajax(parseArguments.apply(null, arguments))
    }

    $.post = function (url, data, done, responseType) {
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
    }

    $.getJSON = function (url, data, done) {
        var options = parseArguments.apply(null, arguments)
        // Currently only supported by Firefox and Chrome dev
        options.responseType = 'json'
        return $.ajax(options)
    }

    $.fn.load = function (url, data, done) {
        if (!this.length) return this
        var self = this,
            parts = url.split(/\s/),
            selector,
            options = parseArguments(url, data, done),
            callback = options.done
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.done = function (response) {
            self.html(selector ?
                $('<div>').html(response.replace(rscript, "")).find(selector) : response)
            callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
        var type, array = $.isArray(obj)
            $.each(obj, function (key, value) {
                type = $.type(value)
                if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value)
                // recurse into nested objects
                else if (type == "array" || (!traditional && type == "object"))
                    serialize(params, value, traditional, key)
                else params.add(key, value)
            })
    }

    $.param = function (obj, traditional) {
        var params = []
        params.add = function (k, v) {
            this.push(escape(k) + '=' + escape(v))
        }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
    }
})(Zero)




;(function ($) {
    $.fn.serializeArray = function() {
        var result = [], el
        $([].slice.call(this.get(0).elements)).each(function(){
            el = $(this)
            var type = el.attr('type')
            if (this.nodeName.toLowerCase() != 'fieldset' &&
                !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
                ((type != 'radio' && type != 'checkbox') || this.checked))
                result.push({
                    name: el.attr('name'),
                    value: el.val()
                })
        })
        return result
    }

    $.fn.serialize = function(){
        var result = []
        this.serializeArray().forEach(function(elm){
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
    }

    $.fn.submit = function(callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
            var event = $.Event('submit')
            this.eq(0).trigger(event)
            if (!event.defaultPrevented) this.get(0).submit()
        }
        return this
    }

})(Zero)





;(function($, undefined){
    var prefix = '', eventPrefix, endEventName, endAnimationName,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o', MS: '' },
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming, transitionDelay,
        animationName, animationDuration, animationTiming, animationDelay,
        cssReset = {}

    function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

    $.each(vendors, function(vendor, vendorPrefix){
        if (testEl.style[vendorPrefix + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendorPrefix.toLowerCase() + '-'
            eventPrefix = vendorPrefix
            return false
        }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
    cssReset[transitionDuration = prefix + 'transition-duration'] =
    cssReset[transitionDelay    = prefix + 'transition-delay'] =
    cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
    cssReset[animationName      = prefix + 'animation-name'] =
    cssReset[animationDuration  = prefix + 'animation-duration'] =
    cssReset[animationDelay     = prefix + 'animation-delay'] =
    cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function(properties, duration, ease, callback, delay){
        if ($.isPlainObject(duration))
            ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
        if (duration)
            duration = (typeof duration == 'number' ? duration : 
                ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        if (delay) delay = parseFloat(delay) / 1000
        return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function(properties, duration, ease, callback, delay){
        var key, cssValues = {}, cssProperties, transforms = '',
                that = this, wrappedCallback, endEvent = $.fx.transitionEnd

        if (duration === undefined) duration = 0.4
        if (delay === undefined) delay = 0
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
            cssValues[animationDelay] = delay + 's'
            cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd
        } else {
            cssProperties = []
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
                cssValues[transitionDelay] = delay + 's'
                cssValues[transitionTiming] = (ease || 'linear')
            }
        }

        wrappedCallback = function(event){
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).off(endEvent, wrappedCallback)
            }
            $(this).css(cssReset)
            callback && callback.call(this)
        }
        if (duration > 0) this.on(endEvent, wrappedCallback)

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function() {
            that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
    }

    testEl = null
})(Zero)





;(function($){
    // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
    // Option flags:
    //   - once: Callbacks fired at most one time.
    //   - memory: Remember the most recent context and arguments
    //   - stopOnFalse: Cease iterating over callback list
    //   - unique: Permit adding at most one instance of the same callback
    $.Callbacks = function(options) {
        if (options && typeof options !== 'object') {
            return;
        }
        options = $.extend({}, options)

        var memory, // Last fire value (for non-forgettable lists)
            fired,  // Flag to know if list was already fired
            firing, // Flag to know if list is currently firing
            firingStart, // First callback to fire (used internally by add and fireWith)
            firingLength, // End of the loop when firing
            firingIndex, // Index of currently firing callback (modified by remove if needed)
            list = [], // Actual callback list
            stack = !options.once && [], // Stack of fire calls for repeatable lists
            fire = function(data) {
                memory = options.memory && data
                fired = true
                firingIndex = firingStart || 0
                firingStart = 0
                firingLength = list.length
                firing = true
                for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false
                        break
                    }
                }
                firing = false
                if (list) {
                    if (stack) stack.length && fire(stack.shift())
                    else if (memory) list.length = 0
                    else Callbacks.disable()
                }
            },

            Callbacks = {
                add: function() {
                    if (list) {
                        var start = list.length
                        function _add(args) {
                            $.each(args, function(_, arg) {
                                if (typeof arg === "function") {
                                    if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                                } 
                                else if (arg && arg.length && typeof arg !== 'string') _add(arg)
                            })
                        }
                        _add(arguments)
                        if (firing) firingLength = list.length
                        else if (memory) {
                            firingStart = start
                            fire(memory)
                        }
                    }
                    return this
                },
                remove: function() {
                    if (list) {
                        $.each(arguments, function(_, arg) {
                            var index
                            while ((index = $.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1)
                                // Handle firing indexes
                                if (firing) {
                                    if (index <= firingLength) --firingLength
                                    if (index <= firingIndex) --firingIndex
                                }
                            }
                        })
                    }
                    return this
                },
                has: function(fn) {
                    return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
                },
                empty: function() {
                    firingLength = list.length = 0
                    return this
                },
                disable: function() {
                    list = stack = memory = undefined
                    return this
                },
                disabled: function() {
                    return !list
                },
                lock: function() {
                    stack = undefined;
                    if (!memory) {
                        Callbacks.disable()
                    }
                    return this
                },
                locked: function() {
                    return !stack
                },
                fireWith: function(context, args) {
                    if (list && (!fired || stack)) {
                        args = args || []
                        args = [context, args.slice ? args.slice() : args]
                        if (firing) stack.push(args)
                        else fire(args)
                    }
                    return this
                },
                fire: function() {
                    return Callbacks.fireWith(this, arguments)
                },
                fired: function() {
                    return !!fired
                }
            }
        return Callbacks
    }
})(Zero)




;(function($){
    $.Deferred = function(func) {
        var tuples = [
            // action, add listener, listener list, final state
            [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
            [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
            [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
            state: function() {
                return state
            },
            always: function() {
                deferred.done(arguments).fail(arguments)
                return this
            },
            then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
                var fns = arguments
                return $.Deferred(function(defer) {
                    $.each(tuples, function(i, tuple) {
                        var fn = $.isFunction(fns[i]) && fns[i]
                        deferred[tuple[1]](function() {
                            var returned = fn && fn.apply(this, arguments)
                            if (returned && $.isFunction(returned.promise))
                                returned.promise()
                                    .done(defer.resolve)
                                    .fail(defer.reject)
                                    .progress(defer.notify)
                            else {
                                var context = this === promise ? defer.promise() : this,
                                        values = fn ? [returned] : arguments
                                defer[tuple[0] + "With"](context, values)
                            }
                        })
                    })
                    fns = null
                }).promise()
            },
                    
            promise: function(obj) {
                return obj != null ? $.extend( obj, promise ) : promise
            }
        },
        deferred = {}

        // Backwards compatibility alias -- Omit?
        promise.pipe = promise.then

        $.each(tuples, function(i, tuple) {
            var list = tuple[2],
                    stateString = tuple[3]

            promise[tuple[1]] = list.add

            if (stateString) {
                list.add(function() {
                    state = stateString
                }, tuples[i^1][2].disable, tuples[2][2].lock)
            }

            deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
                return this
            }
            deferred[tuple[0] + "With"] = list.fireWith
        })

        promise.promise(deferred)

        if (func)
            func.call(deferred, deferred)

        return deferred
    }
    $.when = function(sub) {
        var slice = Array.prototype.slice, 
                resolveValues = slice.call(arguments),
                len = resolveValues.length,
                i = 0,
                remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
                deferred = remain === 1 ? sub : $.Deferred(),
                progressValues, progressContexts, resolveContexts,

                updateFn = function(i, ctx, val) {
                    return function(value) {
                        ctx[i] = this
                        val[i] = arguments.length > 1 ? slice.call(arguments) : value
                        if (val === progressValues)
                            deferred.notifyWith(ctx, val)
                        else if (!(--remain))
                            deferred.resolveWith(ctx, val)
                    }
                }
        if (len > 1) {
            progressValues = new Array(len)
            progressContexts = new Array(len)
            resolveContexts = new Array(len)
            for ( ; i < len; ++i ) {
                if (resolveValues[i] && $.isFunction(resolveValues[i].promise))
                    resolveValues[i].promise()
                        .done(updateFn(i, resolveContexts, resolveValues))
                        .fail(deferred.reject)
                        .progress(updateFn(i, progressContexts, progressValues))
                else
                    --remain
            }
        }
        if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
        return deferred.promise()
    }
})(Zero)