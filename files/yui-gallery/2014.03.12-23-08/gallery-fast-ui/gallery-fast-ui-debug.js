YUI.add('gallery-fast-ui', function (Y, NAME) {

/**
 * @public
 * @param name
 * @param value
 * @param type type can be any of : string (default if it's an attribute), ui (default if it's an ui:config element),
 *              or js.
 * @constructor
 */
function WidgetConfigProperty(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
}
/**
 *
 * @param {String} nodeId The ID in the DOM where the node should be inserted.
 * @param {String} className The full name of the class to be instantiated, e.g. Y.Button
 * @param config WidgetConfig The configuration for that widget that will be sent on construction.
 * @constructor
 */
function WidgetDefinition(nodeId, className, config) {
    this.nodeId = nodeId;
    this.className = className;
    this.config = config;
}
function WidgetConfig(properties, globalConfigKey, srcNode) {
    this.properties = !!properties ? properties : {};
    this.globalConfigKey = globalConfigKey;
    this.srcNode = srcNode;
}

WidgetConfig.prototype.addProperty = function(name, value, type) {
    type = !!type ? type : "string";

    this.properties[name] = new WidgetConfigProperty(name, value, type);
};

/**
 * Builds a WidgetConfig from the DOM element given.
 */
WidgetConfig.buildFromElement = function(id, element, configNodes) {
    var widgetConfig = new WidgetConfig();

    readConfigFromAttributes(id, widgetConfig, element);
    readConfigFromElements(widgetConfig, configNodes);

    return widgetConfig;
};

/**
 * Read values that should be passed to the config from the attributes of the element.
 * @param {string} id - unique ID in the DOM.
 * @param {WidgetConfig} widgetConfig
 * @param element
 */
function readConfigFromAttributes(id, widgetConfig, element) {
    var attribute,
        attributeName,
        attributeValue,
        attributeNamespace,
        i;

    for (i = 0; i < element.attributes.length; i++) {
        attribute = element.attributes[i];

        attributeName = attribute.localName || attribute.baseName;
        attributeValue = attribute.value;
        attributeNamespace = !!attribute.namespaceURI ? attribute.namespaceURI : null;

        if (attributeName === "config-key" && attributeNamespace === "fastui") {
            widgetConfig.globalConfigKey = attributeValue;
            continue;
        }

        if (attributeName === "srcNode" && attributeNamespace === "fastui") {
            widgetConfig.srcNode = attributeValue;
            widgetConfig.addProperty("srcNode", "#" + id);

            continue;
        }

        if (attributeName === "id" || !!attributeNamespace) {
            continue;
        }

        widgetConfig.addProperty(attributeName, attributeValue);
    }
}

/**
 * Read the values that should be passed to the config from &lt;ui:config&gt; elements.
 * @param widgetConfig
 * @param configNodes
 */
function readConfigFromElements(widgetConfig, configNodes) {
    var configNode, name, value, type, i;

    for (i = 0; i < configNodes.length; i++) {
        configNode = configNodes[i];

        name = configNode.getAttribute("name");
        type = configNode.getAttribute("type");
        type = !!type ? type : "js"; // the default type for config elements is "js"

        value = extractContents(configNode, type);

        widgetConfig.addProperty(name, value, type);
    }
}

/**
 * Extract the contents from the element depending on the type of the node.
 */
function extractContents(xmlNode, type) {
    if ("ui" === type) {
        return getUiNodeAsString(xmlNode);
    } else if ("js" === type) {
        return getJsNodeAsString(xmlNode);
    }
    return getStringNodeAsString(xmlNode);
}

/**
 * Returns the contents of the node, and wrap it in a span, since multiple nodes could exist.
 * @param xmlNode
 */
function getUiNodeAsString(xmlNode) {
    var i,
        result = "<span>";

    for (i = 0; i < xmlNode.childNodes.length; i++) {
        result += Y.XML.format(xmlNode.childNodes[i]);
    }

    result += "</span>";

    return result;
}

/**
 * Returns the contents of the JS node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getJsNodeAsString(xmlNode) {
    return xmlNode.textContent || xmlNode.text;
}

/**
 * Returns the contents of the String node as a string.
 * @param xmlNode
 * @returns {*}
 */
function getStringNodeAsString(xmlNode) {
    return xmlNode.textContent || xmlNode.text;
}

/**
 * A parser result is the result after an XML parsing with more work in
 * store to be done by the FastUiBuilder.
 *
 *
 * It contains a list with the variables that are needed to be filled in, all the widgets that are still to be
 * created, and the htmlContent with the widget references removed, and replaced by either &lt;span&gt;s (default),
 * or elements with the type of whatever was specified in the ui:srcNode attribute.
 *
 * @constructor
 * @param {Object} variables A map from the variable name to the DOM element ID from the htmlContent where the
 *                  widget will be created, or the DOM node itself that will be returned, if it's not a custom
 *                  widget.
 * @param {Array} widgetDefinitions An array of WidgetConfig with all the widgets that need to be created,
 * @param {String} htmlContent An initial HTML content that will be created. Widgets will have their definitions
 *                  replaced by a &lt;span/&gt; (or elements specified by ui:srcNode), and the rendering will be done
 *                  using that element.
 */
function ParserResult(variables, widgetDefinitions, htmlContent) {
    /**
     * @public
     * Variables detected.
     */
    this.variables = variables;

    /**
     * @public
     * Widgets detected.
     */
    this.widgetDefinitions = widgetDefinitions;

    /**
     * @public
     * The HTML code resulted.
     */
    this.htmlContent = htmlContent;
}
/**
 * Parses a XML template, and finds out what variables need to be filled in into the response,
 * what widgets need to be created, and gets from the XML a HTML template that uses just regular
 * DOM elements, deferring the build of the widges themselves to the {FastUiBuilder}.
 *
 * @constructor
 */
function TemplateParser() {
    /**
     * A map of variable to ID of element in the DOM where the variable should be extracted from.
     * @public
     * @type {Object}
     */
    this.variables = {};

    /**
     * An array of widget configs, for all the widgets that should be created. The widgets
     * are sorted from the container elements, downwards to "simple" elements.
     * @type {Array<WidgetConfig>}
     */
    this.widgets = [];

    /**
     * The html content that should be initially created, and afterwards, the widgets built on top.
     * @type {string}
     */
    this.htmlContent = "";
}

/**
 * Parse some xml content.
 * @param xmlContent
 * @returns {ParserResult}
 */
TemplateParser.prototype.parse = function (xmlContent) {
    var xmlDoc = Y.XML.parse(xmlContent);

    this.traverseElement(xmlDoc.firstChild);

    this.htmlContent = Y.XML.format(xmlDoc.firstChild);

    return new ParserResult(this.variables, this.widgets, this.htmlContent);
};

/**
 * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions.
 * @param element Start element.
 */
TemplateParser.prototype.traverseElement = function (element) {
    var i,
        childElement,
        configNodes = [],
        widgetId,
        needsId = false;

    for (i = 0; i < element.childNodes.length; i++) {
        childElement = element.childNodes[i];
        // IE up to 8 incorrectly counts comment nodes
        if (childElement.nodeType === 1) {
            // if it's a configuration node, store it for widget config, and prepare to remove it from the final template.
            if (this.isConfigElement(childElement)) {
                configNodes.push(childElement);
                continue; // don't traverse the configuration node.
            }

            this.traverseElement(childElement);
        }
    }

    // remove the configuration node from the final template.
    for (i = 0; i < configNodes.length; i++) {
        element.removeChild( configNodes[i] );
    }

    widgetId = this.getId(element);

    needsId = this.registerVariable(element, widgetId) || needsId;
    needsId = this.registerWidget(element, widgetId, configNodes) || needsId;

    if (needsId) {
        this._ensureElementHasId(element, widgetId);
    }
};


TemplateParser.prototype._ensureElementHasId = function(element, widgetId) {
    if (!this.getAttribute(element, "id")) {
        element.setAttribute("id", widgetId);
    }
};

/**
 *
 * @param element
 * @param widgetId
 * @returns {boolean}
 */
TemplateParser.prototype.registerVariable = function(element, widgetId) {
    var uiField = this.getAttribute(element, 'field', 'fastui');

    if (uiField) {
        this.variables[uiField] = widgetId;
        return true;
    }

    return false;
};

TemplateParser.prototype.isConfigElement = function(element) {
    var elementName = element.localName || element.baseName;

    return element.namespaceURI &&
        element.namespaceURI === "fastui" &&
        elementName === "config";
};

TemplateParser.prototype.registerWidget = function(element, widgetId, configNodes) {
    // there is a namespace URI, we need to create a WidgetDefinition
    if (!element.namespaceURI) {
        return false;
    }

    var elementName = element.localName || element.baseName,
        placeHolderElement,
        fullClassName = element.namespaceURI + "." + elementName,
        widget = new WidgetDefinition(
            widgetId,
            fullClassName,
            WidgetConfig.buildFromElement(widgetId, element, configNodes)
        );

    placeHolderElement = this.createPlaceHolderElement(element, widgetId);

    this.widgets.push(widget);

    element.parentNode.replaceChild(placeHolderElement, element);

    return true;
};


TemplateParser.prototype.getAttribute = function(element, attributeName, namespaceURI) {
    var i, attribute, attrName;

    if (!element.attributes) {
        return null;
    }

    namespaceURI = !!namespaceURI ? namespaceURI : null;

    for (i = 0; i < element.attributes.length; i++) {
        attribute = element.attributes[i];
        attrName = attribute.localName || attribute.baseName;

        if (attrName === attributeName &&
            attribute.namespaceURI === namespaceURI) {
            return attribute.value;
        }
    }

    return null;
};

TemplateParser.prototype.getId = function(element) {
    var id = this.getAttribute(element, 'id');

    // if the element does not have an id, we create one
    if (!id) {
        id = Y.guid('fast-ui-');
    }

    return id;
};

TemplateParser.prototype.getElementType = function(element) {
    var srcNodeType = this.getAttribute(element, "srcNode", "fastui");

    return srcNodeType ? srcNodeType : "span";
};

TemplateParser.prototype.createPlaceHolderElement = function(sourceElement, widgetId) {
    var document = sourceElement.ownerDocument,
        elementType = this.getElementType(sourceElement),
        newElement = document.createElement(elementType),
        child;

    newElement.setAttribute('id', widgetId);

    while (!!(child = sourceElement.firstChild)) {
        sourceElement.removeChild(child);
        newElement.appendChild(child);
    }

    return newElement;
};

/**
 * @private
 * @param element
 * @param name
 * @param value
 */
TemplateParser.prototype.setAttribute = function(element, name, value) {
    Y.one(element).setAttribute(name, value);
};
/**
 * @public
 * @param {Element} parent       Where should the built UI be appended after it's built.
 * @param {string} xmlContent   The UI that is supposed to be built.
 * @param {object} msg          I18N messages, that will be substituted in the XML.
 * @param {object} globalConfig Configuration for various UI elements.
 * @constructor
 */
function FastUiBuilder(parent, xmlContent, msg, globalConfig) {
    this.parent = !!parent ? Y.one(parent) : null;
    this.xmlContent = xmlContent;
    this.msg = msg;
    this.globalConfig = globalConfig;
}

/**
 * Creates all the DOM elements and widgets that were in this.xmlContent.
 *
 * @public
 * @this {FastUiBuilder}
 * @returns {object} A map of widgets or dom elements that were created, that were marked with the ui:field attribute.
 */
FastUiBuilder.prototype.parse = function() {
    var parseResult = this._parseXmlTemplate(),
        variables = parseResult.variables,
        widgetDefinitions = parseResult.widgetDefinitions,
        newWidget,
        key,
        nodeId,
        i;

    this.rootNode = this._createRootDomNode(parseResult);
    this.createdWidgets = {}; // // so far no widgets are yet created.

    this.result = {};

    // build the widgets and keep track of the created widgets.
    for (i = widgetDefinitions.length - 1; i >= 0; i--) {
        newWidget = this._createWidget(widgetDefinitions[i]);
        this.createdWidgets[widgetDefinitions[i].nodeId] = newWidget;
    }

    for (key in variables) {
        if (variables.hasOwnProperty(key)) {
            nodeId = variables[key];
            this.result[key] = this._getWidgetOrNode(nodeId);
        }
    }

    this.result._rootNode = this.rootNode;

    if (this.parent) {
        this.parent.appendChild(this.rootNode);
    } else {
        Y.one("body").removeChild( this.rootNode );
    }

    return this.result;
};

/**
 * Translate and parse the XML.
 * @private
 * @returns {ParserResult}
 */
FastUiBuilder.prototype._parseXmlTemplate = function() {
    var translatedXml = this.msg ? Y.Lang.sub(this.xmlContent, this.msg) : this.xmlContent;

    return new TemplateParser().parse(translatedXml);
};


/**
 * Create the initial DOM nodes, on top which the widgets will be created.
 * @private
 * @param parseResult
 * @returns {Y.Node}
 */
FastUiBuilder.prototype._createRootDomNode = function(parseResult) {
    var htmlContent = parseResult.htmlContent,
        closedNodeHtmlBugFix = htmlContent.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>"),
        rootNode;

    rootNode = Y.Node.create(closedNodeHtmlBugFix);

    Y.one("body").appendChild(rootNode);

    return rootNode;
};

/**
 * Given an ID return either the node whose ID it is, or if a widget was created for that ID,
 * return the widget.
 * @private
 * @param nodeId
 * @returns {Element | Object}
 */
FastUiBuilder.prototype._getWidgetOrNode = function(nodeId) {
    var widget = this.createdWidgets[nodeId];

    return widget ? widget : this.rootNode.one("#" + nodeId);
};

/**
 * Create a widget, using the given WidgetConfig.
 * @private
 * @param {WidgetConfig} widget Widget configuration (usually obtain after parsing).
 * @returns {Object} Newly created widget.
 */
FastUiBuilder.prototype._createWidget = function(widget) {
    var ClassConstructor = this._getClassConstructor(widget.className),
        classConfig = this._getClassConfig(widget.config),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    if (widget.config.srcNode) {
        classInstance.render();
    } else {
        placeHolderElement = this._findElement(widget.nodeId);
        classInstance.render(placeHolderElement);
    }

    if (widget.nodeId === this.rootNode.get("id")) {
        this.rootNode = classInstance.get("boundingBox");
    }

    return classInstance;
};

/**
 * Attempt to find an element under the rootNode.
 * @private
 * @param {String} id Id of the element to be found.
 * @returns {Y.Node}
 */
FastUiBuilder.prototype._findElement = function(id) {
    if (this.rootNode.get("id") === id) {
        return this.rootNode;
    } else {
        return this.rootNode.one("#" + id);
    }
};

/**
 * From a given class name, obtain the function that we're supposed to instantiate.
 * @private
 * @param {String} fullyQualifiedName The name of the function that needs to be created.
 * @returns {Function} Function class that needs to be created.
 */
FastUiBuilder.prototype._getClassConstructor = function(fullyQualifiedName) {
    if (/^Y\./.test(fullyQualifiedName)) {
        var matches = /^Y\.((.*)\.)?(.*?)$/.exec(fullyQualifiedName),
            packageName = matches[2],
            className = matches[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
};

/**
 * Obtain the object that needs to be passed as an argument to the function, from a widgetConfiguration.
 * @private
 * @param {WidgetConfig} widgetConfig
 * @returns {Object} Configuration object.
 */
FastUiBuilder.prototype._getClassConfig = function(widgetConfig) {
    var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    mix(finalConfig, this._evaluateProperties(widgetConfig.properties));

    if (this.globalConfig && widgetConfig.globalConfigKey) {
        widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];

        mix(finalConfig, widgetGlobalConfig);
    }

    return finalConfig;
};

/**
 *
 * @param {Object} propertiesMap A map of {WidgetConfigProperty}
 * @returns {Object}
 * @private
 */
FastUiBuilder.prototype._evaluateProperties = function(propertiesMap) {
    var key,
        result = {};

    for (key in propertiesMap) {
        if (propertiesMap.hasOwnProperty(key)) {
            result[key] = this.evaluatePropertyValue(
                propertiesMap[key],
                null
            );
        }
    }

    return result;
};

/**
 * @private
 * @param {WidgetConfigProperty} widgetConfigProperty
 * @param config
 * @returns {*}
 */
FastUiBuilder.prototype.evaluatePropertyValue = function(widgetConfigProperty, config) {
    if ("string" === widgetConfigProperty.type &&
        "srcNode" === widgetConfigProperty.name) {

        return this.rootNode.one(widgetConfigProperty.value);
    }

    if ("string" === widgetConfigProperty.type) {
        return widgetConfigProperty.value;
    } else if ("ui" === widgetConfigProperty.type) {
        var builtUi = new FastUiBuilder(null, widgetConfigProperty.value, null, config).parse();

        mix(this.result, builtUi);

        return builtUi._rootNode;
    } else if ("js" === widgetConfigProperty.type) {
        return eval(widgetConfigProperty.value);
    }
};

/**
 * @private
 * @param {Object} target The target where the properties of the other arguments will be copied into.
 * @param {...Object} args Objects that will have their properties copied into the target.
 * Add one or more items passed as arguments into the target.
 */
function mix(target) {
    var i, key;

    for (i = 1; i < arguments.length; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                target[key] = arguments[i][key];
            }
        }
    }
}
/**
 * Renders the xmlContent into the parent, using the msg for translation, and globalConfig for other widget configurations.
 * @param parent
 * @param xmlContent
 * @param [msg]
 * @param [globalConfig]
 * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set.
 */
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};

/**
 * @param {String | Element | Y.Node} parent
 * @param {String} xmlContent
 * @param {Object} [msg]
 * @param {Function} [callback] The callback that will be called when the ui is the first time created.
 * @param {Object} [globalConfig]
 * @returns {Function}
 */
Y.lazyUi = function(parent, xmlContent, msg, callback, globalConfig) {
    var ui,
        result;

    result = function () {
        if (!!ui) {
            return ui;
        }

        ui = Y.fastUi(parent, xmlContent, msg, globalConfig);

        if (!!callback) {
            callback(ui);
        }

        return ui;
    };

    return result;
};


}, 'gallery-2013.09.04-21-56', {"requires": ["datatype-xml", "node", "widget", "yui-base"]});
