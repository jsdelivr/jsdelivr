YUI.add('gallery-app-loading', function(Y) {

    /*
     * Adds two custom events, two callbacks, and
     * related configuration attributes to give you
     * the ability to notify the user while the views
     * or entire app is in a loading sequence 
     *
     * @module Y.AppLoading
     */

    var YLang = Y.Lang;

    function AppLoading(config) {

        var startLoadingSequence = this._startLoadingSequence;

        this.on('*:loading', startLoadingSequence, this);
        this.on('navigate', startLoadingSequence, this);
        this.on('activeViewChange', startLoadingSequence, this);
        this.on('*:loadingComplete', this._stopLoadingSequence, this);
        
        Y.Do.after(function(e) { this.fire('loadingComplete'); }, this, '_attachView', this);
    }

    AppLoading.ATTRS = {

        /*
         * Representation of the loading state of the app
         *
         * @attribute loading
         * @type bool
         * @default false
         * @public
         */
        loading: {
            value: false
        },

        /*
         * To add the viewContainerLoadingClass to the
         * viewContainer
         *
         * @attribute addClassToViewContainer
         * @type bool
         * @default true
         * @public
         */
        addClassToViewContainer: {
            value: true
        },

        /*
         * To add the containerLoadingClass to the container
         *
         * @attribute addClassToContainer
         * @type bool
         * @default true
         * @public
         */
        addClassToContainer: {
            value: true
        },

        /*
         * The class that gets added to the viewContainer 
         * while loading
         *
         * @attribute viewContainerLoadingClass
         * @type string
         * @public
         */
        viewContainerLoadingClass: {
            value: 'loading'
        },

        /*
         * The class that gets added to the container 
         * while loading
         *
         * @attribute containerLoadingClass
         * @type string
         * @public
         */
        containerLoadingClass: {
            value: 'loading'
        }
    };

    AppLoading.prototype = {

        /*
         * Ads the loading classes to the containers of configured,
         * fires loadingStarted event, and calls the user defined 
         * startLoadingSequence() function if defined in the App
         *
         * @method _startLoadingSequence
         * @private
         */
        _startLoadingSequence: function(e) {

            var container = this.get('container'),
                viewContainer = this.get('viewContainer'),
                containerLoadingClass = this.get('containerLoadingClass');

            if (!this.get('loading')) {
                this.set('loading', true);
                this.fire('loadingStarted');

                if(this.get('addClassToContainer') && !container.hasClass(containerLoadingClass)) { 
                    container.addClass(containerLoadingClass); 
                }

                if(this.get('addClassToViewContainer') && !viewContainer.hasClass(containerLoadingClass)) { 
                    viewContainer.addClass(containerLoadingClass); 
                }

                if (YLang.isFunction(this.startLoadingSequence)) { this.startLoadingSequence(); }
            }
        },

        /*
         * Removes the loading classes to the containers of configured,
         * fires loadingCompleted event, and calls the user defined 
         * stopLoadingSequence() function if defined in the App
         *
         * @method _stopLoadingSequence
         * @private
         */
        _stopLoadingSequence: function(e) {

            var container = this.get('container'),
                viewContainer = this.get('viewContainer'),
                containerLoadingClass = this.get('containerLoadingClass');

            if (this.get('loading')) {
                this.set('loading', false);
                this.fire('loadingCompleted');

                if(container.hasClass(containerLoadingClass)) { 
                    container.removeClass(containerLoadingClass); 
                }

                if(viewContainer.hasClass(containerLoadingClass)) { 
                    viewContainer.removeClass(containerLoadingClass); 
                }

                if (YLang.isFunction(this.stopLoadingSequence)) { this.stopLoadingSequence(); }
            }
        }

    };

    Y.AppLoading = AppLoading;


}, 'gallery-2012.05.09-20-27' ,{skinnable:false, requires:['app']});
