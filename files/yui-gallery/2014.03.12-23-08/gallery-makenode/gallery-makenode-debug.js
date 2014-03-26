YUI.add('gallery-makenode', function (Y, NAME) {

/**
An extension for Widget to create markup from templates,
create CSS classNames, locating elements,
assist in attaching events to UI elements and to reflect attribute changes into the UI.
All of its members are either protected or private.
Developers using MakeNode should use only those marked protected.
<b>Enable the Show Protected checkbox to see them</b>.
@module gallery-makenode
@class MakeNode
 */
    "use strict";
    var WS = /\s+/,
        NODE = 'Node',
        DOT = '.',
        BBX = 'boundingBox',
        Lang = Y.Lang,
        DUPLICATE = ' for "{name}" defined in class {recentDef} also defined in class {prevDef}',
        bracesRegExp = /\{\s*([^{}]+)\s*\}/g,
        parsingRegExp = /^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/,
        quotesRegExp = /\\"/g,

        /**
        Creates CSS classNames from suffixes listed in <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>,
        stores them in <a href="#property__classNames">`this._classNames`</a>.
        Concatenates <a href="#property__ATTRS_2_UI">`_ATTRS_2_UI`</a> into `_UI_ATTRS`.
        Sets listeners to render and destroy events to attach/detach UI events.
        If there is no renderUI defined in this class or any of its ancestors (not counting Widget which has a dummy one)
        it will add a default one appending the result of processing _TEMPLATE and then call _locateNodes.
        @constructor
         */
        MakeNode = function () {
            var self = this;
            self._eventHandles = [];
            self._makeClassNames();
            self._concatUIAttrs();
            self._publishEvents();
            self.after('render', self._attachEvents, self);
            self.after('destroy', self._detachEvents, self);
            if (self.renderUI === Y.Widget.prototype.renderUI) {
                self.renderUI = self._autoRenderUI;
            }
        };
    MakeNode.prototype = {
        /**
        Method to be used if no explicit renderUI method is defined.
        @method _autoRenderUI
        @private
         */
        _autoRenderUI: function () {
            this.get('contentBox').append(this._makeNode());
            this._locateNodes();
        },
        /**
        An array of event handles returned when attaching listeners to events,
        meant to detach them all when destroying the instance.
        @property _eventHandles
        @type Array
        @private
         */
        _eventHandles:null,
        /**
        Contains a hash of CSS classNames generated from the entries in <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
        indexed by those same values.
        It will also have the following entries added automatically:

        * `boundingBox` The className for the boundingBox
        * `content` The className for the contentBox
        * `HEADER` The className for the header section of a StdMod if Y.WidgetStdMod has been loaded
        * `BODY` The className for the body section of a StdMod if Y.WidgetStdMod has been loaded
        * `FOOTER` The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded


        @property _classNames
        @type Object
        @protected
         */
        _classNames:null,
        /**
        Hash listing the template processing codes and the functions to handle each.
        The processing functions will receive a string with the arguments that follow the processing code,
        and the extra, second argument passed on to _makeNode (or _substitute)
        and should return the replacement value for the placeholder.
        @property _templateHandlers
        @type Object
        @private
         */
        _templateHandlers: {
            '@': function (arg) {
                return this.get(arg);
            },
            'p': function (arg) {
                return this[arg];
            },
            'm': function (args) {
                var method = args.split(WS)[0];
                args = args.substr(method.length);
                args = this._parseMakeNodeArgs(args);
                return this[method].apply(this, args);
            },
            'c': function (arg) {
                return this._classNames[arg];
            },
            's': function (arg, extras) {
                return this._substitute(this.get('strings')[arg], extras);
            },
            '?': function(args) {
                args = this._parseMakeNodeArgs(args);
                return (!!args[0])?args[1]:args[2];
            },
            '1': function (args) {
                args = this._parseMakeNodeArgs(args);
                return parseInt(args[0],10) ===1?args[1]:args[2];
            },
            'n': function (args, extras) {
                var fn, key, value = this;
                args = args.split(WS);

                while (value && args.length) {
                    key = args.shift();
                    fn = this._templateHandlers[key.toLowerCase()];
                    if (!fn) {
                        return undefined;
                    }
                    value =  fn.call(value, args.shift(), extras);
                }
                return value;
            }

        },
        /**
        Parses the arguments received by the processor of the `{m}` placeholder.
        It recognizes numbers, `true`, `false`, `null`
        and double quoted strings, each separated by whitespace.
        It skips over anything else.
        @method _parseMakeNodeArgs
        @param arg {String} String to be parsed for arguments
        @return {Array} Array of arguments found, each converted to its proper data type
        @private
         */
        _parseMakeNodeArgs: function (arg) {
            var args = [],
                matcher = function (match, i) {
                    if (match !== undefined && i) {
                        switch (i) {
                            case 1:
                                break;
                            case 2:
                                args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'"'));
                                break;
                            case 3:
                                args.push(true);
                                break;
                            case 4:
                                args.push(false);
                                break;
                            case 5:
                                args.push(null);
                                break;
                            case 6:
                                if (match) {
                                    args.push(parseFloat(match));
                                } else {
                                    // The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal
                                    // parts of a number are optional, however, it captures nothing, just an empty string.
                                    // So, any string other than true, false, null or a properly quoted string will end up here.
                                    // I just consume it one character at a time to avoid looping forever on errors.
                                    arg = arg.substr(1);
                                }
                                break;
                        }
                        arg = arg.substr(match.length);
                        return true;
                    }
                };
            while (arg.length) {

                Y.some(parsingRegExp.exec(arg), matcher);
            }
            return args;
        },
        /**
        Enumerates all the values and keys of a given static properties for all classes in the hierarchy,
        starting with the oldest ancestor (Base).
        @method _forAllXinClasses
        @param x {String} name of the static property to be enumerated
        @param fn {function} function to be called for each value.
        The function will receive a reference to the class where it occurs, the value of the property
        and the key or index.
        @private
         */

        _forAllXinClasses: function(x, fn) {
            var self = this,
                cs = this._getClasses(),
                l = cs.length,
                i, c,
                caller = function (v, k) {
                    fn.call(self, c, v, k);
                };
            for (i = l -1;i >= 0;i--) {
                c = cs[i];
                if (c[x]) {
                    Y.each(c[x], caller);
                }
            }
        },
        /**
        Processes the template given and returns a `Y.Node` instance.
        @method _makeNode
        @param template {String} (optional) Template to process.
               If missing, it will use the first static
               <a href="#property__TEMPLATE">`_TEMPLATE`</a>
               property found in the inheritance chain.
        @param extras {Object} (optional) Hash of extra values to replace into
             the template, beyond MakeNode's processing codes.
        @return {Y.Node} Instance of `Y.Node` produced from the template
        @protected
         */
        _makeNode: function(template, extras) {
            if (!template) {
                Y.some(this._getClasses(), function (c) {
                    template = c._TEMPLATE;
                    return !!template;
                });
            }
            return Y.Node.create(this._substitute(template, extras));
        },
        /**
        Processes the given template and returns a string
        @method _substitute
        @param template {String} Template to process.
        @param extras {Object} (optional) Hash of extra values to replace into
             the template, beyond MakeNode's processing codes.
        @return {String} Template with the placeholders replaced.
        @protected
         */
        _substitute: function (template, extras) {
            var self = this,
                subs = function (s, count) {
                    s = s.replace(bracesRegExp, function(match, token) {
                        var args = null,
                            index = token.indexOf(' '),
                            fn, value;
                        if (index > -1) {
                            args = token.substring(index + 1);
                            token = token.substring(0, index);
                        }
                        if (args) {
                            fn = self._templateHandlers[token.toLowerCase()];
                            if (fn) {
                                value = fn.call(self, args, extras);
                            }
                        } else {
                            value = extras[token];
                        }
                        if (value === undefined) {
                            value = match;
                        }
                        return value;

                    });
                    if (count && s.indexOf('{') > -1) {
                        s = subs(s, count -1);
                    }
                    return s;

                };
           extras = extras || {};
           return subs(template, 3).replace('{LBRACE}','{').replace('{RBRACE}','}');
        },
        /**
        Locates the nodes with the CSS classNames listed in the
        <a href="#property__classNames">`this._classNames`</a> property,
        or those specifically requested in its arguments and stores references to them
        in properties named after each className key, prefixed with an underscore
        and followed by `"Node"`.
        If the className key contains a hyphen followed by a lowercase letter,
        the hyphen will be dropped and the letter capitalized.
        Any other characters invalid for identifiers will be turned into underscores,
        thus for the `no-label-1` className key a `_noLabel_1Node`
        property will be created.
        @method _locateNodes
        @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.
               If missing, all the classNames stored in
               <a href="#property__classNames">`this._classNames`</a> will be located.
        @protected
         */
        _locateNodes: function () {
            var bbx = this.get(BBX),
                self = this,
                makeName = function (el, name) {
                    if (el) {
                        self['_' + name.replace(/\-([a-z])/g,function (str, p1) {
                            return p1.toUpperCase();
                        }).replace(/\W/g,'_') + NODE] = el;
                    }
                };
            if (arguments.length) {
                Y.each(arguments, function (name) {
                    makeName(bbx.one(DOT + self._classNames[name]),name);
                });
            } else {
                Y.each(self._classNames, function(selector, name) {
                    makeName(bbx.one(DOT + selector), name);
                });
            }
        },
        /**
        Looks for static properties called
        <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
        in each of the classes of the inheritance chain
        and generates CSS classNames based on the `_cssPrefix` of each
        class and each of the suffixes listed in each them.
        The classNames generated will be stored in
        <a href="#property__classNames">`this._classNames`</a> indexed by the suffix.
        It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).
        If the WidgetStdMod is used, it will also add the classNames for the
        three sections ( HEADER, BODY, FOOTER )
        @method _makeClassNames
        @private
         */
        _makeClassNames: function () {
            var YCM = Y.ClassNameManager.getClassName,
                defined = {},
                cns = this._classNames = {};

            this._forAllXinClasses('_CLASS_NAMES', function(c, name) {
                if (defined[name]) {
                    Y.log(Y.substitute('ClassName' + DUPLICATE, {name:name, recentDef: defined[name], prevDef: c.NAME}), 'warn', 'MakeNode');
                } else {
                    cns[name] = YCM(c.NAME.toLowerCase(), name);
                    defined[name] = c.NAME;
                }
            });

            cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';
            if (this.getStdModNode) {
                cns.HEADER = 'yui3-widget-hd';
                cns.BODY = 'yui3-widget-bd';
                cns.FOOTER = 'yui3-widget-ft';
            }
        },
        /**
        Concatenates the entries of the <a href="#property__ATTRS_2_UI">`_ATTRS_2_UI`</a>
        static property of each class in the inheritance chain
        into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS
        @method _concatUIAttrs
        @private
         */
        _concatUIAttrs: function () {
            var defined, u, U = {};
            Y.each(['BIND','SYNC'], function (which) {
                defined = {};
                Y.each(this._UI_ATTRS[which], function (name) {
                    defined[name] = 'Widget';
                });
                Y.each(this._getClasses(), function (c) {
                    u = c._ATTRS_2_UI;
                    if (u) {
                        Y.each(Y.Array(u[which]), function (name) {
                            if (defined[name]) {
                                Y.log(
                                    Y.substitute(
                                        'UI ' + which + ' Attribute' + DUPLICATE,
                                        {name:name, recentDef: defined[name], prevDef: c.NAME}
                                    ), 'warn', 'MakeNode');
                            } else {
                                defined[name] = c.NAME;
                            }
                        });
                    }
                });
                U[which]= Y.Object.keys(defined);
            },this);
            this._UI_ATTRS = U;
        },
        /**
        Attaches the events listed in the <a href="#property__EVENTS">`_EVENTS`</a>
        static property of each class in the inheritance chain.
        @method _attachEvents
        @private
         */
        _attachEvents: function () {
            var self = this,
                bbx = self.get(BBX),
                eh = [],
                type, fn, args, when, target, t,
                toInitialCap = function (name) {
                    return name.charAt(0).toUpperCase() + name.substr(1);
                },
                equivalents = {
                    boundingBox:bbx,
                    document:bbx.get('ownerDocument'),
                    THIS:self,
                    Y:Y
                };
            self._forAllXinClasses('_EVENTS', function (c, handlers, key) {
                target = equivalents[key] || DOT + self._classNames[key];
                if (key === 'THIS') {key = 'This';}
                Y.each(Y.Array(handlers), function (handler) {
                    if (Lang.isString(handler)) {
                        handler = {type: handler};
                    }
                    if (Lang.isObject(handler)) {
                        type = handler.type;
                        when = (handler.when || 'after');
                        fn = handler.fn || '_' + when + toInitialCap(key) + toInitialCap(type);
                        args = handler.args;
                    } else {
                        Y.log('Bad event handler for class: ' + c.NAME + ' key: ' + key,'error','MakeNode');
                    }
                    if (!/^(before|after|delegate)$/.test(when)) {
                        Y.log('When can only be before, after or delegate: ' + when, 'error', 'MakeNode');
                    }
                    when = when.replace('before','on');
                    if (type) {
                        if (self[fn]) {
                            fn = self[fn];
                        } else {
                            Y.log('Listener method not found: ' + fn,'error','MakeNode');
                        }
                        if (when === 'delegate') {
                            if (Lang.isString(target)) {
                                if (type === 'key') {
                                    eh.push(bbx.delegate(type, fn, args, target, self));
                                } else {
                                    eh.push(bbx.delegate(type, fn, target, self, args));
                                }
                            } else {
                                Y.log('Delegate used on invalid key: ' + key, 'error', 'MakeNode');
                            }
                        } else {
                            t = Lang.isString(target)?bbx.all(target):target;
                            if ( type=== 'key') {
                                eh.push(t[when](type, fn, args, self));
                            } else {
                                eh.push(t[when](type, fn, self, args));
                            }
                        }
                    } else {
                        Y.log('No type found in: ' + c.NAME + ', key: ' + key, 'error', 'MakeNode');
                    }
                });
            });
            this._eventHandles = this._eventHandles.concat(eh);
        },

        /**
        Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.
        If an event has been publishes, the properties set in the descendants will override those in the original publisher.
        @method _publishEvents
        @private
         */
        _publishEvents: function () {
            this._forAllXinClasses('_PUBLISH', function (c, options, name) {
                var opts = {};
                Y.each(options || {}, function (value, opt) {
                    opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;
                },this);
                this.publish(name,opts);
            });
        },
        /**
        Detaches all the events created by <a href="method__attachEvents">`_attachEvents`</a>
        @method _detachEvents
        @private
         */
        _detachEvents: function () {
            Y.each(this._eventHandles, function (handle) {
                handle.detach();
            });
        }


    };
    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Holds the default template to be used by [`_makeNode`](#method\_\_makeNode) when none is explicitly provided.

    The string should contain HTML code with placeholders made of a set of curly braces
    enclosing an initial processing code and arguments.
    Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.

    The template may also contain regular placeholders as used by `Y.substitute`,
    whose values will be extracted from the second argument to [`_makeNode`](#method\_\_makeNode).
    The processing codes are:



    * `{@ attributeName}` configuration attribute values
    * `{p propertyName}` instance property values
    * `{m methodName arg1 arg2 ....}` return value from instance method.
      The `m` code should be followed by the
      method name and any number of arguments. The
      placeholder is replaced by the return value or the named method.
    * `{c classNameKey}` CSS className generated from the <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
      static property
    * `{s key}` string from the `strings` attribute, using `key`    as the sub-attribute.
    * `{? arg1 arg2 arg3}` If arg1 evaluates to true it returns arg2 otherwise arg3.
      Argument arg1 is usually a nested placeholder.
    * `{1 arg1 arg2 arg3}` If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.
      Argument arg1 is usually a nested placeholder.
    * `{n p1 arg1 .... pn argn}` It will read the value resulting from the processing code
      `p1` with argument `arg1`
      and use that as the object to process the following processing code.
      It takes any number of processing codes and arguments.
      It only works with processing codes that take simple identifiers as arguments, ie.: not {m}.
    * `{}` any other value will be    handled just like `Y.substitute` does.


    For placeholders containing several arguments they must be separated by white spaces.
    Strings must be enclosed in double quotes, no single quotes allowed.
    The backslash is the escape character within strings.
    Numbers, null, true and false will be recognized and converted to their native values.
    Any argument can be a further placeholder, enclosed in its own set of curly braces.
    @property _TEMPLATE
    @type String
    @static
    @protected
     */
    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Holds an array of strings, each the suffix used to define a CSS className using the
    _cssPrefix of each class.  The names listed here are used as the keys into
    <a href="#property__classNames">`this._classNames`</a>,
    as the argument to the `{c}` template placeholder
    and as keys for the entries in the <a href="#property__EVENTS">`_EVENTS`</a> property.
    They are also used by <a href="#method__locateNodes">`_locateNodes`</a> to create the private properties that hold
    references to the nodes created.
    @property _CLASS_NAMES
    @type [String]
    @static
    @protected
     */

    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Lists the attributes whose value should be reflected in the UI.
    It contains an object with two properties, `BIND` and `SYNC`, each
    containing the name of an attribute or an array of names of attributes.
    Those listed in `BIND` will have listeners attached to their change event
    so every such change is refreshed in the UI.
    Those listed in `SYNC` will be refreshed when the UI is rendered.
    For each entry in either list there should be a method named using the `_uiSet` prefix, followed by
    the name of the attribute, with its first character in uppercase.
    This function will receive the value to be set and the source of the change.
    @property _ATTRS_2_UI
    @type Object
    @static
    @protected
     */


    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Contains a hash of elements to attach event listeners to.
    Each element is identified by the suffix of its generated className,
    as declared in the <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a> property.

    There are seveal virtual element identifiers,

    * `"boundingBox"` identifies the boundingBox of the Widget
    * `"content"` its contextBox
    * `"document"` identifies the document where the component is in
    * `"THIS"` identifies this instance
    * `"Y"` identifies the YUI instance of the sandbox


    If the Y.WidgetStdMod extension is used the `"HEADER"`, `"BODY"`
    and `"FOOTER"` identifiers will also be available.

    Each entry contains a type of event to be listened to or an array of events.
    Each event can be described by its type (i.e.: `"key"`, `"mousedown"`, etc).
    MakeNode will set 'after' event listeners by default, but can be instructed to listen to 'before' ('on') events
    or do it by delegation on the boundingBox.
    MakeNode will associate this event with a method named `"_after"`,
    `"_before"` or `"_delegate"` followed by the element identifier with the first character capitalized
    and the type of event with the first character capitalized
    (i.e.: `_afterBoundingBoxClick`, `_afterInputBlur`,
    `_afterThisValueChange`, `_beforeFormSubmit`, `_delegateListItemClick`, etc.).

    Alternatively, the event listener can be described by an object literal containing properties:

    * `type` (mandatory) the type of event being listened to
    * `fn` the name of the method to handle the event.
      Since _EVENTS is static, it has no access to `this` so the name of the method must be specified
    * `args` extra arguments to be passed to the listener, useful,
      for example as a key descriptor for `key` events.
    * `when` either 'before', 'after' or 'delegate'.
      MakeNode defaults to set 'after' event listeners but can be told to set 'before' ('on') listeners
      or to delegate on the BoundingBox the capture of events on inner elements.
      Only className keys can be used with 'delegate'.

            _EVENTS: {
                 boundingBox: [
                      {
                           type: 'key',
                           fn:'_onDirectionKey',   // calls this._onDirectionKey
                           args:((!Y.UA.opera) ? "down:" : "press:") + "38, 40, 33, 34"
                      },
                      'mousedown'          // calls this._afterBoundingBoxMousedown
                 ],
                 document: 'mouseup',     // calls this._afterDocumentMouseup
                 input: 'change',          // calls this._afterInputChange
                 form: {type: 'submit', when:'before'}      // calls this._beforeFormSubmit
            },

    @property _EVENTS
    @type Object
    @static
    @protected
     */

    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Contains a hash of events to be published.
    Each element has the name of the event as its key
    and the configuration object as its value.
    If the event has already been published, the configuration of the event will be modified by the
    configuration set in the new definition.
    When setting functions use the name of the function, not a function reference.
    @property _PUBLISH
    @type Object
    @static
    @protected
     */

Y.MakeNode = MakeNode;



}, 'gallery-2013.01.16-21-05', {"requires": ["classnamemanager"]});
