/*!
 * jShortcuts JavaScript Library v1.0.0
 * http://www.sublight.me/Projects/jShortcuts/
 *
 * Copyright 2013 Sublight Labs and other contributors
 * Released under the MIT license
 * http://www.sublight.me/Projects/jShortcuts/MIT-LICENSE.txt
 *
 * Date: 2013-02-01
 */
 
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var jShortcuts;
(function (jShortcuts) {
    function register(shortcuts) {
        jShortcuts.shortcuts = shortcuts;
        if(jShortcuts.shortcuts != null) {
            for(var i = 0; i < jShortcuts.shortcuts.length; i++) {
                var shortcut = jShortcuts.shortcuts[i];
                if(shortcut.options != null && shortcut.options.elementId == '__menu') {
                    registerMenu();
                    break;
                }
            }
        }
        document.onkeydown = onKeyPress;
    }
    jShortcuts.register = register;
    function onKeyPress(ev) {
        if(jShortcuts.shortcuts == null || ev == null) {
            return;
        }
        var keyCode = ev.keyCode;
        if(keyCode <= 0) {
            return;
        }
        for(var i = 0; i < jShortcuts.shortcuts.length; i++) {
            var shortcut = jShortcuts.shortcuts[i];
            if(shortcut.shortcutCode == keyCode && shortcut.keyControl == ev.ctrlKey && shortcut.keyAlt == ev.altKey && shortcut.keyShift == ev.shiftKey) {
                if(shortcut.options.elementId == '__menu') {
                    toggleMenu();
                    if(shortcut.options.preventDefault) {
                        utilityPreventDefault(ev);
                    }
                    break;
                }
                if(getType(shortcut.options) == 'CallbackOptions') {
                    var optCallback = shortcut.options;
                    if(optCallback.callback != null && (typeof optCallback.callback != undefined)) {
                        optCallback.callback();
                    }
                } else {
                    if(getType(shortcut.options) == 'UrlOptions') {
                        var optUrl = shortcut.options;
                        if(optUrl.url != null) {
                            if(optUrl.tryOpenInNewTab) {
                                openInNewTab(optUrl.url);
                            } else {
                                openInWindow(optUrl.url);
                            }
                        }
                    } else {
                        if(shortcut.options.elementId != null && shortcut.options.elementId != undefined && shortcut.options.elementId.length > 0) {
                            var el = document.getElementById(shortcut.options.elementId);
                            if(el != null && el != undefined) {
                                el.click();
                            }
                        }
                    }
                }
                if(shortcut.options.preventDefault) {
                    utilityPreventDefault(ev);
                }
                break;
            }
        }
    }
    function getType(obj) {
        if(obj == null || obj == undefined) {
            return '';
        }
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }
    function utilityPreventDefault(ev) {
        if(ev != null) {
            ev.preventDefault();
        }
    }
    function registerMenu() {
        if(document.body.childNodes.length <= 0) {
            return;
        }
        var html;
        html = '<ul id=\"jShortcutsMenu\" class=\"jShortcutsMenu\">';
        if(jShortcuts.shortcuts != null) {
            for(var i = 0; i < jShortcuts.shortcuts.length; i++) {
                var shortcut = jShortcuts.shortcuts[i];
                if(shortcut.options != null && shortcut.options.elementId != null && shortcut.options.elementId.indexOf('__') >= 0) {
                    continue;
                }
                html += ('<li class=\"jShortcutsMenuItem\"><span class=\"jShortcutsMenuItemName\">' + shortcut.options.name + '</span><span class=\"jShortcutsMenuItemShortcut\">' + shortcut.options.shortcut + '</span></li>');
                if(i < (jShortcuts.shortcuts.length - 1)) {
                    html += ('<li class=\"jShortcutsMenuItemSeparator\"><span></span></li>');
                }
            }
        }
        html += '</ul>';
        var menu = createHtmlElement(html);
        document.body.insertBefore(menu, document.body.childNodes[0]);
    }
    function showMenu() {
        setMenuVisibility(true);
    }
    jShortcuts.showMenu = showMenu;
    function hideMenu() {
        setMenuVisibility(false);
    }
    jShortcuts.hideMenu = hideMenu;
    function setMenuVisibility(visible) {
        var jShortcutsMenu = document.getElementById('jShortcutsMenu');
        if(jShortcutsMenu == null) {
            return;
        }
        var newDisplay;
        if(!visible) {
            newDisplay = 'none';
        } else {
            newDisplay = 'block';
        }
        jShortcutsMenu.style.display = newDisplay;
    }
    function toggleMenu() {
        var jShortcutsMenu = document.getElementById('jShortcutsMenu');
        if(jShortcutsMenu == null) {
            return;
        }
        var newDisplay;
        if(jShortcutsMenu.style.display == 'block') {
            newDisplay = 'none';
        } else {
            newDisplay = 'block';
        }
        jShortcutsMenu.style.display = newDisplay;
    }
    jShortcuts.toggleMenu = toggleMenu;
    function createHtmlElement(html) {
        var docFrag = document.createDocumentFragment();
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        while(tmp.firstChild) {
            docFrag.appendChild(tmp.firstChild);
        }
        return docFrag;
    }
    var Settings = (function () {
        function Settings() {
            this.preventDefault = true;
        }
        return Settings;
    })();
    jShortcuts.Settings = Settings;    
    jShortcuts.shortcuts;
    jShortcuts.settings = new Settings();
    function createMenuShortcut(shortcut) {
        var options = new Options();
        options.elementId = '__menu';
        options.shortcut = shortcut;
        return new Shortcut(options);
    }
    jShortcuts.createMenuShortcut = createMenuShortcut;
    function createElementShortcut(elementId, name, shortcut) {
        var options = new Options();
        options.elementId = elementId;
        options.name = name;
        options.shortcut = shortcut;
        return new Shortcut(options);
    }
    jShortcuts.createElementShortcut = createElementShortcut;
    function createCallbackShortcut(callback, name, shortcut) {
        var options = new CallbackOptions();
        options.callback = callback;
        options.name = name;
        options.shortcut = shortcut;
        return new Shortcut(options);
    }
    jShortcuts.createCallbackShortcut = createCallbackShortcut;
    function createUrlShortcut(url, name, shortcut, tryOpenInNewTab) {
        if (typeof tryOpenInNewTab === "undefined") { tryOpenInNewTab = true; }
        var options = new UrlOptions();
        if(url != null && url != undefined && url.indexOf('http') < 0) {
            url = 'http://' + url;
        }
        options.url = url;
        options.tryOpenInNewTab = tryOpenInNewTab;
        options.name = name;
        options.shortcut = shortcut;
        return new Shortcut(options);
    }
    jShortcuts.createUrlShortcut = createUrlShortcut;
    function openInNewTab(url) {
        window.open(url, '_blank');
        window.focus();
    }
    function openInWindow(url) {
        window.open(url);
    }
    var Shortcut = (function () {
        function Shortcut(options) {
            this.options = options;
            this.keyControl = false;
            this.keyAlt = false;
            this.keyShift = false;
            if(options == null) {
                throw new NullException('options');
            }
            if(options.shortcut == null || options.shortcut.length <= 0) {
                throw new MissingArgumentException('shortcut');
            }
            var shortcut = options.shortcut;
            if(shortcut != null) {
                shortcut = shortcut.replace(' ', '');
            }
            if(shortcut != null && shortcut.length > 0) {
                shortcut = shortcut.toUpperCase();
                if(shortcut == 'ALT') {
                    this.shortcutCode = 18;
                    this.keyAlt = true;
                    shortcut = '';
                    return;
                }
                if(shortcut.indexOf('CTRL+') >= 0) {
                    this.keyControl = true;
                    shortcut = shortcut.replace('CTRL+', '');
                }
                if(shortcut.indexOf('ALT+') >= 0) {
                    this.keyAlt = true;
                    shortcut = shortcut.replace('ALT+', '');
                }
                if(shortcut.indexOf('SHIFT+') >= 0) {
                    this.keyShift = true;
                    shortcut = shortcut.replace('SHIFT+', '');
                }
                this.shortcutCode = this.mapShortcutToCode(shortcut);
            } else {
                this.shortcutCode = 0;
            }
        }
        Shortcut.prototype.mapShortcutToCode = function (shortcut) {
            if(shortcut == null || shortcut == undefined) {
                return null;
            }
            if(shortcut.length == 1) {
                return shortcut.charCodeAt(0);
            }
            if(shortcut == 'BACKSPACE') {
                return 8;
            }
            if(shortcut == 'TAB') {
                return 9;
            }
            if(shortcut == 'ENTER') {
                return 13;
            }
            if(shortcut == 'ESC') {
                return 27;
            }
            if(shortcut == 'SPACE') {
                return 32;
            }
            if(shortcut == 'PAGEUP') {
                return 33;
            }
            if(shortcut == 'PAGEDOWN') {
                return 34;
            }
            if(shortcut == 'END') {
                return 35;
            }
            if(shortcut == 'HOME') {
                return 36;
            }
            if(shortcut == 'LEFT') {
                return 37;
            }
            if(shortcut == 'UP') {
                return 38;
            }
            if(shortcut == 'RIGHT') {
                return 39;
            }
            if(shortcut == 'DOWN') {
                return 40;
            }
            if(shortcut == 'INS') {
                return 41;
            }
            if(shortcut == 'INSERT') {
                return 41;
            }
            if(shortcut == 'DEL') {
                return 46;
            }
            if(shortcut == 'DELETE') {
                return 46;
            }
            if(shortcut == 'F1') {
                return 112;
            }
            if(shortcut == 'F2') {
                return 113;
            }
            if(shortcut == 'F3') {
                return 114;
            }
            if(shortcut == 'F4') {
                return 115;
            }
            if(shortcut == 'F5') {
                return 116;
            }
            if(shortcut == 'F6') {
                return 117;
            }
            if(shortcut == 'F7') {
                return 118;
            }
            if(shortcut == 'F8') {
                return 119;
            }
            if(shortcut == 'F9') {
                return 120;
            }
            if(shortcut == 'F10') {
                return 121;
            }
            if(shortcut == 'F11') {
                return 122;
            }
            if(shortcut == 'F12') {
                return 123;
            }
            return 0;
        };
        return Shortcut;
    })();
    jShortcuts.Shortcut = Shortcut;    
    var Exception = (function () {
        function Exception(name, message) {
            this.name = name;
            this.message = message;
        }
        return Exception;
    })();    
    var NullException = (function (_super) {
        __extends(NullException, _super);
        function NullException(variable) {
                _super.call(this, 'NullException', 'Object reference not set to an instance of an object: \'' + variable + '\'');
            this.variable = variable;
        }
        return NullException;
    })(Exception);    
    var MissingArgumentException = (function (_super) {
        __extends(MissingArgumentException, _super);
        function MissingArgumentException(argument) {
                _super.call(this, 'MissingArgumentException', 'Missing argument: \'' + argument + '\'');
            this.argument = argument;
        }
        return MissingArgumentException;
    })(Exception);    
    var Options = (function () {
        function Options() {
            this.preventDefault = jShortcuts.settings.preventDefault;
            this.elementId = null;
            this.name = null;
            this.shortcut = null;
        }
        return Options;
    })();    
    var CallbackOptions = (function (_super) {
        __extends(CallbackOptions, _super);
        function CallbackOptions() {
                _super.call(this);
            this.callback = null;
        }
        return CallbackOptions;
    })(Options);    
    var UrlOptions = (function (_super) {
        __extends(UrlOptions, _super);
        function UrlOptions() {
                _super.call(this);
            this.url = null;
            this.tryOpenInNewTab = true;
        }
        return UrlOptions;
    })(Options);    
})(jShortcuts || (jShortcuts = {}));

