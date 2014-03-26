YUI.add('gallery-dynamic-dialog', function(Y) {

/**

A wrapper around common Dialog controls and how they interact with forms.
Supports inline template-style dialogs as well as remote dialogs from a remote
URI.

@module gallery-dynamic-dialog
**/

/**
A wrapper around common Dialog controls and how they interact with forms.
Supports inline template-style dialogs as well as remote dialogs from a remote
URI.

The idea is that you can install event delegates on a page, and open up
additional single panels in a dialog (loaded asynchronously) or just simply
show a dialog from a template on the page.

@example

  var dialogs = new Y.DynamicDialog();

  // These are the defaults. Any link with open-dialog as a class
  // will find a node from the href="#dialog-template-id" and open it.
  dialogs.setupDelegates({
     'a.open-dialog':   'click',
     // This will fetch the href and display the results in the dialog.
     // Your backend will have to know how to send partial renders out.
     'a.remote-dialog': 'click'
  });

  dialog.on('show', function(e) {
    // Immediately close it! This is absurd!
    e.dialog.hide();
  });

@class DynamicDialog
**/
var DynamicDialog,

    Panel    = Y.Panel,

    Lang     = Y.Lang,
    sub      = Lang.sub,
    isValue  = Lang.isValue,
    isString = Lang.isString,
    Oeach    = Y.Object.each;

DynamicDialog = Y.Base.create('dynamicDialog', Y.Base, [], {
    container: Y.one(document.body),
    panels: {},

    DEFAULT_EVENTS: {
        'a.open-dialog':   'click',
        'a.remote-dialog': 'click'
    },

    initializer: function() {
        this.publish('submit', {
            defaultFn: this._defSubmitFn,
            preventable: true
        });

        this.publish('show', { preventable: false });
    },

    setupDelegates: function() {
        var container = this.container,
            events    = this.DEFAULT_EVENTS,
            triggerFn = Y.bind(this._triggerEventFn, this);

        Oeach( events,
            function(value, key) {
                container.delegate(value, triggerFn, key);
            }
        );
    },

    /* For 3.5.0, the pjax module will likely make all this stupid.
    This method basically re-fires 'e' by calling _triggerEventFn with
    a populated `e.template`.
    */
    _fetchDialogContent: function(e) {
        var target   = e.currentTarget,
            source   = target.get('tagName') === 'A' ?
                        target.get('href') : target.get('target'),
            async    = target.getAttribute('data-async') === 'true',
            title    = (target.getAttribute('title') || ''),
            callback = Y.bind(this._triggerEventFn, this),
            error    = this.get('remoteFailureText'),
            cfg      = {
                method: 'GET',
                on: {
                    success: function(id, o) {
                        var fragment = Y.one(Y.config.doc.createDocumentFragment());
                        fragment.append('<div>' + o.responseText + '</div>');
                        fragment = fragment.one('div');

                        fragment.setAttribute('data-async', async);
                        fragment.setAttribute('title', title);

                        e.dialogId = target.get('id');
                        e.template = fragment;
                        e.preventDefault = function() { };
                        callback(e);
                    },
                    failure: function(id, o) {
                        var fragment = Y.one(Y.config.doc.createDocumentFragment());
                        fragment.append('<div>' + error + '</div>');
                        fragment = fragment.one('div');

                        fragment.setAttribute('data-async', async);
                        fragment.setAttribute('title', title);

                        e.dialogId = target.get('id');
                        e.template = fragment;
                        e.preventDefault = function() { };

                        callback(e);
                    }
                }
            };
        Y.io( source, cfg );
    },

    open: function(selector) {
        var node = Y.one(selector),
            e    = {
                currentTarget:  node,
                preventDefault: function() { },
                halt:           function() { }
            };
        this._dialogFromNode(e);
    },

    _triggerEventFn: function(e) {
        this._dialogFromNode(e);
    },

    _dialogFromNode: function(e) {
        var target   = e.currentTarget,
            source   = target.get('tagName') === 'A' ?
                        target.get('href') : target.get('target'),
            attrs    = {},
            id       = e.dialogId || source.substr( source.indexOf('#') ),
            template = e.template || Y.one(id),
            async    = template ? template.getAttribute('data-async') === 'true' : false,
            overlay  = this.panels[id],

            dom_attrs  = target.get('attributes'),
            data_attrs = [];

        /* If we don't have a template, fetch it! */
        if ( target.hasClass( this.get('remoteClass') ) && !template ) {
            /* Now we pause. The contents of the dialog are not from the template
               but from an XHR call.
            */
            e.preventDefault();
            return this._fetchDialogContent(e);
        }

        dom_attrs.each( function(el) {
            var name = el.get('name');
            if ( name.match(/^data-/) ) {
                var value = target.getAttribute(name);
                // We have a value, so remove the data- prefix and stuff it
                // into the attrs objject.
                if ( value !== null ) {
                    attrs[ name.substr(5) ] = value;
                }
            }
        });

        /* If we have an overlay or a template, do stuff */
        if ( overlay || template ) {
            e.preventDefault();
            if ( !overlay ) {
                overlay = this._setupDialog(target, template, attrs);
            }
            else if ( template ) {
                overlay.setStdModContent(
                    Y.WidgetStdMod.BODY,
                    sub( template.getContent(), attrs )
                );
            }

            var form = overlay.get('contentBox').one('form');
            if ( form ) {
                var submitFn = Y.bind( this._defSubmitButtonFn, this );

                /* Detach previously used form listener and replace it */
                if ( overlay.formListener ) {
                    overlay.formListener.detach();
                }
                overlay.formListener = form.on('submit', function(e) {
                    e.preventDefault();

                    e.async   = async;
                    e.dialog  = this;
                    e.trigger = target;

                    /* We find the form again, since the content may be replaced */
                    e.form = this.get('contentBox').one('form');
                    if ( !e.form ) {
                        throw "Form disappeared, was the dialog content replaced incorrectly?";
                    }

                    submitFn(e);
                }, overlay);
            }

            overlay.trigger = target;
            overlay.show();
            this.fire('show', { dialog: overlay, trigger: target });
        }
    },

    _setupDialog: function(element, template, attrs) {
        var self    = this,
            title   = element.getAttribute('title') || template.getAttribute('title') || '',
            content = sub( template.getContent(), attrs ),
            modal   = element.getAttribute('data-modal') || template.getAttribute('data-modal') || this.get('modal'),
            zIndex  = element.getAttribute('data-zindex') || this.get('zIndex'),
            panel   = null,
            async   = template.getAttribute('data-async') === 'true',
            submitFn   = Y.bind( this._defSubmitButtonFn, this ),
            closeLabel = this.get('closeLabel'),
            contentBox = null,
            form       = null;
        panel = new Panel({
            headerContent:  title,
            bodyContent:    content,
            modal:          modal,
            centered:       true,
            zIndex:         zIndex,
            buttons       : [
                {
                    value: closeLabel,
                    section: Y.WidgetStdMod.HEADER,
                    classNames: [ 'closer' ],
                    action: function(e) { this.hide(); }
                }
            ]
        });

        panel.render( this.container );
        // XX The classes are based on the listed classes, but we want to add
        // this in. Didn't see a way via the API in Widget.js.
        panel.get('boundingBox').addClass('yui3-dynamic-dialog');

        contentBox = panel.get('contentBox');
        form       = contentBox.one('form');

        /* If we have a form, setup form buttons */
        if ( form ) {
            panel.addButton({
                value: this.get('cancelLabel'),
                classNames: [ 'yui3-dynamic-dialog-cancel' ],
                action: function(e) { e.preventDefault(); this.hide(); },
                section: Y.WidgetStdMod.FOOTER
            });

            panel.addButton({
                value: this.get('submitLabel'),
                classNames: [ 'yui3-dynamic-dialog-submit' ],
                action: function(e) {
                    e.preventDefault();
                    e.async   = async;
                    e.dialog  = this;
                    e.trigger = this.trigger;

                    /* We find the form again, since the content may be replaced */
                    e.form = this.get('contentBox').one('form');
                    if ( !e.form ) {
                        throw "Form disappeared, was the dialog content replaced incorrectly?";
                    }

                    submitFn(e);
                },
                section: Y.WidgetStdMod.FOOTER
            });

        }
        /* Otherwise, just a simple Hide button */
        else {
            panel.addButton({
                value: this.get('okLabel'),
                classNames: [ 'yui3-dynamic-dialog-ok' ],
                action: function(e) { e.preventDefault(); this.hide(); },
                section: Y.WidgetStdMod.FOOTER
            });
        }

        /* How should we align? */

        this.panels[ '#' + template.get('id') ] = panel;

        return panel;
    },

    _defSubmitButtonFn: function(e) {
        this.fire('submit', {
            dialog:  e.dialog,
            trigger: e.trigger,
            form:    e.form,
            async:   e.async || false
        });
    },

    _defSubmitFn: function(e) {
        var dialog  = e.dialog,
            form    = e.form,
            async   = e.async,
            trigger = e.trigger || dialog.trigger,
            action  = form.getAttribute('action'),
            method  = form.getAttribute('method') || 'POST',
            cfg     = {};

        if ( !async ) {
            dialog.hide();
            form.submit();
            return;
        }


        cfg.method  = method.toUpperCase();
        cfg.form    = { id: form };
        cfg.context = this;
        cfg.arguments = {
            dialog:  dialog,
            form:    form,
            trigger: trigger
        };
        cfg.on = {
            success: this._ioSuccess,
            failure: this._ioFailure
        };

        Y.io( action, cfg );
    },

    _ioSuccess: function(id, o, args) {
        args.dialog.hide();
        args.response = o;
        this.fire( 'ioSuccess', args );
    },

    _ioFailure: function(id, o, args) {
        var dialog    = args.dialog,
            form      = args.form,
            bounding  = dialog.get('boundingBox'),
            className = this.get('ioFailureClass');

        args.response = o;
        this.fire('ioFailure', args);

        bounding.addClass(className);

        this._shakeNode(bounding,
            Y.bind( function() {
                this.removeClass( className );
            }, bounding )
        );

        /* After a bit, remove the class automatically? */
        if ( o.responseText ) {
            dialog.setStdModContent( Y.WidgetStdMod.BODY, o.responseText );
        }
    },

    _shakeNode: function(node, callback) {
        var curX = node.getX(),
            curY = node.getY(),
            forwardX = curX + 5,
            anim;

        node.get('clientX');
        anim = new Y.Anim({
            node: node,
            to: {
                xy: [ forwardX, curY ]
            },
            duration: 0.01,
            iterations: 10,
            direction: 'alternate'
        });
        if ( callback && typeof callback === 'function' ) {
            anim.on('end', callback);
        }

        anim.run();

        return anim;
    }

}, {
    ATTRS: {
        modal             : { value: false },
        zIndex            : { value: 1 },
        closeLabel        : { value: "✕" },
        okLabel           : { value: 'OK' },
        cancelLabel       : { value: 'Cancel' },
        submitLabel       : { value: 'Submit' },
        remoteFailureText : { value: '<p>There was a problem fetching the dialog content. Sorry.</p>' },
        dialogClass       : { value: 'open-dialog' },
        remoteClass       : { value: 'remote-dialog' },
        ioFailureClass    : { value: 'yui3-dynamic-dialog-io-failure' }
    }
});


Y.DynamicDialog = DynamicDialog;



}, 'gallery-2012.06.20-20-07' ,{requires:['anim','substitute','widget','base','panel','io','io-form','event-delegate']});
