YUI.add('gallery-sandbox', function(Y) {

/**
 * <p>
 * Simplifies the process of creating isolated iframe sandboxes in which to
 * evaluate JavaScript code for tasks like profiling or unit testing.
 * </p>
 *
 * <p>
 * Note that these sandboxes, while isolated enough to be used for testing, are
 * not secure. They should be used only to run trusted code, and are not
 * intended to be used to execute arbitrary untrusted JavaScript.
 * </p>
 *
 * @module gallery-sandbox
 */

/**
 * <p>
 * Creates a new sandbox with the specified configuration. Since sandbox
 * creation may be asynchronous in some browsers, wait for the
 * <code>ready</code> event before using the sandbox.
 * </p>
 *
 * <p>
 * The <i>config</i> argument supports the following properties:
 * </p>
 *
 * <dl>
 *   <dt><strong>bootstrapYUI (Boolean)</strong></dt>
 *   <dd>
 *     If <code>true</code>, YUI3 Core and Loader will automatically be
 *     bootstrapped into the sandbox.
 *   </dd>
 * </dl>
 *
 * @class Sandbox
 * @param {Object} config configuration object
 * @constructor
 */

var GlobalEnv  = YUI.namespace('Env.Sandbox'),
    Lang       = Y.Lang,

    config     = Y.config,
    body       = config.doc.body,
    isFunction = Lang.isFunction,

    EVT_READY  = 'ready',

Sandbox = function (config) {
    /**
     * Fired when the sandbox has been initialized and is ready to use.
     * Attempts to use the sandbox before this event has fired may fail in
     * certain browsers (particularly Firefox). Subscribers that attach after
     * this event has fired will be executed instantly.
     *
     * @event ready
     */
    this.publish(EVT_READY, {fireOnce: true});

    this._id    = Y.guid('sandbox-');
    this.config = Y.merge(this.config, config || {});

    this._env = GlobalEnv[this._id] = {
        log: function () { Y.log.apply(this, arguments); }
    };

    this._createIframe();
};

Y.augment(Sandbox, Y.EventTarget);

Y.mix(Sandbox.prototype, {
    // -- Public Properties ----------------------------------------------------

    /**
     * Sandbox configuration.
     *
     * @property config
     * @type Object
     */
    config: {
        bootstrapYUI: false
    },

    // -- Public Methods -------------------------------------------------------

    /**
     * Clears any profiling data that has been gathered by this sandbox.
     *
     * @method clearProfile
     */
    clearProfile: function () {
        var env = this._env;

        delete env.done;
        delete env.endTime;
        delete env.runs;
        delete env.startTime;
    },

    /**
     * Runs the specified JavaScript in the sandbox as many times as possible
     * within the specified duration and returns the number of completed runs.
     * In the script, be sure to call <code>done()</code> to indicate
     * completion, or the runs will not be counted.
     *
     * @method count
     * @param {Function|String} script JavaScript code or a function to execute
     *   in the sandbox (note that functions will be cast to strings, so they
     *   will not carry their execution context with them)
     * @param {Number} duration duration to measure in milliseconds
     * @return {Number} number of runs completed within the specified duration
     */
    count: function (script, duration) {
        var env       = this._env,
            guid      = Y.guid('count-'),
            iframeWin = this._iframe.contentWindow,
            now,
            runs,
            start;

        script = this._getCountedScript(script, guid);
        start  = now = new Date().getTime();

        while (now - start < duration) {
            env.run.call(iframeWin, script);
            now = new Date().getTime();
        }

        runs = this.getEnvValue(guid);
        this.deleteEnvValue(guid);

        return runs || 0;
    },

    /**
     * Deletes a named value from the shared sandbox environment.
     *
     * @method deleteEnvValue
     * @param {String} key
     */
    deleteEnvValue: function (key) {
        if (key !== 'run' && Y.Object.owns(this._env, key)) {
            delete this._env[key];
        }
    },

    /**
     * Cleans up and destroys this sandbox and its associated iframe. After
     * calling this method, the sandbox will no longer be usable.
     *
     * @method destroy
     */
    destroy: function () {
        delete GlobalEnv[this._id];

        if (this._iframe && this._iframe.parentNode) {
            this._iframe.parentNode.removeChild(this._iframe);
            delete this._iframe;
        }
    },

    /**
     * Gets a named value from the shared sandbox environment. This can be used
     * to pass data between the sandbox and the parent. Code running in the
     * sandbox can access these values as properties on the <code>sandbox</code>
     * object.
     *
     * @method getEnvValue
     * @param {String} key
     * @return {mixed} named value, or <code>undefined</code> if not found
     */
    getEnvValue: function (key) {
        return Y.Object.owns(this._env, key) ? this._env[key] : undefined;
    },

    /**
     * <p>
     * Runs the specified JavaScript in the sandbox and creates timestamps when
     * it starts and when it finishes. In the script, be sure to call
     * <code>done()</code> to record the completion time. Time values will be
     * made available as environment values under the keys
     * <code>startTime</code> and <code>endTime</code>.
     * </p>
     *
     * <p>
     * If the executed JavaScript performs asynchronous operations, this method
     * may return before the script has finished executing. Pass in a callback
     * to be notified when the script has indicated its completion. The callback
     * will receive as an argument an object containing <code>startTime</code>,
     * <code>endTime</code>, and <code>duration</code> properties.
     * </p>
     *
     * @method profile
     * @param {Function|String} script JavaScript code or a function to execute
     *   in the sandbox (note that functions will be cast to strings, so they
     *   will not carry their execution context with them)
     * @param {Function} callback (optional) callback to execute when the script
     *   has indicated completion
     * @return {mixed} passes through the return value of the executed code
     */
    profile: function (script, callback) {
        var env       = this._env,
            guid      = Y.guid('profile-'),
            iframeWin = this._iframe.contentWindow,
            poll;

        this.clearProfile();

        script = this._getProfiledScript(script, guid);

        if (callback) {
            poll = Y.later(config.pollInterval || 15, this, function () {
                var profileData = this.getEnvValue(guid),
                    endTime     = profileData && profileData.endTime,
                    startTime;

                if (endTime) {
                    poll.cancel();

                    startTime = profileData.startTime;
                    this.deleteEnvValue(guid);

                    callback.call(config.win, {
                        duration : endTime - startTime,
                        endTime  : endTime,
                        startTime: startTime
                    });
                }
            }, null, true);
        }

        return env.run.call(iframeWin, script);
    },

    /**
     * <p>
     * Runs the specified JavaScript in the sandbox.
     * </p>
     *
     * <p>
     * If the executed JavaScript performs asynchronous operations, this method
     * may return before the script has finished executing. Pass in a callback
     * to be notified when the script has indicated its completion, and be sure
     * to call <code>done()</code> from the script so that completion can be
     * detected.
     * </p>
     *
     * @method run
     * @param {Function|String} script JavaScript code or a function to execute
     *   in the sandbox (note that functions will be cast to strings, so they
     *   will not carry their execution context with them)
     * @param {Function} callback (optional) callback to execute when the script
     *   has indicated completion
     * @return {mixed} passes through the return value of the executed code
     */
    run: function (script, callback) {
        var guid = Y.guid('run-'),
            poll;

        this.setEnvValue(guid, false);

        if (callback) {
            poll = Y.later(config.pollInterval || 15, this, function () {
                if (this.getEnvValue(guid) === true) {
                    poll.cancel();
                    this.deleteEnvValue(guid);
                    callback.call(config.win);
                }
            }, null, true);
        }

        return this._env.run.call(this._iframe.contentWindow,
                    this._getScript(script, guid));
    },

    /**
     * Sets a named value on the shared sandbox environment object. This can be
     * used to pass data between the sandbox and the parent. Code running in the
     * sandbox can access these values as properties on the <code>sandbox</code>
     * object.
     *
     * @method setEnvValue
     * @param {String} key
     * @param {mixed} value
     * @return {mixed} value that was set
     */
    setEnvValue: function (key, value) {
        if (key === 'run') {
            // This key is off limits.
            return undefined;
        }

        this._env[key] = value;

        return value;
    },

    // -- Protected Methods ----------------------------------------------------
    _createIframe: function () {
        var iframe    = body.appendChild(Y.DOM.create('<iframe id="' + this._id + '" style="display:none"/>')),
            iframeDoc = iframe.contentWindow.document,
            poll;

        // Based on a technique described by Dean Edwards:
        // http://dean.edwards.name/weblog/2006/11/sandbox/
        iframeDoc.write(
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
                '<title>' + this._id + '</title>' +
            '</head>' +
            '<body>' +
                '<script>' +
                    'var sandbox = parent.YUI.Env.Sandbox["' + this._id + '"];' +
                    'sandbox.run = function (script) { return window.eval(script); };' +
                '<\/script>'
        );

        if (this.config.bootstrapYUI) {
            iframeDoc.write(
                '<script src="' + config.base + 'yui/yui-min.js"><\/script>' +
                '<script src="' + config.base + 'loader/loader-min.js"><\/script>'
            );
        }

        iframeDoc.write(
                '<script>sandbox.ready = true;</script>' + // needed for Firefox
            '</body>' +
            '</html>'
        );

        // Allows window.onload to fire.
        iframeDoc.close();

        this._iframe = iframe;

        poll = Y.later(config.pollInterval || 15, this, function () {
            if (this.getEnvValue('ready') === true) {
                poll.cancel();
                this.fire(EVT_READY);
            }
        }, null, true);
    },

    _getCountedScript: function (script, guid) {
        return '(function () {' +
                   'var done = function () { sandbox["' + guid + '"] += 1 };' +
                   'sandbox["' + guid + '"] = sandbox["' + guid + '"] || 0;' +
                   (isFunction(script) ? '(' + script.toString() + '());' : script) +
               '}());';
    },

    _getProfiledScript: function (script, guid) {
        return '(function () {' +
                   'var done = function () { sandbox["' + guid + '"].endTime = new Date().getTime(); };' +
                   'sandbox["' + guid + '"] = {startTime: new Date().getTime()};' +
                   (isFunction(script) ? '(' + script.toString() + '());' : script) +
               '}());';
    },

    _getScript: function (script, guid) {
        return '(function () {' +
                   'var done = function () { sandbox["' + guid + '"] = true; };' +
                   (isFunction(script) ? '(' + script.toString() + '());' : script) +
               '}());';
    }
}, true);

Y.Sandbox = Sandbox;


}, 'gallery-2010.05.12-19-08' ,{requires:['dom-base','event-custom-base','later']});
