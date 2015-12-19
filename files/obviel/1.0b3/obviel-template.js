/*
How does this work?

There are two phases:

* Compilation phase: the template is parsed and structures are generated
  for a fast execution phase.

* Execution phase: the compiled template is combined with a JavaScript
  object and a DOM element. The resulting rendered template is attached
  to this element.

How does compilation work?

* a separated Section is compiled for each data-with, data-if and
  data-each element, or combinations thereof.

* Sections are organized in a tree; each section may have
  sub-sections. The template itself starts with a single Section at
  the top.

* each section also maintains a list of dynamic elements: an element
  with dynamic content. An element becomes dynamic if:

  * it has an attribute which uses variable interpolation.

  * it has a child text node that uses variable interpolation.

  * it has a data-id directive.

  * it has a data-trans directive.

  * it has a data-tvar directive.

* Sections and dynamic elements are found in a section by following a
  path of childNode indexes from the Section they are in. This way we
  avoid having to modify the DOM with temporary ID markers, which is
  relatively slow and does not allow the rendering of a template on an
  element unattached to the document.

when rendering a section:

* clone original section (deep copy) into DOM.

* now find all dynamic elements by id and fill in interpolations
  according to data (and translations).

* render sub-sections and attach them.

*/

if (typeof obviel === "undefined") {
    /*jshint shadow:false */
    var obviel = {};
}

obviel.template = {};

