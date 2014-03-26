YUI.add('gallery-itsaerrorreporter', function (Y, NAME) {

'use strict';

/**
 * This module full automaticly reports error-events by poping up an error-dialog.
 *
 * By default it listens to window.onerror, broadcasted 'error'-events and error-loggings. All can be (un)set.
 *
 *
 * @module gallery-itsaerrorreporter
 * @class Y.ITSAErrorReporter
 * @since 0.1
 *
 * <i>Copyright (c) 2013 Marco Asbreuk - http://theinternetwizard.net</i>
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 *
*/

var ERROR = 'error',
    WARN = 'warn',
    JS_ERROR = 'javascript '+ERROR,
    BOOLEAN = 'boolean',
    UNDEF = 'undefined ',
    UNDEFINED_ERROR = UNDEF+ERROR,
    UNDEFINED_WARNING = UNDEF+WARN+'ing',
    errorReporterInstance;

function ITSAErrorReporter() {}

if (!Y.Global.ITSAErrorReporter) {

    Y.mix(ITSAErrorReporter.prototype, {

        /**
         * Handler for window.onerror.
         *
         * @method _handleWindowError
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.2
        */
        _handleWindowError : function(msg, url, line) {
            var instance = this;

            Y.log('_handleWindowError '+msg, 'info', 'Itsa-ErrorReporter');
            if (instance._reportWindowErrors) {
                  Y.showError(JS_ERROR, msg+'<br /><br />'+url+' (line '+line+')');
            }
        },

        /**
         * Sets or unsets the reporter for 'error'-events.
         *
         * @method reportErrorEvents
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportErrorEvents : function(activate) {
            var instance = this,
                active = (typeof activate===BOOLEAN) ? activate : true;

            Y.log('reportErrorEvents '+activate, 'info', 'Itsa-ErrorReporter');
            if (active && !instance._reportErrorEvents) {
                instance._reportErrorEvents = Y.after(
                    ['*:'+ERROR],
                    function(e) {
                        var err = e.err || e.error || e.msg || e.message || UNDEFINED_ERROR,
                              src = e.src || e.source;
                        // in case of err as an windows Error-object, we need to transform the type to String:
                        err = err.toString();
                        Y.showError(src, err);
                    }
                );
            }
            else if (!active && instance._reportErrorEvents) {
                instance._reportErrorEvents.detach();
                instance._reportErrorEvents = null;
            }
        },

        /**
         * Sets or unsets the reporter for 'warn'-events.
         *
         * @method reportWarnEvents
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportWarnEvents : function(activate) {
            var instance = this,
                active = (typeof activate===BOOLEAN) ? activate : true;

            Y.log('reportWarnEvents '+activate, 'info', 'Itsa-ErrorReporter');
            if (active && !instance._reportWarnEvents) {
                instance._reportWarnEvents = Y.after(
                    ['*:'+WARN],
                    function(e) {
                        var warning = e.warn || e.warning || e.msg || e.message || UNDEFINED_WARNING,
                            src = e.src || e.source;
                        Y.showWarning(src, warning);
                    }
                );
            }
            else if (!active && instance._reportWarnEvents) {
                instance._reportWarnEvents.detach();
                instance._reportWarnEvents = null;
            }
        },

        /**
         * Sets or unsets the reporter for 'error'-logs.
         *
         * @method reportErrorLogs
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportErrorLogs : function(activate) {
            var instance = this,
                active = (typeof activate===BOOLEAN) ? activate : true;

            Y.log('reportErrorLogs '+activate, 'info', 'Itsa-ErrorReporter');
            if (active && !instance._reportErrorLogs) {
                instance._reportErrorLogs = Y.on(
                    'yui:log',
                    function(e) {
                        var err = e.msg || UNDEFINED_ERROR,
                              cat = e.cat,
                              src = e.src;
                        if (cat===ERROR) {
                            Y.showError(src, err);
                        }
                    }
                );
            }
            else if (!active && instance._reportErrorLogs) {
                instance._reportErrorLogs.detach();
                instance._reportErrorLogs = null;
            }
        },

        /**
         * Sets or unsets the reporter for 'warn'-logs.
         *
         * @method reportWarnLogs
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.1
        */
        reportWarnLogs : function(activate) {
            var instance = this,
                active = (typeof activate===BOOLEAN) ? activate : true;

            Y.log('reportErrorLogs '+activate, 'info', 'Itsa-ErrorReporter');
            if (active && !instance._reportWarnLogs) {
                instance._reportWarnLogs = Y.on(
                    'yui:log',
                    function(e) {
                        var err = e.msg || UNDEFINED_WARNING,
                            cat = e.cat,
                            src = e.src;
                        // temporarely bugfix, to catch forgotten promise-reject handlers --> the sender (Y.Promise) should log through 'warn'
                        // but logs through 'info'
/*jshint expr:true */
                        (err==='This promise was rejected but no error handlers were registered to it') && (cat=WARN);
/*jshint expr:false */
                        if (cat===WARN) {
                            Y.showWarning(src, err);
                        }
                    }
                );
            }
            else if (!active && instance._reportWarnLogs) {
                instance._reportWarnLogs.detach();
                instance._reportWarnLogs = null;
            }
        },

        /**
         * Sets or unsets the reporter for window.onerror.
         *
         * @method reportWindowErrors
         * @param [activate] {boolean} to set or unset the reporter
         * @since 0.2
        */
        reportWindowErrors : function(activate) {
            var active = (typeof activate===BOOLEAN) ? activate : true;

            Y.log('reportWindowErrors '+activate, 'info', 'Itsa-ErrorReporter');
            this._reportWindowErrors = active;
        }

    });

    errorReporterInstance = Y.Global.ITSAErrorReporter = new ITSAErrorReporter();
    window.onerror = Y.bind(errorReporterInstance._handleWindowError, errorReporterInstance);
    errorReporterInstance.reportWindowErrors();
    errorReporterInstance.reportErrorLogs();
    errorReporterInstance.reportErrorEvents();
    errorReporterInstance.reportWarnEvents();
    errorReporterInstance.reportWarnLogs();
}

Y.ITSAErrorReporter = Y.Global.ITSAErrorReporter;

}, '@VERSION@', {"requires": ["yui-base", "event-base", "event-custom-base", "gallery-itsadialog"]});
