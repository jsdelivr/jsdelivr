YUI.add('gallery-placeholder', function(Y) {

    var getCN = Y.ClassNameManager.getClassName,
        CLS_PH = getCN('placeholder'),
        CLS_PH_TEXT = getCN('placeholder', 'text');

    Y.namespace('Plugin').Placeholder = Y.Base.create('placeholder', Y.Plugin.Base, [], {
        hide : function (e) {
            var host = this.get('host');

            if (host.hasClass(CLS_PH_TEXT)) {
                host.set('value', '');
                host.removeClass(CLS_PH_TEXT);
            }
        },

        show : function (e) {
            var host = this.get('host'),
                text = this.get('text');

            if (host.get('value') === '') {
                host.set('value', text);
                host.addClass(CLS_PH_TEXT);
            }
        },

        _handleKeydown : function (e) {
            var code = e.keyCode || e.which,

            // Enter, shift, ctrl, option/alt, esc, left, up, right, down, command
            ignoreCodes = [13, 16, 17, 18, 27, 37, 38, 39, 40, 224];
            if (!!~Y.Array.indexOf(ignoreCodes, code)) {
                return;
            } 

            this.hide();

        },

        _setUIPlaceholder : function (text, hideOnFocus) {
            var host = this.get('host');

            host.set('value', '');

            if (hideOnFocus) {
                if (this._keydownListener) {
                    this._keydownListener.detach();
                }

                if (!this._focusListener) {
                    this._focusListener = host.on('focus', this.hide, this);
                }

                if (Y.config.doc.activeElement !== Y.Node.getDOMNode(host)) {
                    this.show();
                }
            } else {
                if (this._focusListener) {
                    this._focusListener.detach();
                }

                if (!this._keydownListener) {
                    this._keydownListenr = host.after('keydown', this._handleKeydown, this);
                }

                this.show();
            }

        },

        initializer : function () {
            var host = this.get('host');

            host.addClass(CLS_PH);
            
            this.after('textChange', function (e) {
                this._setUIPlaceholder(e.newVal, this.get('hideOnFocus'));
            });

            this.after('hideOnFocusChange', function (e) {
                this._setUIPlaceholder(this.get('text'), e.newVal);
            });

            this._setUIPlaceholder(this.get('text'), this.get('hideOnFocus'));

            if (!this._blurListener) {
                this._blurListener = host.on('blur', this.show, this);
            }
        },

        destructor : function () {
            var host = this.get('host');
            host.removeClass(CLS_PH);

            if (this._focusListener) {
                this._focusListener.detach();
            }
            if (this._blurListener) {
                this._blurListener.detach();
            }

            if (this._keydownListener) {
                this._keydownListener.detach();
            }
        }
    }, {
        CN_PLACEHOLDER_TEXT : CLS_PH_TEXT,
        NS : 'placeholder',
        ATTRS : {
            hideOnFocus : {
                value : true
            },
            text : {
                value : 'Example'
            }
        }
    });


}, 'gallery-2012.06.20-20-07' ,{requires:['node', 'base-build', 'plugin', 'classnamemanager' ]});