(function($, module) {

    // will define these later, is to please jshint
    var isHtmlText, trim;
    var formatters, funcs;
    var defaultViewName = null;
    var resolveInObj, getDirective, validateDottedName;
    var cachedTokenize, morphElement;
    var splitNameFormatter, splitNameFormatters;
    var parseTextForPlural, parseTvar, getImplicitCountVariable;
    var checkMessageId, getIndexInParent;
    
    module.NAME_TOKEN = 0;
    module.TEXT_TOKEN = 1;

    // these attributes may not be dynamic, you can only
    // set them dynamically thorugh data-<attrName>
    var SPECIAL_ATTR = {'id': true,  'src': true};
    
    module.CompilationError = function(el, message) {
        this.name = 'CompilationError';
        this.el = el;
        this.message = message;
    };

    module.CompilationError.prototype = new Error();
    module.CompilationError.prototype.constructor = module.CompilationError;
    
    module.CompilationError.prototype.toString = function() {
        return this.message;
    };
    
    module.RenderError = function(el, message) {
        this.name = 'RenderError';
        this.el = el;
        this.message = message;
    };

    module.RenderError.prototype = new Error();
    module.RenderError.prototype.constructor = module.RenderError;
    
    module.RenderError.prototype.toString = function() {
        return this.message;
    };
    
    module.Template = function(text) {
        var parsed;

        // allow us to deal with partial templates
        // (only text or an element plus top-level text,
        // or multiple top-level elements)
        // in the loop below the nodes are removed form the div again
        text = '<div>' + text + '</div>';
        parsed = $(text).get(0);
    
        var parts = [];
        while (parsed.hasChildNodes()) {
            var node = parsed.firstChild;
            parsed.removeChild(node);
            if (node.nodeType === 1) {
                // ELEMENT
                parts.push(new module.Section(node, true));
            } else if (node.nodeType === 3) {
                // TEXT
                parts.push(new module.DynamicText(node, node.nodeValue));
            }
        }
        this.parts = parts;
    };
    
    module.Template.prototype.render = function(el, obj, context) {
        var scope = new module.Scope(obj);
        if (!context) {
            context = { getTranslation: null, getHandler: null };
        }
        // use global getFormatter if nothing more specific was registered
        if (!context.getFormatter) {
            context.getFormatter = module.getFormatter;
        }
        // use global getFunc if nothing more specific was registered
        if (!context.getFunc) {
            context.getFunc = module.getFunc;
        }

        context.subviewPromises = [];
        
        var frag = document.createDocumentFragment();
        
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].renderRoot(frag, scope, context);
        }
        
        // now insert frag into actual document
        el.empty();
        el.get(0).appendChild(frag);
        
        // wipe out any elements marked for removal by data-if; these
        // could not be removed previously so as not to break the
        // indexed based access to elements
        $('.obviel-template-removal', el).remove();

        // setting attributes with data (data-id, data-src) become
        // that attribute (id, src)
        $('.obviel-template-special-attr', el).each(function() {
            var name, value;

            for (name in SPECIAL_ATTR) {
                value = getDirective(this, 'data-' + name);
                if (value !== null) {
                    this.setAttribute(name, value);
                }
            }
            
            var el = $(this);
            el.removeClass('obviel-template-special-attr');
            if (el.attr('class') === '') {
                el.removeAttr('class');
            }
        });

        // swap in those elements that had a dynamic element name
        $('.obviel-template-data-el', el).each(function() {
            var dataEl = getDirective(this, 'data-el');
            var newEl = $(morphElement(this, dataEl));
            newEl.removeClass('obviel-template-data-el');
            if (newEl.attr('class') === '') {
                newEl.removeAttr('class');
            }
        });
        // remove any unwrap tags
        $('.obviel-template-data-unwrap', el).each(function() {
            var frag = document.createDocumentFragment();
            while (this.hasChildNodes()) {
                frag.appendChild(this.removeChild(this.firstChild));
            }
            this.parentNode.insertBefore(frag, this.nextSibling);
            this.parentNode.removeChild(this);
        });

        // need to wait until data-view triggered views are done
        return $.when.apply(null, context.subviewPromises);
    };
    
    module.Section = function(el, rootSection) {
        this.el = el;

        var dataIf = getDirective(el, 'data-if');
        var dataWith = getDirective(el, 'data-with');
        var dataEach = getDirective(el, 'data-each');
        
        if (!rootSection && !dataIf && !dataWith && !dataEach) {
            this.dynamic = false;
            return;
        }

        this.dynamic = true;
        
        if (dataIf) {
            this.dataIf = new module.IfExpression(el, dataIf);
        } else {
            this.dataIf = null;
        }
        if (dataWith) {
            validateDottedName(el, dataWith);
            this.dataWithName = dataWith;
            this.dataWith = module.resolveFunc(dataWith);
        } else {
            this.dataWith = null;
        }
        if (dataEach) {
            validateDottedName(el, dataEach);
            this.dataEach = module.resolveFunc(dataEach);
            this.dataEachName = dataEach.replace('.', '_');
        } else {
            this.dataEach = null;
        }

        //this.elFuncs = { funcs: [], sub: {} };
        
        this.dynamicElements = [];
        this.viewElements = [];
        this.subSections = [];
        this.compile(el);
    };

    module.Section.prototype.isDynamic = function() {
        return this.dynamic;
    };
    
    module.Section.prototype.compile = function(el) {
        // always compile any dynamic elements on top element
        var hasMessageId = this.compileDynamicElement(el);
        
        // if we have a message id, we don't want to compile down
        // into the section any further
        // XXX do some checking for illegal constructs
        if (hasMessageId) {
            this.compileFragment(el);
            return;
        }

        // compile any view on top element
        this.compileView(el);
        
        // now compile sub-elements
        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType !== 1) {
                // skip all non-element nodes
                continue;
            }
            this.compileEl(node);
        }
        
        this.compileFragment(el);
    };

    module.Section.prototype.compileFragment = function(el) {
        var frag = document.createDocumentFragment();
        while (el.hasChildNodes()) {
            frag.appendChild(el.removeChild(el.firstChild));
        }
        this.frag = frag;
    };
    
    module.Section.prototype.compileEl = function(el) {
        // compile element as sub-section
        var isSubSection = this.compileSubSection(el);

        // if it's a sub-section, we're done with it
        // we don't want to compile dynamic elements for it,
        // as that's done in the sub-section. we also don't want
        // to process further child elements, as that's done in the
        // sub section
        if (isSubSection) {
            return;
        }
        
        var hasMessageId = this.compileDynamicElement(el);
        
        // if we have a message id, we don't want to compile down
        // into the element
        // XXX do some checking for illegal constructs
        if (hasMessageId) {
            return;
        }

        this.compileView(el);

        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType !== 1) {
                // skip all non-element nodes
                continue;
            }
            this.compileEl(node);
        }
    };

    module.Section.prototype.compileDynamicElement = function(el) {
        var dynamicElement = new module.DynamicElement(el);
        if (!dynamicElement.isDynamic()) {
            return false;
        }
        
        this.dynamicElements.push({
            finder: this.getElFinder(el),
            dynamicElement: dynamicElement
        });
        return dynamicElement.contentTrans !== null;
    };
    
    module.Section.prototype.getElIndexes = function(el) {
        var indexes = [];
        var parentNode = this.el;
        var node = el;
        while (node !== parentNode) {
            var children = node.parentNode.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i] === node) {
                    indexes.push(i);
                    break;
                }
            }
            node = node.parentNode;
        }
        indexes.reverse();
        return indexes;
    };
    
    module.Section.prototype.getElFinder = function(el) {
        var indexes = [];
        var parentNode = this.el;
        var node = el;
        while (node !== parentNode) {
            var children = node.parentNode.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i] === node) {
                    indexes.push(i);
                    break;
                }
            }
            node = node.parentNode;
        }
        indexes.reverse();

        var c = new module.Codegen('node');
        for (var j in indexes) {
            c.push('node = node.childNodes[' + indexes[j] + '];');
        }
        c.push('return node;');
        return c.getFunction();
    };
    
    module.Section.prototype.compileView = function(el) {
        var viewElement = new module.ViewElement(el);

        if (!viewElement.isDynamic()) {
            return;
        }
        
        this.viewElements.push({
            finder: this.getElFinder(el),
            viewElement: viewElement
        });
    };
    
    module.Section.prototype.compileSubSection = function(el) {
        // create sub section with copied contents
        var subSection = new module.Section(el);
        
        if (!subSection.isDynamic()) {
            return false;
        }

        var oldEl = el;
        
        // make shallow copy of the element
        el = oldEl.cloneNode(false);

        // replace original el with shallow clone
        oldEl.parentNode.replaceChild(el, oldEl);
   
        this.subSections.push({
            finder: this.getElFinder(el),
            subSection: subSection
        });
        return true;
    };
    
    module.Section.prototype.render = function(el, scope, context) {
        if (this.dataIf) {
            var dataIf = this.dataIf.resolve(el, scope);
            if (!dataIf) {
                $(el).addClass('obviel-template-removal');
                return;
            }
        }

        if (this.dataEach) {
            this.renderEach(el, scope, context);
        } else {
            this.renderEl(el, scope, context);
        }
    };

    module.Section.prototype.renderRoot = function(el, scope, context) {
        var topEl = this.el.cloneNode(false);
        // append first, so that parentNode is available
        el.appendChild(topEl);
        this.render(topEl, scope, context);
    };
    
    var eachInfo = function(index, name, dataEach) {
        var even = index % 2 === 0;
        var info = {
            index: index,
            number: index + 1,
            length: dataEach.length,
            even: even,
            odd: !even
        };
        var each = {};
        $.extend(each, info);
        each[name] = info;
        return {
            '@each': each
        };
    };
    
    module.Section.prototype.renderEach = function(el, scope, context) {
        var dataEach = this.dataEach(scope);
        if (!$.isArray(dataEach)) {
            throw new module.RenderError(
                el, ("data-each must point to an array, not to " +
                     $.type(dataEach)));
        }
        // empty array, so don't render any elements
        if (dataEach.length === 0) {
            el.parentNode.removeChild(el);
            return;
        }

        // prepare the element to keep cloning back into the
        // DOM for each iteration. this needs to be done here,
        // before its id is removed
        var iterationNode = el.cloneNode(false);

        // store some information about the first iteration
        var insertBeforeNode = el.nextSibling;
        var parentNode = el.parentNode;

        // render the first iteration on the element
        scope.push(eachInfo(0, this.dataEachName, dataEach));
        scope.push(dataEach[0]);
        this.renderEl(el, scope, context);
        scope.pop();
        scope.pop();

        // now insert the next iterations after the first iteration
        for (var i = 1; i < dataEach.length; i++) {
            var iterationClone = iterationNode.cloneNode(false);
            parentNode.insertBefore(iterationClone, insertBeforeNode);

            scope.push(eachInfo(i, this.dataEachName, dataEach));
            scope.push(dataEach[i]);
            this.renderEl(iterationClone, scope, context);
            scope.pop();
            scope.pop();
        }
    };
    
    module.Section.prototype.renderEl = function(el, scope, context) {
        if (this.dataWith) {
            var dataWith = this.dataWith(scope);
            if (dataWith === undefined) {
                throw new module.RenderError(
                    el, "data-with '" + this.dataWithName + "' " +
                    "could not be found");
            }
            var type = $.type(dataWith);
            if (type !== 'object') {
                throw new module.RenderError(el,
                    "data-with must point to an object, not to " + type);
            }
            scope.push(dataWith);
        }

        if (this.frag.hasChildNodes()) {
            el.appendChild(this.frag.cloneNode(true));
        }
        this.renderDynamicElements(el, scope, context);
        this.renderViews(el, scope, context);
        this.renderSubSections(el, scope, context);

        if (this.dataWith) {
            scope.pop();
        }
    };
    
    module.Section.prototype.renderDynamicElements = function(el, scope,
                                                                context) {
        for (var i in this.dynamicElements) {
            var value = this.dynamicElements[i];
            var dynamicEl = value.finder(el);
            value.dynamicElement.render(dynamicEl, scope, context);
        }
    };

    module.Section.prototype.renderViews = function(el, scope,
                                                     context) {
        for (var i in this.viewElements) {
            var value = this.viewElements[i];
            var viewEl = value.finder(el);
            value.viewElement.render(viewEl, scope, context);
        }
    };

    module.Section.prototype.renderSubSections = function(el, scope,
                                                            context) {
        var toRender = [];
        // first we find all elements. we do this before rendering starts,
        // as rendering can in some cases (data-each) insert new elements
        // and that would break the finding
        for (var i in this.subSections) {
            toRender.push({value: this.subSections[i],
                            subSectionEl: this.subSections[i].finder(el)});
        }
        // now we can do the rendering
        for (i in toRender) {
            var r = toRender[i];
            r.value.subSection.render(r.subSectionEl, scope, context);
        }
    };
    
    module.DynamicElement = function(el, allowTvar) {
        this.attrTexts = {};
        this.contentTexts = [];
        this.handlers = [];
        this.contentTrans = null;
        this.funcName = null;
        this.hasDataAttr = false;
        this._dynamic = false;
        this.transInfo = null;
        this.compile(el, allowTvar);
    };

    module.DynamicElement.prototype.isDynamic = function() {
        return this._dynamic;
    };
    
    module.DynamicElement.prototype.compile = function(el, allowTvar) {
        this.transInfo = new module.TransInfo(el, allowTvar);
        
        this.compileAttrTexts(el);
        this.compileContentTexts(el);
        this.compileDataHandler(el);
        this.compileFunc(el);
        this.compileSpecialAttr(el);
        this.compileDataEl(el);
        this.compileDataAttr(el);
        this.compileDataUnwrap(el);
        this.compileContentTrans(el);
    };
    
    module.DynamicElement.prototype.compileAttrTexts = function(el) {
        var attrText;
        for (var i = 0; i < el.attributes.length; i++) {
            var attr = el.attributes[i];
            if (attr.specified !== true) {
                continue;
            }
            if (attr.value === null) {
                continue;
            }
            var transInfo = this.transInfo.attributes[attr.name];
            if (transInfo === undefined) {
                transInfo = null;
            }
            attrText = new module.DynamicAttribute(el, attr.name, attr.value,
                                                    transInfo);
            if (!attrText.isDynamic()) {
                continue;
            }
            this.attrTexts[attr.name] = attrText;
            this._dynamic = true;
        }
    };
    
    module.DynamicElement.prototype.compileContentTexts = function(el) {
        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType !== 3) {
                continue;
            }
            if (node.nodeValue === null) {
                continue;
            }
            var dynamicText = new module.DynamicText(el, node.nodeValue);
            if (dynamicText.isDynamic()) {
                this.contentTexts.push({
                    index: i,
                    dynamicText: dynamicText
                });
                this._dynamic = true;
            }
        }
    };
    
    module.DynamicElement.prototype.compileDataHandler = function(el) {
        var dataHandler = getDirective(el, 'data-handler');
        if (dataHandler === null) {
            return;
        }
        var nameFormatters = splitNameFormatters(el, dataHandler);
        if (nameFormatters.length === 0) {
            throw new module.CompilationError(
                el, 'data-handler: must have content');
        }
        for (var i = 0; i < nameFormatters.length; i++) {
            var nameFormatter = nameFormatters[i];
    
            if (!nameFormatter.formatter) {
                throw new module.CompilationError(
                    el, "data-handler: handler function name is not specified");
            }
            this.handlers.push({eventName: nameFormatter.name,
                                handlerName: nameFormatter.formatter});
        }
        this._dynamic = true;
    };
    
    module.DynamicElement.prototype.compileFunc = function(el) {
        var funcName = getDirective(el, 'data-func');
        if (funcName === null) {
            return;
        }
        this.funcName = funcName;
        this._dynamic = true;
    };

    module.DynamicElement.prototype.compileSpecialAttr = function(el) {
        var name, value;

        for (name in SPECIAL_ATTR) {
            if (!el.hasAttribute('data-' + name)) {
                continue;
            }
            value = el.getAttribute('data-' + name);
            if (!value) {
                throw new module.CompilationError(
                    el, "data-" + name + " cannot be empty");
            }
            $(el).addClass('obviel-template-special-attr');
        }
    };
    
    module.DynamicElement.prototype.compileDataEl = function(el) {
        if (!el.hasAttribute('data-el')) {
            return;
        }
        // non-destructively read data-el attribute, leave it in place
        // so variables can be used in it
        var dataEl = el.getAttribute('data-el');
        if (!dataEl) {
            throw new module.CompilationError(el, "data-el cannot be empty");
        }
        $(el).addClass('obviel-template-data-el');
    };

    module.DynamicElement.prototype.compileDataAttr = function(el) {
        if (!el.hasAttribute('data-attr')) {
            return;
        }
        // non-destructively read data-attr attribute, leave it in place
        // so variables can be used in it
        var dataAttr = el.getAttribute('data-attr');
        if (!dataAttr) {
            throw new module.CompilationError(
                el, "data-attr cannot be empty");
        }
        if (!el.hasAttribute('data-value')) {
            throw new module.CompilationError(
                el, "data-attr must be combined with data-value");
        }
        $(el).addClass('obviel-template-removal');
        this.hasDataAttr = true;
        this._dynamic = true;
    };

    module.DynamicElement.prototype.compileDataUnwrap = function(el) {
        if (!el.hasAttribute('data-unwrap')) {
            return;
        }
        $(el).addClass('obviel-template-data-unwrap');
    };

    module.DynamicElement.prototype.compileContentTrans = function(el) {
        if (this.transInfo.content === null) {
            return;
        }
        this._dynamic = true;

        var transInfo = this.transInfo.content;
        
        var singular = new module.ContentTrans(
            transInfo.messageId, transInfo.directive);
        var plural = new module.ContentTrans(
            transInfo.pluralMessageId, transInfo.directive);

        var current = singular;
        // XXX index only relevant for notrans case,
        // never for plural, so we are creating it for no reason in
        // many cases and it's not really relevant?
        var c = 0;
        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType === 3) {
                // TEXTNODE
                var info = parseTextForPlural(node.nodeValue);
                if (info.afterPlural === null) {
                    current.compileNode(node, c);
                    c++;
                } else {
                    current.compileNode(document.createTextNode(
                        info.beforePlural), c);
                    c++;
                    current = plural;
                    current.compileNode(document.createTextNode(
                        info.afterPlural), c);
                    c++;
                }
            } else if (node.nodeType === 1) {
                // ELEMENT NODE
                current.compileNode(node, c);
                c++;
            }
        }

        singular.finalizeCompile(el);
        
        if (current === plural) {
            plural.finalizeCompile(el);
        } else {
            plural = null;
        }

        if (transInfo.countVariable !== null && plural === null) {
            throw new module.CompilationError(
                el, "data-plural used for element content but no || used " +
                    "to indicate plural text");
        }

        if (plural === null) {
            this.contentTrans = singular;
            return;
        }
        
        var countVariable;
        
        if (transInfo.countVariable !== null) {
            countVariable = transInfo.countVariable;
        } else {
            countVariable = getImplicitCountVariable(el, singular, plural);
        }
        
        this.contentTrans = new module.PluralTrans(
            singular,
            plural,
            countVariable);
    };
    
    module.DynamicElement.prototype.render = function(el, scope, context) {
        var self = this;
        
        for (var key in this.attrTexts) {
            this.attrTexts[key].render(el, scope, context);
        }
        
        // fast path without translations; elements do not need to be
        // reorganized
        if (this.contentTrans === null) {
            this.renderNotrans(el, scope, context);
            this.finalizeRender(el, scope, context);
            return;
        }

        this.contentTrans.render(
            el, scope, context,
            function(el, scope, context) {
                self.renderNotrans(el, scope, context);
            });
        this.finalizeRender(el, scope, context);
    };

    module.DynamicElement.prototype.renderNotrans = function(el, scope,
                                                              context) {
        for (var i = 0; i < this.contentTexts.length; i++) {
            var value = this.contentTexts[i];
            el.childNodes[value.index].nodeValue = value.dynamicText.render(
                el, scope, context);
        }
    };
    
    module.DynamicElement.prototype.renderDataAttr = function(el) {
        if (!this.hasDataAttr) {
            return;
        }
        var name = getDirective(el, 'data-attr');
        var value = getDirective(el, 'data-value');

        var parent = $(el.parentNode);
        
        // use jQuery to make attribute access more uniform (style in IE, etc)
        
        if (parent.attr(name)) {
            value = parent.attr(name) + ' ' + value;
        }
        parent.attr(name, value);
    };

    module.DynamicElement.prototype.renderDataHandler = function(
        el, context) {
        if (this.handlers.length === 0) {
            return;
        }
        
        for (var i = 0; i < this.handlers.length; i++) {
            var handler = this.handlers[i];
            if (context.getHandler === null ||
                context.getHandler === undefined) {
                throw new module.RenderError(
                    el, "cannot render data-handler for event '" +
                        handler.eventName + "' and handler '" +
                        handler.handlerName +
                        "' because no getHandler function " +
                        "was supplied");
            }
            var f = context.getHandler(handler.handlerName);
            if (f === undefined || f === null) {
                throw new module.RenderError(
                    el, "cannot render data-handler for event '" +
                        handler.eventName + "' and handler '" +
                        handler.handlerName + "' because handler function " +
                        "could not be found");
            }
            $(el).bind(handler.eventName, f);
        }
    };
    
    module.DynamicElement.prototype.renderDataFunc = function(
        el, scope, context) {
        if (this.funcName === null) {
            return;
        }
        var func = context.getFunc(this.funcName);
        if (!func) {
            throw new module.RenderError(
                el, 'cannot render data-func because cannot find func: ' +
                    this.funcName);
        }
        func($(el),
             function(name) { return scope.resolve(name); },
             context);
    };
    
    
    module.DynamicElement.prototype.finalizeRender = function(
        el, scope, context) {
        this.renderDataAttr(el);
        this.renderDataHandler(el, context);
        this.renderDataFunc(el, scope, context);
    };
    
    module.DynamicText = function(el, text) {
        this.parts = [];
        this.variables = [];
      
        var tokens = module.tokenize(text);
        var dynamic = false;
        
        for (var i in tokens) {
            var token = tokens[i];
            if (token.type === module.TEXT_TOKEN) {
                this.parts.push(token.value);
            } else if (token.type === module.NAME_TOKEN) {
                this.parts.push(null);
                this.variables.push({
                    index: i,
                    value: new module.Variable(el, token.value)
                });
                dynamic = true;
            }
        }
        this._dynamic = dynamic;
    };

    module.DynamicText.prototype.isDynamic = function() {
        return this._dynamic;
    };
    
    module.DynamicText.prototype.render = function(el, scope, context) {
        var result = this.parts.slice(0);
        for (var i in this.variables) {
            var variable = this.variables[i];
            result[variable.index] = variable.value.render(el, scope, context);
        }
        return result.join('');
    };

    module.DynamicText.prototype.renderRoot = function(el, scope, context) {
        var node = document.createTextNode(this.render(el, scope, context));
        el.appendChild(node);
    };
    
    module.DynamicAttribute = function(el, name, value, transInfo) {
        this.name = name;
        this.value = value;
        this.transInfo = transInfo;
        this.attrTrans = null;
        this.dynamicText = null;
        this._dynamic = false;
        this.compileNotrans(el);
        this.compileTrans(el);
    };

    module.DynamicAttribute.prototype.isDynamic = function() {
        return this._dynamic;
    };
    
    module.DynamicAttribute.prototype.compileNotrans = function(el) {
        var dynamicText = new module.DynamicText(el, this.value);
        // if there's nothing dynamic nor anything to translate,
        // we don't have a dynamic attribute at all
        if (!dynamicText.isDynamic() && this.transInfo === null) {
            return;
        }
        if (SPECIAL_ATTR[this.name] !== undefined) {
            throw new module.CompilationError(
                el, ("not allowed to use variables (or translation) " +
                     "in " + this.name + " attribute. " +
                     "Use data-" + this.name + " instead"));
        }
        this.dynamicText = dynamicText;
        this._dynamic = true;
    };
    
    module.DynamicAttribute.prototype.compileTrans = function(el) {
        if (this.transInfo === null) {
            return;
        }
        
        var parts = this.value.split('||');
        if (parts.length === 1) {
            if (this.transInfo.countVariable !== null) {
                throw new module.CompilationError(
                    el, "data-plural used for attribute content but no || " +
                    "used to indicate plural text: " +
                    this.transInfo.countVariable);
            }
            this.attrTrans = new module.AttributeTrans(
                el, this.name, this.value, this.transInfo.messageId);
            this._dynamic = true;
            return;
        }
        
        var singular = new module.AttributeTrans(
            el, this.name, parts[0],
            this.transInfo.messageId);
        var plural = new module.AttributeTrans(
            el, this.name, parts[1],
            this.transInfo.pluralMessageId);
        
        var countVariable;

        if (this.transInfo.countVariable !== null) {
            countVariable = this.transInfo.countVariable;
        } else {
            countVariable = getImplicitCountVariable(
                el, singular, plural);
        }

        this._dynamic = true;
        this.attrTrans = new module.PluralTrans(
            singular, plural, countVariable);
    };
    
    module.DynamicAttribute.prototype.render = function(el, scope, context) {
        var self = this;
        // fast path without translations
        if (context.getTranslation === undefined ||
            context.getTranslation === null ||
            this.attrTrans === null) {
            this.renderNotrans(el, scope, context);
            return;
        }
        this.attrTrans.render(
            el, scope, context,
            function(el, scope, context) {
                self.renderNotrans(el, scope, context);
            });
    };
    
    module.DynamicAttribute.prototype.renderNotrans = function(
        el, scope, context) {
        el.setAttribute(this.name,
                        this.dynamicText.render(el, scope, context));
    };
    
    module.Variable = function(el, name) {
        var r = splitNameFormatter(el, name);
        this.name = r.name;
        this.formatter = r.formatter;
        this.fullName = name;
        validateDottedName(el, this.name);
        this.getValue = module.resolveFunc(r.name);
    };
    
    module.Variable.prototype.render = function(el, scope, context) {
        var result = this.getValue(scope);
        if (result === undefined) {
            throw new module.RenderError(el, "variable '" + this.name + "' " +
                                         "could not be found");
        }

        if (this.formatter !== null) {
            var formatter = context.getFormatter(this.formatter);
            if (!formatter) {
                throw new module.RenderError(
                    el, "cannot find formatter with name: " +
                        this.formatter);
            }
            result = formatter(result);
        }
        
        // if we want to render an object, pretty-print it
        var type = $.type(result);
        if (type === 'object' || type === 'array') {
            return JSON.stringify(result, null, 4);
        }
        return result;
    };

    module.ViewElement = function(el) {
        var dataView = getDirective(el, 'data-view');
        if (dataView === null) {
            this.dynamic = false;
            return;
        }
        validateDottedName(el, dataView);
        this.dynamic = true;
        var r = splitNameFormatter(el, dataView);
        this.objName = r.name;
        this.getValue = module.resolveFunc(r.name);
        this.viewName = r.formatter;
        if (this.viewName === null) {
            this.viewName = defaultViewName;
        }
    };
    
    module.ViewElement.prototype.isDynamic = function() {
        return this.dynamic;
    };

    module.ViewElement.prototype.render = function(el, scope, context) {
        var obj = this.getValue(scope);
        if (obj === undefined) {
            throw new module.RenderError(
                el, "data-view object '" + this.propertyName + "' " +
                    "could not be found");
        }
        var type = $.type(obj);
        if (type !== 'object' && type !== 'string') {
            throw new module.RenderError(
                el,
                "data-view must point to an object or string (URL), not to " + type);
        }
        
        // empty element
        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }
        try {
            context.subviewPromises.push($(el).render(obj, this.viewName));
        } catch(e) {
            if (e instanceof obviel.LookupError) {
                throw new module.RenderError(el, e.toString());
            } else {
                throw e;
            }
        }
    };
    
    module.TransInfo = function(el, allowTvar) {
        this.content = null;
        this.attributes = {};
        this.anyTranslations = false;
        this.allowTvar = allowTvar;
        this.compile(el);
    };

    module.TransInfo.prototype.compile = function(el) {
        this.compileDataTrans(el);
        if (this.content !== null && el.hasAttribute('data-view')) {
            throw new module.CompilationError(
                el,
                "data-view not allowed when content is marked with data-trans");
        }
        this.compileDataTvar(el);
        this.compileDataPlural(el);
    };
    
    module.TransInfo.prototype.compileDataTrans = function(el) {
        var dataTrans = null;
        if (el.hasAttribute('data-trans')) {
            dataTrans = el.getAttribute('data-trans');
            el.removeAttribute('data-trans');
        }

        if (dataTrans === null) {
            return;
        }
        
        dataTrans = trim(dataTrans);
        
        // empty string will mean translating text content only
        if (dataTrans === '') {
            this.content = {id: '.', countVariable: null,
                            directive: 'dataTrans',
                            messageId: null, pluralMessageId: null};
            this.attributes = {};
            this.anyTranslations = true;
            return;
        }
        
        // split with space character
        var parts = dataTrans.split(' ');
        
        for (var i in parts) {
            var part = trim(parts[i]);
            if (part === '') {
                continue;
            }
            var transInfo = this.compileDataTransPart(el, part);
            if (transInfo.id === '.') {
                this.content = transInfo;
                this.anyTranslations = true;
            } else {
                this.attributes[transInfo.id] = transInfo;
                this.anyTranslations = true;
            }
        }
    };

    
    module.TransInfo.prototype.compileDataTransPart = function(el, text) {
        var parts = text.split(':');
        // there is nothing to translate
        if (parts.length === 1) {
            return {id: parts[0], countVariable: null,
                    messageId: null, pluralMessageId: null};
        }
        // too many :
        if (parts.length > 2) {
            throw new module.CompilationError(
                el, "illegal content in data-trans");
        }
        // we are referring to the text if we have no actual
        // content identifier
        if (parts[0] === '') {
            return {id: '.', countVariable: null,
                    directive: 'data-trans',
                    messageId: parts[1], pluralMessageId: null};
        }
        // we really do want to have the attribute we are trying to translate
        if (parts[0] !== '.' && !el.hasAttribute(parts[0])) {
            throw new module.CompilationError(
                el, "data-trans refers to a non-existent attribute");
        }
        return {id: parts[0], countVariable: null,
                messageId: parts[1], pluralMessageId: null};
    };


    module.TransInfo.prototype.compileDataTvar = function(el) {
        var dataTvar = null;
        if (el.hasAttribute('data-tvar')) {
            dataTvar = el.getAttribute('data-tvar');
            el.removeAttribute('data-tvar');
        }

        if (dataTvar === null) {
            return;
        }
        
        // we are not in a data-trans, so we cannot allow data-tvar here
        if (!this.allowTvar) {
            throw new module.CompilationError(
                el, ("data-tvar is not allowed outside data-trans or " +
                     "other data-tvar"));
        }
        // we already have content due to data-trans, this is an error
        if (this.content !== null) {
            throw new module.CompilationError(
                el, ("data-trans for element content and " +
                     "data-tvar cannot be both on same element"));
        }
        var tvarInfo = parseTvar(el, dataTvar);
        this.content = {id: '.',
                        directive: 'data-tvar',
                        messageId: tvarInfo.messageId,
                        pluralMessageId: tvarInfo.pluralMessageId,
                        countVariable: null};
    };
    
    module.TransInfo.prototype.compileDataPlural = function(el) {
        var dataPlural = null;
        if (el.hasAttribute('data-plural')) {
            dataPlural = el.getAttribute('data-plural');
            el.removeAttribute('data-plural');
        }

        if (dataPlural === null) {
            return;
        }
        
        dataPlural = trim(dataPlural);
        
        // empty string is not allowed for data-plural
        if (dataPlural === '') {
            throw new module.CompilationError(
                el, 'data-plural cannot be empty');
        }
        
        // split with space character
        var parts = dataPlural.split(' ');
        
        for (var i in parts) {
            var part = trim(parts[i]);
            if (part === '') {
                continue;
            }
            var pluralInfo = this.compileDataPluralPart(el, part);
            if (pluralInfo.id === '.') {
                if (this.content === null) {
                    throw new module.CompilationError(
                        el, "data-plural indicates element content not " +
                            "marked with data-trans");
                }
                this.content.countVariable = pluralInfo.countVariable;
                
            } else {
                var attrInfo = this.attributes[pluralInfo.id];
                if (attrInfo === undefined) {
                    throw new module.CompilationError(
                        el, "data-plural indicates attribute not " +
                            "marked with data-trans: " + pluralInfo.id);
                }
                attrInfo.countVariable = pluralInfo.countVariable;
            }
        }
    };
    
    module.TransInfo.prototype.compileDataPluralPart = function(el, text) {
        var parts = text.split(':');
        // only a count variable for content
        if (parts.length === 1) {
            return {id: '.', countVariable: parts[0]};
        }
        // too many :
        if (parts.length > 2) {
            throw new module.CompilationError(
                el, "illegal content in data-plural");
        }
        // we are referring to the text if we have no actual
        // content identifier
        if (parts[0] === '') {
            return {id: '.', countVariable: parts[1]};
        }
        return {id: parts[0], countVariable: parts[1]};
    };

    module.AttributeTrans = function(el, name, value, messageId) {
        this.messageId = null;
        this.variables = {};
        this.name = name;
        this.compile(el, value);
        if (messageId !== null) {
            this.messageId = messageId;
        }
    };

    module.AttributeTrans.prototype.compile = function(el, value) {
        var result = [];
        // can use cachedTokenize to speed up rendering slightly later
        var tokens = cachedTokenize(value);
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.NAME_TOKEN) {
                var nameFormatter = splitNameFormatter(el, token.value);
                var variable = this.variables[nameFormatter.name];
                if (variable !== undefined &&
                    variable.fullName !== token.value) {
                    throw new module.CompilationError(
                        el, ("same variables in translation " +
                             "must all use same formatter"));
                }
                this.variables[nameFormatter.name] = new module.Variable(
                    el, token.value);
                result.push('{' + nameFormatter.name + '}');
            } else {
                result.push(token.value);
            }
        }
        var messageId = result.join('');
        this.validateMessageId(el, messageId);
        this.messageId = messageId;
    };
    
    module.AttributeTrans.prototype.validateMessageId = function(
        el, messageId) {
        if (messageId === '') {
            throw new module.CompilationError(
                el, "data-trans used on attribute with no text to translate");
        }
        checkMessageId(el, messageId, 'attribute');
    };

    module.AttributeTrans.prototype.getVariable = function(el, scope,
                                                            context, name) {
        var variable = this.variables[name];
        if (variable === undefined) {
            throw new module.RenderError(
                el, "unknown variable in translation: " + name);
        }
        return variable.render(el, scope, context);
    };

    module.AttributeTrans.prototype.renderTranslation = function(
        el, scope, context, translation) {
        var result = [];

        var tokens = cachedTokenize(translation);
        
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.TEXT_TOKEN) {
                result.push(token.value);
            } else if (token.type === module.NAME_TOKEN) {
                result.push(this.getVariable(el, scope, context,
                                              token.value));
            }
        }
        
        el.setAttribute(this.name, result.join(''));
    };
    
    module.AttributeTrans.prototype.render = function(el, scope, context,
                                                      renderNotrans) {
        var getTranslation = context.getTranslation;

        var translation = context.getTranslation(this.messageId);
        if (translation === this.messageId) {
            // if translation is original message id, we can use fast path
            renderNotrans(el, scope, context);
            return;
        }

        this.renderTranslation(el, scope, context, translation);
    };

    module.ContentTrans = function(messageId, directiveName) {
        this.parts = [];
        this.messageId = null;
        this.tvars = {};
        this.variables = {};
        this.directiveName = directiveName;
        this.explicitMessageId = messageId;
    };

    module.ContentTrans.prototype.compileNode = function(node, index) {
        if (node.nodeType === 3) {
            // TEXTNODE
            var text = this.compileText(node);
            this.parts.push(text);
        } else if (node.nodeType === 1) {
            // ELEMENT NODE
            this.checkDataTransRestrictions(node);
            var tvarNode = node.cloneNode(true);
            var tvarInfo = this.compileTvar(tvarNode);
            this.parts.push("{" + tvarInfo.tvar + "}");
            // XXX dynamicNotrans is a bit ugly
            this.tvars[tvarInfo.tvar] = {
                node: tvarNode,
                index: index,
                dynamic: new module.DynamicElement(tvarNode, true),
                dynamicNotrans: new module.DynamicElement(node, true),
                view: tvarInfo.view
            };
        }
        // COMMENTNODE
        // no need to do anything, index for tvars will be correct
        // CDATASECTIONNODE
        // browser differences are rather severe, we just
        // don't support this in output as it's of a limited utility
        // see also:
        // http://reference.sitepoint.com/javascript/CDATASection
        // PROCESSINGINSTRUCTIONNODE
        // we also don't support processing instructions in any
        // consistent way; again they have limited utility
        // ATTRIBUTENODE, DOCUMENTFRAGMENTNODE, DOCUMENTNODE,
        // DOCUMENTTYPENODE, ENTITYNODE, NOTATIONNODE do not
        // occur under elements
        // ENTITYREFERENCENODE does not occur either in FF, as this will
        // be merged with text nodes
    };

    module.ContentTrans.prototype.finalizeCompile = function(el) {
        var messageId = this.parts.join('');
        messageId = module.normalizeSpace(trim(messageId));
        this.validateMessageId(el, messageId);
        this.messageId = messageId;
        if (this.explicitMessageId !== null) {
            this.messageId = this.explicitMessageId;
        }
    };
    
    module.ContentTrans.prototype.checkDataTransRestrictions = function(
        el) {
        // XXX more restrictions?
        if (el.hasAttribute('data-if')) {
            throw new module.CompilationError(
                el,
                "inside data-trans element data-if may not be used");
        }
        if (el.hasAttribute('data-with')) {
            throw new module.CompilationError(
                el,
                "inside data-trans element data-with may not be used");
        }
        if (el.hasAttribute('data-each')) {
            throw new module.CompilationError(
                el,
                "inside data-trans element data-each may not be used");
        }
    };
    
    module.ContentTrans.prototype.compileText = function(node) {
        // need to extract all variables for tvar uniqueness checking
        var result = [];
        var tokens = module.tokenize(node.nodeValue);
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.NAME_TOKEN) {
                var nameFormatter = splitNameFormatter(node, token.value);
                var variable = this.variables[nameFormatter.name];
                if (variable !== undefined &&
                    variable.fullName !== token.value) {
                    throw new module.CompilationError(
                        node, ("same variables in translation " +
                               "must all use same formatter"));
                }
                this.variables[nameFormatter.name] = new module.Variable(
                    node.parentNode, token.value);
                if (this.tvars[nameFormatter.name] !== undefined) {
                    throw new module.CompilationError(
                        node, "data-tvar must be unique within " +
                            this.directiveName + ":" +
                            token.value);
                }
                result.push('{' + nameFormatter.name + '}');
            } else {
                result.push(token.value);
            }
        }
        return result.join('');
    };
    
    module.ContentTrans.prototype.validateMessageId = function(
        el, messageId) {
        // data-tvar doesn't need any of these checks
        if (this.directiveName === 'data-tvar') {
            return;
        }
        if (messageId === '') {
            throw new module.CompilationError(
                el, "data-trans used on element with no text to translate");
        }
        checkMessageId(el, messageId, 'element');
    };
    
    module.ContentTrans.prototype.implicitTvar = function(node, view) {
        if (view !== null) {
            // data-view exists on element, use name as tvar name
            return view.objName;
        }
        // only if we have a single text child node that is a variable
        // by itself do we have an implicit tvar
        if (node.childNodes.length !== 1) {
            return null;
        }
        if (node.childNodes[0].nodeType !== 3) {
            return null;
        }
        var tokens = module.tokenize(node.childNodes[0].nodeValue);

        if (tokens.length !== 1 || tokens[0].type !== module.NAME_TOKEN) {
            return null;
        }
        var nameFormatter = splitNameFormatter(node, tokens[0].value);
        return nameFormatter.name;
    };

    module.ContentTrans.prototype.compileTvar = function(el) {
        var tvar = null;
        if (el.hasAttribute('data-tvar')) {
            tvar = el.getAttribute('data-tvar');
        }
        if (tvar !== null) {
            var tvarInfo = parseTvar(el, tvar);
            tvar = tvarInfo.tvar;
        }
        var view = null;
        if (el.hasAttribute('data-view')) {
            view = new module.ViewElement(el);
        }
        if (tvar === null) {
            tvar = this.implicitTvar(el, view);
            if (tvar === null) {
                throw new module.CompilationError(
                    el, this.directiveName + " element has sub-elements " +
                        "that are not marked with data-tvar");
            }
        }
        
        if (this.tvars[tvar] !== undefined ||
            this.variables[tvar] !== undefined) {
            throw new module.CompilationError(
                el, "data-tvar must be unique within " +
                    this.directiveName + ": " + tvar);
        }
        return {tvar: tvar, view: view};
    };

    module.ContentTrans.prototype.getTvarNode = function(
        el, scope, context, name) {
        var tvarInfo = this.tvars[name];
        if (tvarInfo === undefined) {
            return null;
        }
      
        var tvarNode = tvarInfo.node.cloneNode(true);

        tvarInfo.dynamic.render(tvarNode, scope, context);
        if (tvarInfo.view !== null) {
            tvarInfo.view.render(tvarNode, scope, context);
        }
        return tvarNode;
    };

    module.ContentTrans.prototype.getVariableNode = function(
        el, scope, context, name) {
        var variable = this.variables[name];
        if (variable === undefined) {
            throw new module.RenderError(
                el, "unknown variable in translation: " + name);
        }
        return document.createTextNode(variable.render(el, scope, context));
    };

    module.ContentTrans.prototype.getNode = function(
        el, scope, context, name) {
        var tvarNode = this.getTvarNode(el, scope, context,
                                           name);
        if (tvarNode !== null) {
            return tvarNode;
        }
        return this.getVariableNode(el, scope, context, name);
    };

    module.ContentTrans.prototype.renderTranslation = function(
        el, scope, context, translation) {
        var tokens = cachedTokenize(translation);

        var frag = document.createDocumentFragment();
        
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.TEXT_TOKEN) {
                frag.appendChild(document.createTextNode(token.value));
            } else if (token.type === module.NAME_TOKEN) {
                frag.appendChild(this.getNode(el, scope, context,
                                               token.value));
            }
        }

        // remove any previous contents
        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }
        // move new contents in place
        el.appendChild(frag);
    };
    
    module.ContentTrans.prototype.render = function(el, scope, context,
                                                    renderNotrans) {
        var messageId = this.messageId;
        var translation = messageId;
        var getTranslation = context.getTranslation;
        if (getTranslation !== null && getTranslation !== undefined) {
            translation = getTranslation(messageId);
        }

        if (translation === messageId) {
            renderNotrans(el, scope, context);
            this.renderNotransTvars(el, scope, context);
            return;
        }
        
        this.renderTranslation(el, scope, context, translation);
    };

    module.ContentTrans.prototype.renderNotransTvars = function(
        el, scope, context) {
        var children = el.childNodes;
        for (var key in this.tvars) {
            var info = this.tvars[key];
            // this can use index, as we're not in a plural
            info.dynamicNotrans.render(children[info.index], scope, context);
        }
    };
    
    module.PluralTrans = function(singular,
                                  plural,
                                  countVariable) {
        this.singular = singular;
        this.plural = plural;
        this.countVariable = countVariable;
    };
    
    module.PluralTrans.prototype.getCount = function(el, scope) {
        var result = scope.resolve(this.countVariable);
        if (typeof result !== 'number') {
            throw new module.RenderError(
                el, "count variable in plural is not a number: " + result);
        }
        return result;
    };
    
    module.PluralTrans.prototype.render = function(
        el, scope, context, renderNotrans) {
        var count = this.getCount(el, scope);
        var translation = context.getPluralTranslation(
            this.singular.messageId,
            this.plural.messageId,
            count);
        // we use the source language plural form as the basis for
        // translation, meaning its tvars will end up in the translated
        // content if referred to by variable in the translation
        this.plural.renderTranslation(el, scope, context, translation);
    };
    
    module.IfExpression = function(el, text) {
        this.el = el;
        text = trim(text);
        this.notEnabled = text.charAt(0) === '!';
        var name = null;
        if (this.notEnabled) {
            name = text.slice(1);
        } else {
            name = text;
        }
        validateDottedName(el, name);
        this.dataIf = module.resolveFunc(name);
    };

    module.IfExpression.prototype.resolve = function(el, scope) {
        var result = this.dataIf(scope),
            tf;
        if ($.isArray(result) && result.length === 0) {
            tf = false;
        } else {
            if (result) {
                tf = true;
            } else {
                tf = false;
            }
        }
        if (this.notEnabled) {
            return (!tf);
        }
        return tf;
    };
    
    module.Scope = function(obj) {
        this.stack = [obj];
    };
    
    module.Scope.prototype.push = function(obj) {
        this.stack.push(obj);
    };
    
    module.Scope.prototype.pop = function() {
        this.stack.pop();
    };
    
    // note that this function is not used outside of the
    // translation system; instead function generated with the code
    // generator is used
    module.Scope.prototype.resolve = function(dottedName) {
        if (dottedName === '@.') {
            return this.stack[this.stack.length - 1];
        } else if (dottedName === '@open') {
            return '{';
        } else if (dottedName === '@close') {
            return '}';
        } else if (dottedName === '@doublepipe') {
            return '||';
        }
        var names = dottedName.split('.');
        for (var i = this.stack.length - 1; i >= 0; i--) {
            var obj = this.stack[i];
            var result = resolveInObj(obj, names);
            if (result !== undefined) {
                return result;
            }
        }
        return undefined;
    };

    resolveInObj = function(obj, names) {
        for (var i in names) {
            var name = names[i];
            obj = obj[name];
            if (obj === undefined) {
                return undefined;
            }
        }
        return obj;
    };
    
    module.resolveFunc = function(dottedName) {
        var c = new module.Codegen('scope');
        if (dottedName === '@.') {
            c.push('return scope.stack[scope.stack.length - 1];');
            return c.getFunction();
        } else if (dottedName === '@open') {
            c.push('return "{";');
        } else if (dottedName === '@close') {
            c.push('return "}";');
        } else if (dottedName === '@doublepipe') {
            c.push('return "||";');
        }
        
        c.push('for (var i = scope.stack.length - 1; i >= 0; i--) {');
        c.push('  var obj = scope.stack[i];');
        var names = dottedName.split('.');
        var name = null;
        for (var i = 0; i < names.length - 1; i++) {
            name = names[i];
            c.push('  obj = obj["' + name + '"];');
            c.push('  if (obj === undefined) {');
            c.push('    continue;');
            c.push('  }');
        }
        name = names[names.length - 1];
        c.push('  obj = obj["' + name + '"];');
        c.push('  if (obj !== undefined) {');
        c.push('    return obj;');
        c.push('  }');
        
        c.push('}');
        c.push('return undefined;' );
        return c.getFunction();
    };

    module.Registry = function() {
        this.clear();
    };
    
    module.Registry.prototype.register = function(name, f) {
        this.registrations[name] = f;
    };

    module.Registry.prototype.get = function(name) {
        return this.registrations[name];
    };

    module.Registry.prototype.clear = function() {
        this.registrations = {};
    };
    
    formatters = new module.Registry();

    module.registerFormatter = function(name, f) {
        formatters.register(name, f);
    };

    module.getFormatter = function(name) {
        return formatters.get(name);
    };
    
    module.clearFormatters = function() {
        formatters.clear();
    };
    
    funcs = new module.Registry();

    module.registerFunc = function(name, f) {
        funcs.register(name, f);
    };

    module.getFunc = function(name) {
        return funcs.get(name);
    };
    
    module.clearFuncs = function() {
        funcs.clear();
    };
   
    defaultViewName = 'default';

    module.setDefaultViewName = function(name) {
        defaultViewName = name;
    };

    morphElement = function(el, name) {
        var newEl = document.createElement(name);
        var i;
        
        // copy over all attributes from old element
        for (i = 0; i < el.attributes.length; i++) {
            var attr = el.attributes[i];
            if (attr.specified !== true) {
                continue;
            }
            if (attr.value === null) {
                continue;
            }
            newEl.setAttribute(attr.name, attr.value);
        }
        
        // copy over all sub-elements from old element
        for (i = 0; i < el.childNodes.length; i++) {
            var child = el.childNodes[i];
            newEl.appendChild(child);
        }

        // copy all events
        var events = $(el).data('events');
        if (events !== undefined) {
            $.each(events, function(key, value) {
                $.each(value, function(sub, v) {
                    $(newEl).bind(v.type, v.handler);
                });
            });
        }

        // put new element in its place
        el.parentNode.replaceChild(newEl, el);


        return newEl;
    };
    
    getDirective = function(el, name) {
        var value = null;
        if (!el.hasAttribute(name)) {
            return null;
        }
        
        value = el.getAttribute(name);
        if (value === null || value === '') {
            throw new module.CompilationError(
                el, name + " may not be empty");
        }
        
        el.removeAttribute(name);
        
        return value;
    };

    splitNameFormatters = function(el, text) {
        var parts = trim(text).split(' ');
        var result = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            result.push(splitNameFormatter(el, part));
        }
        return result;
    };
    
    splitNameFormatter = function(el, name) {
        var nameParts = name.split('|');
        if (nameParts.length === 1) {
            return {
                name: nameParts[0],
                formatter: null
            };
        }
        if (nameParts.length !== 2) {
            throw new module.CompilationError(
                el, "variable may only have a single | in it");
        }
        return {
            name: nameParts[0],
            formatter: nameParts[1]
        };
    };

    checkMessageId = function(el, messageId, elementOrAttribute) {
        // cache the tokens so we get things faster during rendering time
        var tokens = cachedTokenize(messageId);
        var nameTokens = 0;
        for (var i in tokens) {
            var token = tokens[i];
            // if we run into any non-whitespace text token at all,
            // we assume we have something to translate
            if (token.type === module.TEXT_TOKEN) {
                if (trim(token.value) !== '') {
                    nameTokens = null;
                    break;
                }
            } else if (token.type === module.NAME_TOKEN) {
                nameTokens++;
            }
        }
        // we have found non-empty text tokens we can translate them
        if (nameTokens === null) {
            return;
        }
        // if we find no or only a single name token, we consider this
        // an error. more than one name tokens are considered translatable,
        // at least in their order
        if (nameTokens <= 1) {
            throw new module.CompilationError(
                el, "data-trans used on " + elementOrAttribute +
                    " with no text to translate");
        }
    };

    parseTvar = function(el, tvar) {
        var parts = tvar.split(':');
        if (parts.length === 1) {
            return {
                tvar: parts[0],
                messageId: null,
                pluralMessageId: null
            };
        } else if (parts.length === 0 ||
                   parts.length > 2 ||
                   parts[0] === '' ||
                   parts[1] === '') {
            throw new module.CompilationError(
                el, "illegal content in data-tvar");
        }
        return {
            tvar: parts[0],
            messageId: parts[1],
            pluralMessageId: null
        };
    };

    parseTextForPlural = function(text) {
        var beforePlural = [];
        var afterPlural = [];
        
        var current = beforePlural;
        var tokens = module.tokenize(text);
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.NAME_TOKEN) {
                current.push('{' + token.value + '}');
            } else {
                var value = token.value;
                // XXX shouldn't allow || twice
                var index = value.indexOf('||');
                if (index !== -1) {
                    current.push(value.slice(0, index));
                    current = afterPlural;
                    value = value.slice(index + 2);
                }
                current.push(value);
            }
        }

        beforePlural = beforePlural.join('');
        
        if (current === afterPlural) {
            afterPlural = afterPlural.join('');
        } else {
            afterPlural = null;
        }
        
        return {beforePlural: beforePlural,
                afterPlural: afterPlural};
    };

    var getAllVariableNames = function(singular, plural) {
        var names = $.extend({}, singular.variables);
        if (plural !== null) {
            $.extend(names, plural.variables);
        }
        return names;
    };
    
    getImplicitCountVariable = function(el, singular, plural) {
        var names = getAllVariableNames(singular, plural);
        
        var result = null;
        for (var name in names) {
            if (result === null) {
                result = name;
            } else {
                // if we already have seen a variable, then getting
                // a second variable means we have multiple variables
                // and therefore we can't find a single count variable
                result = null;
                break;
            }
        }
        if (result === null) {
            throw new module.CompilationError(
                el, "could not determine implicit count variable for plural");
        }
        return result;
    };

    // this might be too restrictive; we can open it up more on the long
    // run. We definitely don't want to open to {}, \, ' and ", as this
    // could potentially be used to sneak code into the
    // resolve function code generator.
    var validNameRe = new RegExp('[A-Za-z0-9_]+');
    
    validateDottedName = function(el, dottedName) {
        dottedName = trim(dottedName);
        if (dottedName === '') {
            throw new module.CompilationError(el, 'name cannot be empty');
        }
        if (dottedName === '@.') {
            return;
        }
        var parts = dottedName.split('.');
        for (var i = 0; i < parts.length; i++) {
            if (!validNameRe.exec(parts[i])) {
                throw new module.CompilationError(
                    el, "invalid name: " + dottedName);
            }
        }
    };

    getIndexInParent = function(el) {
        var parent = el.parentNode;
        if (parent === null || parent.nodeType !== 1) {
            return null;
        }
        var c = 0,
            found = null,
            node;
        for (var i = 0; i < parent.childNodes.length; i++) {
            node = parent.childNodes[i];
            if (node.nodeName !== el.nodeName) {
                continue;
            }
            if (parent.childNodes[i] === el) {
                found = c;
            }
            c++;
        }
        if (c <= 1) {
            return null;
        }
        return found + 1;
    };
    
    module.getXpath = function(el) {
        var index, name, path = [];
        while (el !== null && el.nodeType === 1) {
            name = el.tagName.toLowerCase();
            index = getIndexInParent(el);
            if (index !== null) {
                name += '[' + index + ']';
            }
            path.push(name);
            el = el.parentNode;
        }
        path.reverse();
        return '/' + path.join('/');
    };

    var startsWith = function(s, startswith) {
        return (s.slice(0, startswith.length) === startswith);
    };

    trim = function(s) {
        return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    module.normalizeSpace = function(s) {
        return s.replace(/^\s+|\s+$/g, '').replace(
                /\s{2,}/g, ' ').replace(/\s/g, ' ');
    };
    
    isHtmlText = function(text) {
        return trim(text).charAt(0) === '<';
    };

    module.Codegen = function(args) {
        this.args = args;
        this.result = [];
    };

    module.Codegen.prototype.push = function(s) {
        this.result.push(s);
    };

    module.Codegen.prototype.getFunction = function() {
        /*jshint evil:true*/
        var code = this.result.join('');
        return new Function(this.args, code);
    };

    module.variables = function(text, variables) {
        var tokens = module.tokenize(text);
        var result = [];
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === module.NAME_TOKEN) {
                result.push(variables[token.value]);
            } else if (token.type === module.TEXT_TOKEN) {
                result.push(token.value);
            }
        }
        return result.join('');
    };
    
    module.tokenize = function(text) {
        // fast path for empty text
        if (text === '') {
            return [];
        }
        var result = [];
        var index = 0;
        var lastIndex = 0;
        var textToken = '';
        while (true) {
            var openIndex = text.indexOf('{', index);
            if (openIndex === -1) {
                textToken = text.slice(lastIndex);
                if (textToken !== '') {
                    result.push({
                        type: module.TEXT_TOKEN,
                        value: textToken
                    });
                }
                break;
            }
            var nextChar = text.charAt(openIndex + 1);
            if (nextChar === '' ||
                nextChar === ' ' ||
                nextChar === '\t' ||
                nextChar === '\n') {
                index = openIndex + 1;
                continue;
            }
            index = openIndex + 1;
            var closeIndex = text.indexOf('}', index);
            if (closeIndex === -1) {
                textToken = text.slice(lastIndex);
                if (textToken !== '') {
                    result.push({
                        type: module.TEXT_TOKEN,
                        value: textToken
                    });
                }
                break;
            }
            textToken = text.slice(lastIndex, openIndex);
            if (textToken !== '') {
                result.push({
                    type: module.TEXT_TOKEN,
                    value: textToken
                });
            }
            var nameToken = text.slice(index, closeIndex);
            var trimmedNameToken = trim(nameToken);
            if (trimmedNameToken === '') {
                result.push({
                    type: module.TEXT_TOKEN,
                    value: '{' + nameToken + '}'
                });
            } else {
                result.push({
                    type: module.NAME_TOKEN,
                    value: trimmedNameToken
                });
            }
            index = closeIndex + 1;
            lastIndex = index;
        }
        
        return result;
    };

    var _tokenCache = {};

    var MAXCACHEDTEXTLENGTH = 100;
    
    cachedTokenize = function(text) {
        // don't cache if it's too big
        if (text.length > MAXCACHEDTEXTLENGTH) {
            return module.tokenize(text);
        }
        var cached = _tokenCache[text];
        if (cached !== undefined) {
            return cached;
        }
        var result = module.tokenize(text);
        _tokenCache[text] = result;
        return result;
    };
    
}(jQuery, obviel.template));
