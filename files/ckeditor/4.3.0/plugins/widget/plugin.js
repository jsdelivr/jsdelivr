/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview [Widget](http://ckeditor.com/addon/widget) plugin.
 */

'use strict';

(function() {

	var DRAG_HANDLER_SIZE = 15;

	CKEDITOR.plugins.add( 'widget', {
		lang: 'en,ja,uk', // %REMOVE_LINE_CORE%
		requires: 'lineutils',
		onLoad: function() {
			CKEDITOR.addCss(
				'.cke_widget_wrapper{' +
					'position:relative;' +
					'outline:none' +
				'}' +
				'.cke_widget_inline{' +
					'display:inline-block' +
				'}' +
				'.cke_widget_wrapper:hover>.cke_widget_element{' +
					'outline:2px solid yellow;' +
					'cursor:default' +
				'}' +
				'.cke_widget_wrapper:hover .cke_widget_editable{' +
					'outline:2px solid yellow' +
				'}' +
				'.cke_widget_wrapper.cke_widget_focused>.cke_widget_element,' +
				// We need higher specificity than hover style.
				'.cke_widget_wrapper .cke_widget_editable.cke_widget_editable_focused{' +
					'outline:2px solid #ace' +
				'}' +
				'.cke_widget_editable{' +
					'cursor:text' +
				'}' +
				'.cke_widget_drag_handler_container{' +
					'position:absolute;' +
					'width:' + DRAG_HANDLER_SIZE + 'px;' +
					'height:0;' +
					'opacity:0.75;' +
					'transition:height 0s 0.2s' + // Delay hiding drag handler.
				'}' +
				'.cke_widget_wrapper:hover>.cke_widget_drag_handler_container{' +
					'height:' + DRAG_HANDLER_SIZE + 'px;' +
					'transition:none' +
				'}' +
				'.cke_widget_drag_handler_container:hover{' +
					'opacity:1' +
				'}'+
				'img.cke_widget_drag_handler{' +
					'cursor:move;' +
					'width:' + DRAG_HANDLER_SIZE + 'px;' +
					'height:' + DRAG_HANDLER_SIZE + 'px;' +
					'display:inline-block' +
				'}' +
				'.cke_widget_mask{' +
					'position:absolute;' +
					'top:0;' +
					'left:0;' +
					'width:100%;' +
					'height:100%;' +
					'display:block' +
				'}' +
				'.cke_editable.cke_widget_dragging, .cke_editable.cke_widget_dragging *{' +
					'cursor:move !important' +
				'}'
			);
		},

		beforeInit: function( editor ) {
			/**
			 * An instance of widget repository. It contains all
			 * {@link CKEDITOR.plugins.widget.repository#registered registered widget definitions} and
			 * {@link CKEDITOR.plugins.widget.repository#instances initialized instances}.
			 *
			 *		editor.widgets.add( 'someName', {
			 *			// Widget definition...
			 *		} );
			 *
			 *		editor.widgets.registered.someName; // -> Widget definition
			 *
			 * @since 4.3
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.repository} widgets
			 * @member CKEDITOR.editor
			 */
			editor.widgets = new Repository( editor );
		},

		afterInit: function( editor ) {
			addWidgetButtons( editor );
			setupContextMenu( editor );
		}
	} );

	/**
	 * Widget repository. It keeps track of all {@link #registered registered widget definitions} and
	 * {@link #instances initialized instances}. An instance of the repository is available under
	 * the {@link CKEDITOR.editor#widgets} property.
	 *
	 * @class CKEDITOR.plugins.widget.repository
	 * @mixins CKEDITOR.event
	 * @constructor Creates a widget repository instance. Note that the widget plugin automatically
	 * creates a repository instance which is available under the {@link CKEDITOR.editor#widgets} property.
	 * @param {CKEDITOR.editor} editor The editor instance for which the repository will be created.
	 */
	function Repository( editor ) {
		/**
		 * The editor instance for which this repository was created.
		 *
		 * @readonly
		 * @property {CKEDITOR.editor} editor
		 */
		this.editor = editor;

		/**
		 * A hash of registered widget definitions (definition name => {@link CKEDITOR.plugins.widget.definition}).
		 *
		 * To register a definition use the {@link #add} method.
		 *
		 * @readonly
		 */
		this.registered = {};

		/**
		 * An object containing initialized widget instances (widget id => {@link CKEDITOR.plugins.widget}).
		 *
		 * @readonly
		 */
		this.instances = {};

		/**
		 * An array of selected widget instances.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget[]} selected
		 */
		this.selected = [];

		/**
		 * The focused widget instance. See also {@link CKEDITOR.plugins.widget#event-focus}
		 * and {@link CKEDITOR.plugins.widget#event-blur} events.
		 *
		 *		editor.on( 'selectionChange', function() {
		 *			if ( editor.widgets.focused ) {
		 *				// Do something when a widget is focused...
		 *			}
		 *		} );
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget} focused
		 */
		this.focused = null;

		/**
		 * The widget instance that contains the nested editable which is currently focused.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget} widgetHoldingFocusedEditable
		 */
		this.widgetHoldingFocusedEditable = null;

		this._ = {
			nextId: 0,
			upcasts: [],
			filters: {}
		};

		setupDataProcessing( this );
		setupWidgetsObserver( this );
		setupSelectionObserver( this );
		setupMouseObserver( this );
		setupKeyboardObserver( this );
		setupDragAndDrop( this );
		setupNativeCutAndCopy( this );
	}

	Repository.prototype = {
		/**
		 * Minimum interval between selection checks.
		 *
		 * @private
		 */
		MIN_SELECTION_CHECK_INTERVAL: 500,

		/**
		 * Minimum interval between widget checks.
		 *
		 * @private
		 */
		MIN_WIDGETS_CHECK_INTERVAL: 1000,

		/**
		 * Adds a widget definition to the repository. Fires the {@link CKEDITOR.editor#widgetDefinition} event
		 * which allows to modify the widget definition which is going to be registered.
		 *
		 * @param {String} name The name of the widget definition.
		 * @param {CKEDITOR.plugins.widget.definition} widgetDef Widget definition.
		 * @returns {CKEDITOR.plugins.widget.definition}
		 */
		add: function( name, widgetDef ) {
			// Create prototyped copy of original widget definition, so we won't modify it.
			widgetDef = CKEDITOR.tools.prototypedCopy( widgetDef );
			widgetDef.name = name;

			widgetDef._ = widgetDef._ || {};

			this.editor.fire( 'widgetDefinition', widgetDef );

			if ( widgetDef.template )
				widgetDef.template = new CKEDITOR.template( widgetDef.template );

			addWidgetCommand( this.editor, widgetDef );
			addWidgetProcessors( this, widgetDef );

			// Register widget automatically if it does not have a button.
			if ( !widgetDef.button )
				this.editor.addFeature( widgetDef );

			this.registered[ name ] = widgetDef;

			return widgetDef;
		},

		/**
		 * Checks the selection to update widget states (selection and focus).
		 *
		 * This method is triggered by the {@link #event-checkSelection} event.
		 */
		checkSelection: function() {
			var sel = this.editor.getSelection(),
				selectedElement = sel.getSelectedElement(),
				updater = stateUpdater( this ),
				widget;

			// Widget is focused so commit and finish checking.
			if ( selectedElement && ( widget = this.getByElement( selectedElement, true ) ) )
				return updater.focus( widget ).select( widget ).commit();

			var range = sel.getRanges()[ 0 ];

			// No ranges or collapsed range mean that nothing is selected, so commit and finish checking.
			if ( !range || range.collapsed )
				return updater.commit();

			// Range is not empty, so create walker checking for wrappers.
			var walker = new CKEDITOR.dom.walker( range ),
				wrapper;

			walker.evaluator = isWidgetWrapper2;

			while ( ( wrapper = walker.next() ) )
				updater.select( this.getByElement( wrapper ) );

			updater.commit();
		},

		/**
		 * Checks if all widget instances are still present in the DOM.
		 * Destroys those instances that are not present.
		 * Reinitializes widgets on widget wrappers for which widget instances
		 * cannot be found.
		 *
		 * This method is triggered by the {@link #event-checkWidgets} event.
		 */
		checkWidgets: function() {
			if ( this.editor.mode != 'wysiwyg' )
				return;

			var editable = this.editor.editable(),
				instances = this.instances,
				i, count, wrapper;

			if ( !editable )
				return;

			// Remove widgets which have no corresponding elements in DOM.
			for ( i in instances ) {
				if ( !editable.contains( instances[ i ].wrapper ) )
					this.destroy( instances[ i ], true );
			}

			var wrappers = editable.find( '.cke_widget_wrapper' );

			// Create widgets on existing wrappers if they do not exists.
			for ( i = 0, count = wrappers.count(); i < count; i++ ) {
				wrapper = wrappers.getItem( i );

				// Check if there's no instance for this widget and that
				// wrapper is not inside some temporary element like copybin (#11088).
				if ( !this.getByElement( wrapper, true ) && !findParent( wrapper, isTemp2 ) ) {
					// Add cke_widget_new class because otherwise
					// widget will not be created on such wrapper.
					wrapper.addClass( 'cke_widget_new' );
					this.initOn( wrapper.getFirst( isWidgetElement2 ) );
				}
			}
		},

		/**
		 * Removes the widget from the editor and moves the selection to the closest
		 * editable position if the widget was focused before.
		 *
		 * @param {CKEDITOR.plugins.widget} widget The widget instance to be deleted.
		 */
		del: function( widget ) {
			if ( this.focused === widget ) {
				var editor = widget.editor,
					range = editor.createRange(),
					found;

				// If haven't found place for caret on the default side,
				// try to find it on the other side.
				if ( !( found = range.moveToClosestEditablePosition( widget.wrapper, true ) ) )
					found = range.moveToClosestEditablePosition( widget.wrapper, false );

				if ( found )
					editor.getSelection().selectRanges( [ range ] );
			}

			widget.wrapper.remove();
			this.destroy( widget, true );
		},

		/**
		 * Destroys the widget instance.
		 *
		 * @param {CKEDITOR.plugins.widget} widget The widget instance to be destroyed.
		 * @param {Boolean} [offline] Whether the widget is offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 */
		destroy: function( widget, offline ) {
			if ( this.widgetHoldingFocusedEditable === widget )
				setFocusedEditable( this, widget, null, offline );

			widget.destroy( offline );
			delete this.instances[ widget.id ];
			this.fire( 'instanceDestroyed', widget );
		},

		/**
		 * Destroys all widget instances.
		 *
		 * @param {Boolean} [offline] Whether the widgets are offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 */
		destroyAll: function( offline ) {
			var instances = this.instances,
				widget;

			for ( var id in instances ) {
				widget = instances[ id ];
				this.destroy( widget, offline );
			}
		},

		/**
		 * Finalizes a process of widget creation. This includes:
		 *
		 * * inserting widget element into editor,
		 * * marking widget instance as ready (see {@link CKEDITOR.plugins.widget#event-ready}),
		 * * focusing widget instance.
		 *
		 * This method is used by the default widget's command and is called
		 * after widget's dialog (if set) is closed. It may also be used in a
		 * customized process of widget creation and insertion.
		 *
		 *		widget.once( 'edit', function() {
		 *			// Finalize creation only of not ready widgets.
		 *			if ( widget.isReady() )
		 *				return;
		 *
		 *			// Cancel edit event to prevent automatic widget insertion.
		 *			evt.cancel();
		 *
		 *			CustomDialog.open( widget.data, function saveCallback( savedData ) {
		 *				// Cache the container, because widget may be destroyed while saving data,
		 *				// if this process will require some deep transformations.
		 *				var container = widget.wrapper.getParent();
		 *
		 *				widget.setData( savedData );
		 *
		 *				// Widget will be retrieved from container and inserted into editor.
		 *				editor.widgets.finalizeCreation( container );
		 *			} );
		 *		} );
		 *
		 * @param {CKEDITOR.dom.element/CKEDITOR.dom.documentFragment} container The element
		 * or document fragment which contains widget wrapper. The container is used, so before
		 * finalizing creation the widget can be freely transformed (even destroyed and reinitialized).
		 */
		finalizeCreation: function( container ) {
			var wrapper = container.getFirst();
			if ( wrapper && isWidgetWrapper2( wrapper ) ) {
				this.editor.insertElement( wrapper );

				var widget = this.getByElement( wrapper );
				// Fire postponed #ready event.
				widget.ready = true;
				widget.fire( 'ready' );
				widget.focus();
			}
		},

		/**
		 * Finds a widget instance which contains a given element. The element will be the {@link CKEDITOR.plugins.widget#wrapper wrapper}
		 * of the returned widget or a descendant of this {@link CKEDITOR.plugins.widget#wrapper wrapper}.
		 *
		 *		editor.widgets.getByElement( someWidget.wrapper ); // -> someWidget
		 *		editor.widgets.getByElement( someWidget.parts.caption ); // -> someWidget
		 *
		 *		// Check wrapper only:
		 *		editor.widgets.getByElement( someWidget.wrapper, true ); // -> someWidget
		 *		editor.widgets.getByElement( someWidget.parts.caption, true ); // -> null
		 *
		 * @param {CKEDITOR.dom.element} element The element to be checked.
		 * @param {Boolean} [checkWrapperOnly] If set to `true`, the method will not check wrappers' descendants.
		 * @returns {CKEDITOR.plugins.widget} The widget instance or `null`.
		 */
		getByElement: function( element, checkWrapperOnly ) {
			if ( !element )
				return null;

			var wrapper;

			for ( var id in this.instances ) {
				wrapper = this.instances[ id ].wrapper;
				if ( wrapper.equals( element ) || ( !checkWrapperOnly && wrapper.contains( element ) ) )
					return this.instances[ id ];
			}

			return null;
		},

		/**
		 * Initializes a widget on a given element if the widget has not been initialized on it yet.
		 *
		 * @param {CKEDITOR.dom.element} element The future widget element.
		 * @param {String/CKEDITOR.plugins.widget.definition} [widgetDef] Name of a widget or a widget definition.
		 * The widget definition should be previously registered by using the
		 * {@link CKEDITOR.plugins.widget.repository#add} method.
		 * @param [startupData] Widget startup data (has precedence over default one).
		 * @returns {CKEDITOR.plugins.widget} The widget instance or `null` if a widget could not be initialized on
		 * a given element.
		 */
		initOn: function( element, widgetDef, startupData ) {
			if ( !widgetDef )
				widgetDef = this.registered[ element.data( 'widget' ) ];
			else if ( typeof widgetDef == 'string' )
				widgetDef = this.registered[ widgetDef ];

			if ( !widgetDef )
				return null;

			// Wrap element if still wasn't wrapped (was added during runtime by method that skips dataProcessor).
			var wrapper = this.wrapElement( element, widgetDef.name );

			if ( wrapper ) {
				// Check if widget wrapper is new (widget hasn't been initialized on it yet).
				// This class will be removed by widget constructor to avoid locking snapshot twice.
				if ( wrapper.hasClass( 'cke_widget_new' ) ) {
					var widget = new Widget( this, this._.nextId++, element, widgetDef, startupData );

					// Widget could be destroyed when initializing it.
					if ( widget.isInited() ) {
						this.instances[ widget.id ] = widget;

						return widget;
					} else
						return null;
				}

				// Widget already has been initialized, so try to get widget by element.
				// Note - it may happen that other instance will returned than the one created above,
				// if for example widget was destroyed and reinitialized.
				return this.getByElement( element );
			}

			// No wrapper means that there's no widget for this element.
			return null;
		},

		/**
		 * Initializes widgets on all elements which were wrapped by {@link #wrapElement} and
		 * have not been initialized yet.
		 *
		 * @param {CKEDITOR.dom.element} [container=editor.editable()] The container which will be checked for not
		 * initialized widgets. Defaults to editor's {@link CKEDITOR.editor#editable editable} element.
		 * @returns {CKEDITOR.plugins.widget[]} Array of widget instances which have been initialized.
		 */
		initOnAll: function( container ) {
			var newWidgets = ( container || this.editor.editable() ).find( '.cke_widget_new' ),
				newInstances = [],
				instance;

			for ( var i = newWidgets.count(); i--; ) {
				instance = this.initOn( newWidgets.getItem( i ).getFirst( isWidgetElement2 ) );
				if ( instance )
					newInstances.push( instance );
			}

			return newInstances;
		},

		/**
		 * Wraps an element with a widget's non-editable container.
		 *
		 * If this method is called on an {@link CKEDITOR.htmlParser.element}, then it will
		 * also take care of fixing the DOM after wrapping (the wrapper may not be allowed in element's parent).
		 *
		 * @param {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} element The widget element to be wrapped.
		 * @param {String} [widgetName] The name of the widget definition. Defaults to element's `data-widget`
		 * attribute value.
		 * @returns {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} The wrapper element or `null` if
		 * the widget definition of this name is not registered.
		 */
		wrapElement: function( element, widgetName ) {
			var wrapper = null,
				widgetDef,
				isInline;

			if ( element instanceof CKEDITOR.dom.element ) {
				widgetDef = this.registered[ widgetName || element.data( 'widget' ) ];
				if ( !widgetDef )
					return null;

				// Do not wrap already wrapped element.
				wrapper = element.getParent();
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.data( 'cke-widget-wrapper' ) )
					return wrapper;

				// If attribute isn't already set (e.g. for pasted widget), set it.
				if ( !element.hasAttribute( 'data-cke-widget-keep-attr' ) )
					element.data( 'cke-widget-keep-attr', element.data( 'widget' ) ? 1 : 0 );
				if ( widgetName )
					element.data( 'widget', widgetName );

				isInline = isWidgetInline( widgetDef, element.getName() );

				wrapper = new CKEDITOR.dom.element( isInline ? 'span' : 'div' );
				wrapper.setAttributes( getWrapperAttributes( isInline ) );

				wrapper.data( 'cke-display-name', widgetDef.pathName ? widgetDef.pathName : element.getName() );

				// Replace element unless it is a detached one.
				if ( element.getParent( true ) )
					wrapper.replace( element );
				element.appendTo( wrapper );
			}
			else if ( element instanceof CKEDITOR.htmlParser.element ) {
				widgetDef = this.registered[ widgetName || element.attributes[ 'data-widget' ] ];
				if ( !widgetDef )
					return null;

				wrapper = element.parent;
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.attributes[ 'data-cke-widget-wrapper' ] )
					return wrapper;

				// If attribute isn't already set (e.g. for pasted widget), set it.
				if ( !( 'data-cke-widget-keep-attr' in element.attributes ) )
					element.attributes[ 'data-cke-widget-keep-attr' ] = element.attributes[ 'data-widget' ] ? 1 : 0;
				if ( widgetName )
					element.attributes[ 'data-widget' ] = widgetName;

				isInline = isWidgetInline( widgetDef, element.name );

				wrapper = new CKEDITOR.htmlParser.element( isInline ? 'span' : 'div', getWrapperAttributes( isInline ) );

				wrapper.attributes[ 'data-cke-display-name' ] = widgetDef.pathName ? widgetDef.pathName : element.name;

				var parent = element.parent,
					index;

				// Don't detach already detached element.
				if ( parent ) {
					index = element.getIndex();
					element.remove();
				}

				wrapper.add( element );

				// Insert wrapper fixing DOM (splitting parents if wrapper is not allowed inside them).
				parent && insertElement( parent, index, wrapper );
			}

			return wrapper;
		},

		// Expose for tests.
		_tests_getNestedEditable: getNestedEditable,
		_tests_createEditableFilter: createEditableFilter
	};

	CKEDITOR.event.implementOn( Repository.prototype );

	/**
	 * An event fired when a widget instance is created, but before it is fully initialized.
	 *
	 * @event instanceCreated
	 * @param {CKEDITOR.plugins.widget} data The widget instance.
	 */

	/**
	 * An event fired when a widget instance was destroyed.
	 *
	 * See also {@link CKEDITOR.plugins.widget#event-destroy}.
	 *
	 * @event instanceDestroyed
	 * @param {CKEDITOR.plugins.widget} data The widget instance.
	 */

	/**
	 * An event fired to trigger the selection check.
	 *
	 * See the {@link #method-checkSelection} method.
	 *
	 * @event checkSelection
	 */

	/**
	 * An event fired to trigger the widgets check.
	 *
	 * See {@link #method-checkWidgets} method.
	 *
	 * @event checkWidgets
	 */


	/**
	 * An instance of a widget. Together with {@link CKEDITOR.plugins.widget.repository} these
	 * two classes constitute the core of the Widget System.
	 *
	 * Note that neither the repository nor the widget instances can be created by using their constructors.
	 * A repository instance is automatically set up by the Widget plugin and is accessible under
	 * {@link CKEDITOR.editor#widgets}, while widget instances are created and destroyed by the repository.
	 *
	 * To create a widget, first you need to {@link CKEDITOR.plugins.widget.repository#add register} its
	 * {@link CKEDITOR.plugins.widget.definition definition}:
	 *
	 *		editor.widgets.add( 'simplebox', {
	 *			upcast: function( element ) {
	 *				// Defines which elements will become widgets.
	 *				if ( element.hasClass( 'simplebox' ) )
	 *					return true;
	 *			},
	 *			init: function() {
	 *				// ...
	 *			}
	 *		} );
	 *
	 * Once the widget definition is registered, widgets will be automatically
	 * created when loading data:
	 *
	 *		editor.setData( '<div class="simplebox">foo</div>', function() {
	 *			console.log( editor.widgets.instances ); // -> An object containing one instance.
	 *		} );
	 *
	 * It is also possible to create instances during runtime by using a command
	 * (if a {@link CKEDITOR.plugins.widget.definition#template} property was defined):
	 *
	 *		// You can execute an automatically defined command to
	 *		// insert a new simplebox widget or edit the one currently focused.
	 *		editor.execCommand( 'simplebox' );
	 *
	 * Or in a completely custom way:
	 *
	 *		var element = editor.createElement( 'div' );
	 *		editor.insertElement( element );
	 *		var widget = editor.widgets.initOn( element, 'simplebox' );
	 *
	 * @since 4.3
	 * @class CKEDITOR.plugins.widget
	 * @mixins CKEDITOR.event
	 * @extends CKEDITOR.plugins.widget.definition
	 * @constructor Creates an instance of the widget class. Do not use it directly, but instead initialize widgets
	 * by using the {@link CKEDITOR.plugins.widget.repository#initOn} method or by the upcasting system.
	 * @param {CKEDITOR.plugins.widget.repository} widgetsRepo
	 * @param {Number} id Unique ID of this widget instance.
	 * @param {CKEDITOR.dom.element} element The widget element.
	 * @param {CKEDITOR.plugins.widget.definition} widgetDef Widget's registered definition.
	 * @param [startupData] Initial widget data. This data object will overwrite the default data and
	 * the data loaded from the DOM.
	 */
	function Widget( widgetsRepo, id, element, widgetDef, startupData ) {
		var editor = widgetsRepo.editor;

		// Extend this widget with widgetDef-specific methods and properties.
		CKEDITOR.tools.extend( this, widgetDef, {
			/**
			 * The editor instance.
			 *
			 * @readonly
			 * @property {CKEDITOR.editor}
			 */
			editor: editor,

			/**
			 * This widget's unique (per editor instance) ID.
			 *
			 * @readonly
			 * @property {Number}
			 */
			id: id,

			/**
			 * Whether this widget is an inline widget (based on an inline element unless
			 * forced otherwise by {@link CKEDITOR.plugins.widget.definition#inline}).
			 *
			 * @readonly
			 * @property {Boolean}
			 */
			inline: element.getParent().getName() == 'span',

			/**
			 * The widget element &mdash; the element on which the widget was initialized.
			 *
			 * @readonly
			 * @property {CKEDITOR.dom.element} element
			 */
			element: element,

			/**
			 * Widget's data object.
			 *
			 * The data can only be set by using the {@link #setData} method.
			 * Changes made to the data fire the {@link #event-data} event.
			 *
			 * @readonly
			 */
			data: CKEDITOR.tools.extend( {}, typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults ),

			/**
			 * Indicates if a widget is data-ready. Set to `true` when data from all sources
			 * ({@link CKEDITOR.plugins.widget.definition#defaults}, set in the
			 * {@link #init} method, loaded from the widget's element and startup data coming from the constructor)
			 * are finally loaded. This is immediately followed by the first {@link #event-data}.
			 *
			 * @readonly
			 */
			dataReady: false,

			/**
			 * Whether a widget instance was initialized. This means that:
			 *
			 * * An instance was created,
			 * * Its properties were set,
			 * * The `init` method was executed.
			 *
			 * **Note**: The first {@link #event-data} event could not be fired yet which
			 * means that the widget's DOM has not been set up yet. Wait for the {@link #event-ready}
			 * event to be notified when a widget is fully initialized and ready.
			 *
			 * **Note**: Use the {@link #isInited} method to check whether a widget is initialized and
			 * has not been destroyed.
			 *
			 * @readonly
			 */
			inited: false,

			/**
			 * Whether a widget instance is ready. This means that the widget is {@link #inited} and
			 * that its DOM was finally set up.
			 *
			 * **Note:** Use the {@link #isReady} method to check whether a widget is ready and
			 * has not been destroyed.
			 *
			 * @readonly
			 */
			ready: false,

			// Revert what widgetDef could override (automatic #edit listener).
			edit: Widget.prototype.edit,

			/**
			 * The nested editable element which is currently focused.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.nestedEditable}
			 */
			focusedEditable: null,

			/**
			 * The widget definition from which this instance was created.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.definition} definition
			 */
			definition: widgetDef,

			/**
			 * Link to the widget repository which created this instance.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.repository} repository
			 */
			repository: widgetsRepo,

			draggable: widgetDef.draggable !== false,

			// WAAARNING: Overwrite widgetDef's priv object, because otherwise violent unicorn's gonna visit you.
			_: {
				downcastFn: ( widgetDef.downcast && typeof widgetDef.downcast == 'string' ) ?
					widgetDef.downcasts[ widgetDef.downcast ] : widgetDef.downcast
			}
		}, true );

		/**
		 * An object of widget component elements.
		 *
		 * For every `partName => selector` pair in {@link CKEDITOR.plugins.widget.definition#parts},
		 * one `partName => element` pair is added to this object during the widget initialization.
		 *
		 * @readonly
		 * @property {Object} parts
		 */

		/**
		 * The template which will be used to create a new widget element (when the widget's command is executed).
		 * It will be populated with {@link #defaults default values}.
		 *
		 * @readonly
		 * @property {CKEDITOR.template} template
		 */

		/**
		 * The widget wrapper &mdash; a non-editable `div` or `span` element (depending on {@link #inline})
		 * which is a parent of the {@link #element} and widget compontents like the drag handler and the {@link #mask}.
		 * It is the outermost widget element.
		 *
		 * @readonly
		 * @property {CKEDITOR.dom.element} wrapper
		 */

		// #11074 - IE8 throws exceptions when dragging widget using the native method.
		if ( this.inline && CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
			this.draggable = false;

		widgetsRepo.fire( 'instanceCreated', this );

		setupWidget( this, widgetDef );

		this.init && this.init();

		// Finally mark widget as inited.
		this.inited = true;

		setupWidgetData( this, startupData );

		// If at some point (e.g. in #data listener) widget hasn't been destroyed
		// and widget is already attached to document then fire #ready.
		if ( this.isInited() && editor.editable().contains( this.wrapper ) ) {
			this.ready = true;
			this.fire( 'ready' );
		}
	}

	Widget.prototype = {
		/**
		 * Destroys this widget instance.
		 *
		 * Use {@link CKEDITOR.plugins.widget.repository#destroy} when possible instead of this method.
		 *
		 * This method fires the {#event-destroy} event.
		 *
		 * @param {Boolean} [offline] Whether a widget is offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 */
		destroy: function( offline ) {
			var editor = this.editor;

			this.fire( 'destroy' );

			if ( this.editables ) {
				for ( var name in this.editables )
					this.destroyEditable( name, offline );
			}

			if ( !offline ) {
				if ( this.element.data( 'cke-widget-keep-attr' ) == '0' )
					this.element.removeAttribute( 'data-widget' );
				this.element.removeAttributes( [ 'data-cke-widget-data', 'data-cke-widget-keep-attr' ] );
				this.element.removeClass( 'cke_widget_element' );
				this.element.replace( this.wrapper );
			}

			this.wrapper = null;
		},

		/**
		 * Destroys a nested editable.
		 *
		 * @param {String} editableName Nested editable name.
		 * @param {Boolean} [offline] See {@link #method-destroy} method.
		 */
		destroyEditable: function( editableName, offline ) {
			var editable = this.editables[ editableName ];

			editable.removeListener( 'focus', onEditableFocus );
			editable.removeListener( 'blur', onEditableBlur );
			this.editor.focusManager.remove( editable );

			if ( !offline ) {
				editable.removeClass( 'cke_widget_editable' );
				editable.removeClass( 'cke_widget_editable_focused' );
				editable.removeAttributes( [ 'contenteditable', 'data-cke-widget-editable', 'data-cke-enter-mode' ] );
			}

			delete this.editables[ editableName ];
		},

		/**
		 * Starts widget editing.
		 *
		 * This method fires the {@link CKEDITOR.plugins.widget#event-edit} event
		 * which may be cancelled in order to prevent it from opening a dialog window.
		 *
		 * The dialog window name is obtained from the event's data `dialog` property or
		 * from {@link CKEDITOR.plugins.widget.definition#dialog}.
		 */
		edit: function() {
			var evtData = { dialog: this.dialog },
				that = this;

			// Edit event was blocked, but there's no dialog to be automatically opened.
			if ( !this.fire( 'edit', evtData ) || !evtData.dialog )
				return;

			this.editor.openDialog( evtData.dialog, function( dialog ) {
				var showListener,
					okListener;

				// Allow to add a custom dialog handler.
				if ( !that.fire( 'dialog', dialog ) )
					return;

				showListener = dialog.on( 'show', function() {
					dialog.setupContent( that );
				} );

				okListener = dialog.on( 'ok', function() {
					// Commit dialog's fields, but prevent from
					// firing data event for every field. Fire only one,
					// bulk event at the end.
					var dataChanged,
						dataListener = that.on( 'data', function( evt ) {
							dataChanged = 1;
							evt.cancel();
						}, null, null, 0 );

					// Create snapshot preceeding snapshot with changed widget...
					// TODO it should not be required, but it is and I found similar
					// code in dialog#ok listener in dialog/plugin.js.
					that.editor.fire( 'saveSnapshot' );
					dialog.commitContent( that );

					dataListener.removeListener();
					if ( dataChanged ) {
						that.fire( 'data', that.data );
						that.editor.fire( 'saveSnapshot' );
					}
				} );

				dialog.once( 'hide', function() {
					showListener.removeListener();
					okListener.removeListener();
				} );
			} );
		},

		/**
		 * Initializes a nested editable.
		 *
		 * **Note**: Only elements from {@link CKEDITOR.dtd#$editable} may become editables.
		 *
		 * @param {String} editableName The nested editable name.
		 * @param {CKEDITOR.plugins.widget.nestedEditable.definition} definition The definition of the nested editable.
		 * @returns {Boolean} Whether an editable was successfully initialized.
		 */
		initEditable: function( editableName, definition ) {
			var editable = this.wrapper.findOne( definition.selector );

			if ( editable && editable.is( CKEDITOR.dtd.$editable ) ) {
				editable = new NestedEditable( this.editor, editable, {
					filter: createEditableFilter.call( this.repository, this.name, editableName, definition )
				} );
				this.editables[ editableName ] = editable;

				editable.setAttributes( {
					contenteditable: 'true',
					'data-cke-widget-editable': editableName,
					'data-cke-enter-mode': editable.enterMode
				} );

				if ( editable.filter )
					editable.data( 'cke-filter', editable.filter.id );

				editable.addClass( 'cke_widget_editable' );
				// This class may be left when d&ding widget which
				// had focused editable. Clean this class here, not in
				// cleanUpWidgetElement for performance and code size reasons.
				editable.removeClass( 'cke_widget_editable_focused' );

				if ( definition.pathName )
					editable.data( 'cke-display-name', definition.pathName );

				this.editor.focusManager.add( editable );
				editable.on( 'focus', onEditableFocus, this );
				CKEDITOR.env.ie && editable.on( 'blur', onEditableBlur, this );

				// Finally, process editable's data. This data wasn't processed when loading
				// editor's data, becuase they need to be processed separately, with its own filters and settings.
				editable.setData( editable.getHtml() );

				return true;
			}

			return false;
		},

		/**
		 * Checks if a widget has already been initialized and has not been destroyed yet.
		 *
		 * See {@link #inited} for more details.
		 *
		 * @returns {Boolean}
		 */
		isInited: function() {
			return !!( this.wrapper && this.inited );
		},

		/**
		 * Checks if a widget is ready and has not been destroyed yet.
		 *
		 * See {@link #property-ready} for more details.
		 *
		 * @returns {Boolean}
		 */
		isReady: function() {
			return this.isInited() && this.ready;
		},

		/**
		 * Focuses a widget by selecting it.
		 */
		focus: function() {
			var sel = this.editor.getSelection();

			if ( sel )
				sel.fake( this.wrapper );

			// Always focus editor (not only when focusManger.hasFocus is false) (because of #10483).
			this.editor.focus();
		},

		/**
		 * Sets widget value(s) in the {@link #property-data} object.
		 * If the given value(s) modifies current ones, the {@link #event-data} event is fired.
		 *
		 *		this.setData( 'align', 'left' );
		 *		this.data.align; // -> 'left'
		 *
		 *		this.setData( { align: 'right', opened: false } );
		 *		this.data.align; // -> 'right'
		 *		this.data.opened; // -> false
		 *
		 * Set values are stored in {@link #element}'s attribute (`data-cke-widget-data`),
		 * in a JSON string, therefore {@link #property-data} should contain
		 * only serializable data.
		 *
		 * @param {String/Object} keyOrData
		 * @param {Object} value
		 * @chainable
		 */
		setData: function( key, value ) {
			var data = this.data,
				modified = 0;

			if ( typeof key == 'string' ) {
				if ( data[ key ] !== value ) {
					data[ key ] = value;
					modified = 1;
				}
			}
			else {
				var newData = key;

				for ( key in newData ) {
					if ( data[ key ] !== newData[ key ] ) {
						modified = 1;
						data[ key ] = newData[ key ];
					}
				}
			}

			// Block firing data event and overwriting data element before setupWidgetData is executed.
			if ( modified && this.dataReady ) {
				writeDataToElement( this );
				this.fire( 'data', data );
			}

			return this;
		},

		/**
		 * Changes the widget's focus state. This method is executed automatically after
		 * a widget has been focused by the {@link #method-focus} method or a selection was moved
		 * out of the widget.
		 *
		 * @param {Boolean} selected Whether to select or deselect this widget.
		 * @chainable
		 */
		setFocused: function( focused ) {
			this.wrapper[ focused ? 'addClass' : 'removeClass' ]( 'cke_widget_focused' );
			this.fire( focused ? 'focus' : 'blur' );
			return this;
		},

		/**
		 * Changes the widget's select state. This method is executed automatically after
		 * a widget has been selected by the {@link #method-focus} method or the selection
		 * was moved out of widget.
		 *
		 * @param {Boolean} selected Whether to select or deselect this widget.
		 * @chainable
		 */
		setSelected: function( selected ) {
			this.wrapper[ selected ? 'addClass' : 'removeClass' ]( 'cke_widget_selected' );
			this.fire(  selected ? 'select' : 'deselect' );
			return this;
		}
	};

	CKEDITOR.event.implementOn( Widget.prototype );

	/**
	 * An event fired when a widget is ready (fully initialized). This event is fired after:
	 *
	 * * {@link #init} is called,
	 * * The first {@link #event-data} event is fired,
	 * * A widget is attached to the document.
	 *
	 * Therefore, in case of widget creation with a command which opens a dialog window, this event
	 * will be delayed after the dialog window is closed and the widget is finally inserted into the document.
	 *
	 * **Note**: If your widget does not use automatic dialog window binding (i.e. you open the dialog window manually)
	 * or another situation in which the widget wrapper is not attached to document at the time when it is
	 * initialized occurs, you need to take care of firing {@link #event-ready} yourself.
	 *
	 * See also {@link #property-ready} and {@link #property-inited} properties, and
	 * {@link #isReady} and {@link #isInited} methods.
	 *
	 * @event ready
	 */

	/**
	 * An event fired when a widget is about to be destroyed, but before it is
	 * fully torn down.
	 *
	 * @event destroy
	 */

	/**
	 * An event fired when a widget is focused.
	 *
	 * Widget can be focused by executing {@link #method-focus}.
	 *
	 * @event focus
	 */

	/**
	 * An event fired when a widget is blurred.
	 *
	 * @event blur
	 */

	/**
	 * An event fired when a widget is selected.
	 *
	 * @event select
	 */

	/**
	 * An event fired when a widget is deselected.
	 *
	 * @event deselect
	 */

	/**
	 * An event fired by the {@link #method-edit} method. It can be canceled
	 * in order to stop the default action (opening a dialog window and/or
	 * {@link CKEDITOR.plugins.widget.repository#finalizeCreation finalizing widget creation}).
	 *
	 * @event edit
	 * @param data
	 * @param {String} data.dialog Defaults to {@link CKEDITOR.plugins.widget.definition#dialog}
	 * and can be changed or set by the listener.
	 */

	/**
	 * An event fired when a dialog window for widget editing is opened.
	 * This event can be cancelled in order to handle the editing dialog in a custom manner.
	 *
	 * @event dialog
	 * @param {CKEDITOR.dialog} data The opened dialog window instance.
	 */

	/**
	 * An event fired when a key is pressed on a focused widget.
	 * This event is forwarded from the {@link CKEDITOR.editor#key} event and
	 * has the ability to block editor keystrokes if it is cancelled.
	 *
	 * @event key
	 * @param data
	 * @param {Number} data.keyCode A number representing the key code (or combination).
	 */

	/**
	 * An event fired when a widget is double clicked.
	 *
	 * @event doubleclick
	 * @param data
	 * @param {CKEDITOR.dom.element} data.element The double clicked element.
	 */

	/**
	 * An event fired when the context menu is opened for a widget.
	 *
	 * @event contextMenu
	 * @param data The object contaning context menu options to be added
	 * for this widget. See {@link CKEDITOR.plugins.contextMenu#addListener}.
	 */

	/**
	 * An event fired when the widget data changed. See the {@link #setData} method and the {@link #property-data} property.
	 *
	 * @event data
	 */



	/**
	 * The wrapper class for editable elements inside widgets.
	 *
	 * Do not use directly. Use {@link CKEDITOR.plugins.widget.definition#editables} or
	 * {@link CKEDITOR.plugins.widget#initEditable}.
	 *
	 * @class CKEDITOR.plugins.widget.nestedEditable
	 * @extends CKEDITOR.dom.element
	 * @constructor
	 * @param {CKEDITOR.editor} editor
	 * @param {CKEDITOR.dom.element} element
	 * @param config
	 * @param {CKEDITOR.filter} [config.filter]
	 */
	function NestedEditable( editor, element, config ) {
		// Call the base constructor.
		CKEDITOR.dom.element.call( this, element.$ );
		this.editor = editor;
		var filter = this.filter = config.filter;

		// If blockless editable - always use BR mode.
		if ( !CKEDITOR.dtd[ this.getName() ].p )
			this.enterMode = this.shiftEnterMode = CKEDITOR.ENTER_BR;
		else {
			this.enterMode = filter ? filter.getAllowedEnterMode( editor.enterMode ) : editor.enterMode;
			this.shiftEnterMode = filter ? filter.getAllowedEnterMode( editor.shiftEnterMode, true ) : editor.shiftEnterMode;
		}
	}

	NestedEditable.prototype = CKEDITOR.tools.extend( CKEDITOR.tools.prototypedCopy( CKEDITOR.dom.element.prototype ), {
		/**
		 * Sets the editable data. The data will be passed through the {@link CKEDITOR.editor#dataProcessor}
		 * and the {@link CKEDITOR.editor#filter}. This ensures that the data was filtered and prepared to be
		 * edited like the {@link CKEDITOR.editor#method-setData editor data}.
		 *
		 * @param {String} data
		 */
		setData: function( data ) {
			data = this.editor.dataProcessor.toHtml( data, {
				context: this.getName(),
				filter: this.filter,
				enterMode: this.enterMode
			} );
			this.setHtml( data );
		},

		/**
		 * Gets the editable data. Like {@link #setData}, this method will process and filter the data.
		 *
		 * @returns {String}
		 */
		getData: function() {
			return this.editor.dataProcessor.toDataFormat( this.getHtml(), {
				context: this.getName(),
				filter: this.filter,
				enterMode: this.enterMode
			} );
		}
	} );

	/**
	 * The editor instance.
	 *
	 * @readonly
	 * @property {CKEDITOR.editor} editor
	 */

	/**
	 * The filter instance if allowed content rules were defined.
	 *
	 * @readonly
	 * @property {CKEDITOR.filter} filter
	 */

	/**
	 * The enter mode active in this editable.
	 * It is determined from editable's name (whether it is a blockless editable),
	 * its allowed content rules (if defined) and the default editor's mode.
	 *
	 * @readonly
	 * @property {Number} enterMode
	 */

	/**
	 * The shift enter move active in this editable.
	 *
	 * @readonly
	 * @property {Number} shiftEnterMode
	 */


	//
	// REPOSITORY helpers -----------------------------------------------------
	//

	function addWidgetButtons( editor ) {
		var widgets = editor.widgets.registered,
			widget,
			widgetName,
			widgetButton;

		for ( widgetName in widgets ) {
			widget = widgets[ widgetName ];

			// Create button if defined.
			widgetButton = widget.button;
			if ( widgetButton && editor.ui.addButton ) {
				editor.ui.addButton( CKEDITOR.tools.capitalize( widget.name, true ), {
					label: widgetButton,
					command: widget.name,
					toolbar: 'insert,10'
				} );
			}
		}
	}

	// Create a command creating and editing widget.
	//
	// @param editor
	// @param {CKEDITOR.plugins.widget.definition} widgetDef
	function addWidgetCommand( editor, widgetDef ) {
		editor.addCommand( widgetDef.name, {
			exec: function() {
				var focused = editor.widgets.focused;
				// If a widget of the same type is focused, start editing.
				if ( focused && focused.name == widgetDef.name )
					focused.edit();
				// Otherwise...
				// ... use insert method is was defined.
				else if ( widgetDef.insert )
					widgetDef.insert();
				// ... or create a brand-new widget from template.
				else if ( widgetDef.template ) {
					var defaults = typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults,
						element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( defaults ) ),
						instance,
						wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
						temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

					// Append wrapper to a temporary document. This will unify the environment
					// in which #data listeners work when creating and editing widget.
					temp.append( wrapper );
					instance = editor.widgets.initOn( element, widgetDef );

					// Instance could be destroyed during initialization.
					// In this case finalize creation if some new widget
					// was left in temporary document fragment.
					if ( !instance ) {
						finalizeCreation();
						return;
					}

					// Listen on edit to finalize widget insertion.
					//
					// * If dialog was set, then insert widget after dialog was successfully saved or destroy this
					// temporary instance.
					// * If dialog wasn't set and edit wasn't canceled, insert widget.
					var editListener = instance.once( 'edit', function( evt ) {
						if ( evt.data.dialog ) {
							instance.once( 'dialog', function( evt ) {
								var dialog = evt.data,
									okListener,
									cancelListener;

								// Finalize creation AFTER (20) new data was set.
								okListener = dialog.once( 'ok', finalizeCreation, null, null, 20 );

								cancelListener = dialog.once( 'cancel', function() {
									editor.widgets.destroy( instance, true );
								} );

								dialog.once( 'hide', function() {
									okListener.removeListener();
									cancelListener.removeListener();
								} );
							} );
						}
						// Dialog hasn't been set, so insert widget now.
						else
							finalizeCreation();
					}, null, null, 999 );

					instance.edit();

					// Remove listener in case someone canceled it before this
					// listener was executed.
					editListener.removeListener();
				}

				function finalizeCreation() {
					editor.widgets.finalizeCreation( temp );
				}
			},

			refresh: function( editor, path ) {
				// Disable widgets' commands inside nested editables -
				// check if blockLimit is a nested editable or a descendant of any.
				this.setState( getNestedEditable( editor.editable(), path.blockLimit ) ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF );
			},
			// A hack to force command refreshing on context change.
			context: 'div',

			allowedContent: widgetDef.allowedContent,
			requiredContent: widgetDef.requiredContent,
			contentForms: widgetDef.contentForms,
			contentTransformations: widgetDef.contentTransformations
		} );
	}

	function addWidgetProcessors( widgetsRepo, widgetDef ) {
		var upcast = widgetDef.upcast,
			upcasts;

		if ( !upcast )
			return;

		// Multiple upcasts defined in string.
		if ( typeof upcast == 'string' ) {
			upcasts = upcast.split( ',' );
			while ( upcasts.length )
				widgetsRepo._.upcasts.push( [ widgetDef.upcasts[ upcasts.pop() ], widgetDef.name ] );
		}
		// Single rule which is automatically activated.
		else
			widgetsRepo._.upcasts.push( [ upcast, widgetDef.name ] );
	}

	function blurWidget( widgetsRepo, widget ) {
		widgetsRepo.focused = null;

		if ( widget.isInited() ) {
			// Widget could be destroyed in the meantime - e.g. data could be set.
			widgetsRepo.fire( 'widgetBlurred', { widget: widget } );
			widget.setFocused( false );
		}
	}

	// Unwraps widget element and clean up element.
	//
	// This function is used to clean up pasted widgets.
	// It should have similar result to widget#destroy plus
	// some additional adjustments, specific for pasting.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function cleanUpWidgetElement( el ) {
		var parent = el.parent;
		if ( parent.type == CKEDITOR.NODE_ELEMENT && parent.attributes[ 'data-cke-widget-wrapper' ] )
			parent.replaceWith( el );
	}

	// Similar to cleanUpWidgetElement, but works on DOM and finds
	// widget elements by its own.
	//
	// Unlike cleanUpWidgetElement it will wrap element back.
	//
	// @param {CKEDITOR.dom.element} container
	function cleanUpAllWidgetElements( widgetsRepo, container ) {
		var wrappers = container.find( '.cke_widget_wrapper' ),
			wrapper, element,
			i = 0,
			l = wrappers.count();

		for ( ; i < l; ++i ) {
			wrapper = wrappers.getItem( i );
			element = wrapper.getFirst( isWidgetElement2 );
			// If wrapper contains widget element - unwrap it and wrap again.
			if ( element.type == CKEDITOR.NODE_ELEMENT && element.data( 'widget' ) ) {
				element.replace( wrapper );
				widgetsRepo.wrapElement( element );
			}
			// Otherwise - something is wrong... clean this up.
			else
				wrapper.remove();
		}
	}

	// Creates {@link CKEDITOR.filter} instance for given widget, editable and rules.
	//
	// Once filter for widget-editable pair is created it is cached, so the same instance
	// will be returned when method is executed again.
	//
	// @param {String} widgetName
	// @param {String} editableName
	// @param {CKEDITOR.plugins.widget.nestedEditableDefinition} editableDefinition The nested editable definition.
	// @returns {CKEDITOR.filter} Filter instance or `null` if rules are not defined.
	// @context CKEDITOR.plugins.widget.repository
	function createEditableFilter( widgetName, editableName, editableDefinition ) {
		if ( !editableDefinition.allowedContent )
			return null;

		var editables = this._.filters[ widgetName ];

		if ( !editables )
			this._.filters[ widgetName ] = editables = {};

		var filter = editables[ editableName ];

		if ( !filter )
			editables[ editableName ] = filter = new CKEDITOR.filter( editableDefinition.allowedContent );

		return filter;
	}

	// Finds a first parent that matches query.
	//
	// @param {CKEDITOR.dom.element} element
	// @param {Function} query
	function findParent( element, query ) {
		var parent = element;

		while ( ( parent = parent.getParent() ) ) {
			if ( query( parent ) )
				return true;
		}
		return false;
	}

	// Gets nested editable if node is its descendant or the editable itself.
	//
	// @param {CKEDITOR.dom.element} guard Stop ancestor search on this node (usually editor's editable).
	// @param {CKEDITOR.dom.node} node Start search from this node.
	// @returns {CKEDITOR.dom.element} Element or null.
	function getNestedEditable( guard, node ) {
		if ( !node || node.equals( guard ) )
			return null;

		if ( isNestedEditable2( node ) )
			return node;

		return getNestedEditable( guard, node.getParent() );
	}

	function getWrapperAttributes( inlineWidget ) {
		return {
			// tabindex="-1" means that it can receive focus by code.
			tabindex: -1,
			contenteditable: 'false',
			'data-cke-widget-wrapper': 1,
			'data-cke-filter': 'off',
			// Class cke_widget_new marks widgets which haven't been initialized yet.
			'class': 'cke_widget_wrapper cke_widget_new cke_widget_' +
				( inlineWidget ? 'inline' : 'block' )
		};
	}

	// Inserts element at given index.
	// It will check DTD and split ancestor elements up to the first
	// that can contain this element.
	//
	// @param {CKEDITOR.htmlParser.element} parent
	// @param {Number} index
	// @param {CKEDITOR.htmlParser.element} element
	function insertElement( parent, index, element ) {
		// Do not split doc fragment...
		if ( parent.type == CKEDITOR.NODE_ELEMENT ) {
			var parentAllows = CKEDITOR.dtd[ parent.name ];
			// Parent element is known (included in DTD) and cannot contain
			// this element.
			if ( parentAllows && !parentAllows[ element.name ] ) {
				var parent2 = parent.split( index ),
					parentParent = parent.parent;

				// Element will now be inserted at right parent's index.
				index = parent2.getIndex();

				// If left part of split is empty - remove it.
				if ( !parent.children.length ) {
					index -= 1;
					parent.remove();
				}

				// If right part of split is empty - remove it.
				if ( !parent2.children.length )
					parent2.remove();

				// Try inserting as grandpas' children.
				return insertElement( parentParent, index, element );
			}
		}

		// Finally we can add this element.
		parent.add( element, index );
	}

	// @param {CKEDITOR.htmlParser.element}
	function isWidgetElement( element ) {
		return element.type == CKEDITOR.NODE_ELEMENT && !!element.attributes[ 'data-widget' ];
	}

	// @param {CKEDITOR.dom.element}
	function isWidgetElement2( element ) {
		return element.type == CKEDITOR.NODE_ELEMENT && element.hasAttribute( 'data-widget' );
	}

	// Whether for this definition and element widget should be created in inline or block mode.
	function isWidgetInline( widgetDef, elementName ) {
		return typeof widgetDef.inline == 'boolean' ? widgetDef.inline : !!CKEDITOR.dtd.$inline[ elementName ];
	}

	// @param {CKEDITOR.htmlParser.element}
	function isWidgetWrapper( element ) {
		return element.type == CKEDITOR.NODE_ELEMENT && element.attributes[ 'data-cke-widget-wrapper' ];
	}

	// @param {CKEDITOR.dom.element}
	function isWidgetWrapper2( element ) {
		return element.type == CKEDITOR.NODE_ELEMENT && element.hasAttribute( 'data-cke-widget-wrapper' );
	}

	// @param {CKEDITOR.dom.element}
	function isNestedEditable2( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-cke-widget-editable' );
	}

	// @param {CKEDITOR.dom.element}
	function isTemp2( element ) {
		return element.hasAttribute( 'data-cke-temp' );
	}

	function moveSelectionToDropPosition( editor, dropEvt ) {
		var $evt = dropEvt.data.$,
			$range,
			range = editor.createRange();

		// Make testing possible.
		if ( dropEvt.data.testRange ) {
			dropEvt.data.testRange.select();
			return;
		}

		// Webkits.
		if ( document.caretRangeFromPoint ) {
			$range = editor.document.$.caretRangeFromPoint( $evt.clientX, $evt.clientY );
			range.setStart( CKEDITOR.dom.node( $range.startContainer ), $range.startOffset );
			range.collapse( true );
		}
		// FF.
		else if ( $evt.rangeParent ) {
			range.setStart( CKEDITOR.dom.node( $evt.rangeParent ), $evt.rangeOffset );
			range.collapse( true );
		}
		// IEs.
		else if ( document.body.createTextRange ) {
			$range = editor.document.getBody().$.createTextRange();
			$range.moveToPoint( $evt.clientX, $evt.clientY );
			var id = 'cke-temp-' + ( new Date() ).getTime();
			$range.pasteHTML( '<span id="' + id + '">\u200b</span>' );

			var span = editor.document.getById( id );
			range.moveToPosition( span, CKEDITOR.POSITION_BEFORE_START );
			span.remove();
		}

		range.select();
	}

	function moveWidget( editor, sourceWidget ) {
		var widgetHtml = sourceWidget.wrapper.getOuterHtml();
		sourceWidget.wrapper.remove();
		editor.widgets.destroy( sourceWidget, true );
		editor.execCommand( 'paste', widgetHtml );
		editor.fire( 'unlockSnapshot' );
	}

	function onEditableKey( widget, keyCode ) {
		var focusedEditable = widget.focusedEditable,
			range;

		// CTRL+A.
		if ( keyCode == CKEDITOR.CTRL + 65 ) {
			var bogus = focusedEditable.getBogus();

			range = widget.editor.createRange();
			range.selectNodeContents( focusedEditable );
			// Exclude bogus if exists.
			if ( bogus )
				range.setEndAt( bogus, CKEDITOR.POSITION_BEFORE_START );

			range.select();
			// Cancel event - block default.
			return false;
		}
		// DEL or BACKSPACE.
		else if ( keyCode == 8 || keyCode == 46 ) {
			var ranges = widget.editor.getSelection().getRanges();

			range = ranges[ 0 ];

			// Block del or backspace if at editable's boundary.
			return !( ranges.length == 1 && range.collapsed &&
				range.checkBoundaryOfElement( focusedEditable, CKEDITOR[ keyCode == 8 ? 'START' : 'END' ] ) );
		}
	}

	function setFocusedEditable( widgetsRepo, widget, editableElement, offline ) {
		var editor = widgetsRepo.editor;

		editor.fire( 'lockSnapshot' );

		if ( editableElement ) {
			var editableName = editableElement.data( 'cke-widget-editable' ),
				editableInstance = widget.editables[ editableName ];

			widgetsRepo.widgetHoldingFocusedEditable = widget;
			widget.focusedEditable = editableInstance;
			editableElement.addClass( 'cke_widget_editable_focused' );

			if ( editableInstance.filter )
				editor.setActiveFilter( editableInstance.filter );
			editor.setActiveEnterMode( editableInstance.enterMode, editableInstance.shiftEnterMode );
		} else {
			if ( !offline )
				widget.focusedEditable.removeClass( 'cke_widget_editable_focused' );

			widget.focusedEditable = null;
			widgetsRepo.widgetHoldingFocusedEditable = null;
			editor.setActiveFilter( null );
			editor.setActiveEnterMode( null, null );
		}

		editor.fire( 'unlockSnapshot' );
	}

	function setupContextMenu( editor ) {
		if ( !editor.contextMenu )
			return;

		editor.contextMenu.addListener( function( element ) {
			var widget = editor.widgets.getByElement( element, true );

			if ( widget )
				return widget.fire( 'contextMenu', {} );
		} );
	}

	// And now we've got two problems - original problem and RegExp.
	// Some softeners:
	// * FF tends to copy all blocks up to the copybin container.
	// * IE tends to copy only the copybin, without its container.
	// * We use spans on IE and blockless editors, but divs in other cases.
	var pasteReplaceRegex = new RegExp(
		'^' +
		'(?:<(?:div|span)(?: data-cke-temp="1")?(?: id="cke_copybin")?(?: data-cke-temp="1")?>)?' +
			'(?:<(?:div|span)(?: style="[^"]+")?>)?' +
				'<span [^>]*data-cke-copybin-start="1"[^>]*>.?</span>([\\s\\S]+)<span [^>]*data-cke-copybin-end="1"[^>]*>.?</span>' +
			'(?:</(?:div|span)>)?' +
		'(?:</(?:div|span)>)?' +
		'$'
	);

	function pasteReplaceFn( match, wrapperHtml ) {
		// Avoid polluting pasted data with any whitspaces,
		// what's going to break check whether only one widget was pasted.
		return CKEDITOR.tools.trim( wrapperHtml );
	}

	// Set up data processing like:
	// * toHtml/toDataFormat,
	// * pasting handling,
	// * undo/redo handling.
	function setupDataProcessing( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		setupUpcasting( widgetsRepo );
		setupDowncasting( widgetsRepo );

		editor.on( 'contentDomUnload', function() {
			widgetsRepo.destroyAll( true );
		} );

		// Handle pasted single widget.
		editor.on( 'paste', function( evt ) {
			evt.data.dataValue = evt.data.dataValue.replace( pasteReplaceRegex, pasteReplaceFn );
		} );
	}

	function setupDowncasting( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			downcastingSessions = {},
			nestedEditableScope = false;

		// Listen before htmlDP#htmlFilter is applied to cache all widgets, because we'll
		// loose data-cke-* attributes.
		editor.on( 'toDataFormat', function( evt ) {
			// To avoid conflicts between htmlDP#toDF calls done at the same time
			// (e.g. nestedEditable#getData called during downcasting some widget)
			// mark every toDataFormat event chain with the downcasting session id.
			var id = CKEDITOR.tools.getNextNumber(),
				toBeDowncasted = [];
			evt.data.downcastingSessionId = id;
			downcastingSessions[ id ] = toBeDowncasted;

			evt.data.dataValue.forEach( function( element ) {
				var attrs = element.attributes,
					widget, widgetElement;

				// Wrapper.
				// Perform first part of downcasting (cleanup) and cache widgets,
				// because after applying DP's filter all data-cke-* attributes will be gone.
				if ( 'data-cke-widget-id' in attrs ) {
					widget = widgetsRepo.instances[ attrs[ 'data-cke-widget-id' ] ];
					if ( widget ) {
						widgetElement = element.getFirst( isWidgetElement );
						toBeDowncasted.push( {
							wrapper: element,
							element: widgetElement,
							widget: widget
						} );

						// If widget did not have data-cke-widget attribute before upcasting remove it.
						if ( widgetElement.attributes[ 'data-cke-widget-keep-attr' ] != '1' )
							delete widgetElement.attributes[ 'data-widget' ];
					}
				}
				// Nested editable.
				else if ( 'data-cke-widget-editable' in attrs ) {
					delete attrs[ 'contenteditable' ];

					// Replace nested editable's content with its output data.
					var editable = toBeDowncasted[ toBeDowncasted.length - 1 ].widget.editables[ attrs[ 'data-cke-widget-editable' ] ];
					element.setHtml( editable.getData() );

					// Don't check children - there won't be next wrapper or nested editable which we
					// should process in this session.
					return false;
				}
			}, CKEDITOR.NODE_ELEMENT );
		}, null, null, 8 );

		// Listen after dataProcessor.htmlFilter and ACF were applied
		// so wrappers securing widgets' contents are removed after all filtering was done.
		editor.on( 'toDataFormat', function( evt ) {
			// Ignore some unmarked sessions.
			if ( !evt.data.downcastingSessionId )
				return;

			var toBeDowncasted = downcastingSessions[ evt.data.downcastingSessionId ],
				toBe, widget, widgetElement, retElement;

			while ( ( toBe = toBeDowncasted.shift() ) ) {
				widget = toBe.widget;
				widgetElement = toBe.element;
				retElement = widget._.downcastFn && widget._.downcastFn.call( widget, widgetElement );

				// Returned element always defaults to widgetElement.
				if ( !retElement )
					retElement = widgetElement;

				toBe.wrapper.replaceWith( retElement );
			}
		}, null, null, 13 );
	}

	function setupDragAndDrop( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			lineutils = CKEDITOR.plugins.lineutils;

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			// #11123 Firefox needs to listen on document, because otherwise event won't be fired.
			editable.attachListener( editable.isInline() ? editable : editor.document, 'drop', function( evt ) {
				var dataStr = evt.data.$.dataTransfer.getData( 'text' ),
					dataObj,
					sourceWidget;

				if ( !dataStr )
					return;

				try {
					dataObj = JSON.parse( dataStr );
				} catch ( e ) {
					// Do nothing - data couldn't be parsed so it's not a CKEditor's data.
					return;
				}

				if ( dataObj.type != 'cke-widget' )
					return;

				evt.data.preventDefault();

				// Something went wrong... maybe someone is dragging widgets between editors/windows/tabs/browsers/frames.
				if ( dataObj.editor != editor.name || !( sourceWidget = widgetsRepo.instances[ dataObj.id ] ) )
					return;

				// Save the snapshot with the state before moving widget.
				// Focus widget, so when we'll undo the DnD, widget will be focused.
				sourceWidget.focus();
				editor.fire( 'saveSnapshot' );

				// Lock snapshot to group all steps of moving widget from the original place to the new one.
				editor.fire( 'lockSnapshot', { dontUpdate: true } );

				moveSelectionToDropPosition( editor, evt );

				// Hack to prevent cursor loss on Firefox. Without timeout widget is
				// correctly pasted but then cursor is invisible (although it works) and can be restored
				// only by blurring editable.
				if ( CKEDITOR.env.gecko )
					setTimeout( moveWidget, 0, editor, sourceWidget );
				else
					moveWidget( editor, sourceWidget );
			} );

			// Register Lineutils's utilities as properties of repo.
			CKEDITOR.tools.extend( widgetsRepo, {
				finder: new lineutils.finder( editor, {
					lookups: {
						// Element is block but not list item and not in nested editable.
						'default': function( el ) {
							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							while ( el ) {
								if ( isNestedEditable2( el ) )
									return;

								el = el.getParent();
							}

							return CKEDITOR.LINEUTILS_BEFORE | CKEDITOR.LINEUTILS_AFTER;
						}
					}
				} ),
				locator: new lineutils.locator( editor ),
				liner: new lineutils.liner( editor, {
					lineStyle: {
						cursor: 'move !important',
						'border-top-color': '#666'
					},
					tipLeftStyle: {
						'border-left-color': '#666'
					},
					tipRightStyle: {
						'border-right-color': '#666'
					}
				} )
			}, true );
		} );
	}

	// Setup mouse observer which will trigger:
	// * widget focus on widget click,
	// * widget#doubleclick forwarded from editor#doubleclick.
	function setupMouseObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'contentDom', function() {
			var editable = editor.editable(),
				evtRoot = editable.isInline() ? editable : editor.document,
				widget,
				mouseDownOnDragHandler;

			editable.attachListener( evtRoot, 'mousedown', function( evt ) {
				var target = evt.data.getTarget();

				// #10887 Clicking scrollbar in IE8 will invoke event with empty target object.
				if ( !target.type )
					return false;

				widget = widgetsRepo.getByElement( target );
				mouseDownOnDragHandler = 0; // Reset.

				// Widget was clicked, but not editable nested in it.
				if ( widget ) {
					// Ignore mousedown on drag and drop handler if the widget is inline.
					// Block widgets are handled by Lineutils.
					if ( widget.inline && target.type == CKEDITOR.NODE_ELEMENT && target.hasAttribute( 'data-cke-widget-drag-handler' ) ) {
						mouseDownOnDragHandler = 1;
						return;
					}

					if ( !getNestedEditable( widget.wrapper, target ) ) {
						evt.data.preventDefault();
						if ( !CKEDITOR.env.ie )
							widget.focus();
					}
					// Reset widget so mouseup listener is not confused.
					else
						widget = null;
				}
			} );

			// Focus widget on mouseup if mousedown was fired on drag handler.
			// Note: mouseup won't be fired at all if widget was dragged and dropped, so
			// this code will be executed only when drag handler was clicked.
			editable.attachListener( evtRoot, 'mouseup', function() {
				if ( widget && mouseDownOnDragHandler ) {
					mouseDownOnDragHandler = 0;
					widget.focus();
				}
			} );

			// On IE it is not enough to block mousedown. If widget wrapper (element with
			// contenteditable=false attribute) is clicked directly (it is a target),
			// then after mouseup/click IE will select that element.
			// It is not possible to prevent that default action,
			// so we force fake selection after everything happened.
			if ( CKEDITOR.env.ie ) {
				editable.attachListener( evtRoot, 'mouseup', function( evt ) {
					if ( widget ) {
						setTimeout( function() {
							widget.focus();
							widget = null;
						} );
					}
				} );
			}
		} );

		editor.on( 'doubleclick', function( evt ) {
			var widget = widgetsRepo.getByElement( evt.data.element );

			// Not in widget or in nested editable.
			if ( !widget || getNestedEditable( widget.wrapper, evt.data.element ) )
				return;

			return widget.fire( 'doubleclick', { element: evt.data.element } );
		}, null, null, 1 );
	}

	// Setup editor#key observer which will forward it
	// to focused widget.
	function setupKeyboardObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'key', function( evt ) {
			var focused = widgetsRepo.focused,
				widgetHoldingFocusedEditable = widgetsRepo.widgetHoldingFocusedEditable,
				ret;

			if ( focused )
				ret = focused.fire( 'key', { keyCode: evt.data.keyCode } );
			else if ( widgetHoldingFocusedEditable )
				ret = onEditableKey( widgetHoldingFocusedEditable, evt.data.keyCode );

			return ret;
		}, null, null, 1 );
	}

	// Setup copybin on native copy and cut events in order to handle copy and cut commands
	// if user accepted security alert on IEs.
	// Note: when copying or cutting using keystroke, copySingleWidget will be first executed
	// by the keydown listener. Conflict between two calls will be resolved by copy_bin existence check.
	function setupNativeCutAndCopy( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			editable.attachListener( editable, 'copy', eventListener );
			editable.attachListener( editable, 'cut', eventListener );
		} );

		function eventListener( evt ) {
			if ( widgetsRepo.focused )
				copySingleWidget( widgetsRepo.focused, evt.name == 'cut' );
		}
	}

	// Setup selection observer which will trigger:
	// * widget select & focus on selection change,
	// * nested editable focus (related properites and classes) on selection change,
	// * deselecting and blurring all widgets on data,
	// * blurring widget on editor blur.
	function setupSelectionObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'selectionCheck', function() {
			widgetsRepo.fire( 'checkSelection' );
		} );

		widgetsRepo.on( 'checkSelection', widgetsRepo.checkSelection, widgetsRepo );

		editor.on( 'selectionChange', function( evt ) {
			var nestedEditable = getNestedEditable( editor.editable(), evt.data.selection.getStartElement() ),
				newWidget = nestedEditable && widgetsRepo.getByElement( nestedEditable ),
				oldWidget = widgetsRepo.widgetHoldingFocusedEditable;

			if ( oldWidget ) {
				if ( oldWidget !== newWidget || !oldWidget.focusedEditable.equals( nestedEditable ) ) {
					setFocusedEditable( widgetsRepo, oldWidget, null );

					if ( newWidget && nestedEditable )
						setFocusedEditable( widgetsRepo, newWidget, nestedEditable );
				}
			}
			// It may happen that there's no widget even if editable was found -
			// e.g. if selection was automatically set in editable although widget wasn't initialized yet.
			else if ( newWidget && nestedEditable )
				setFocusedEditable( widgetsRepo, newWidget, nestedEditable );
		} );

		// Invalidate old widgets early - immediately on dataReady.
		editor.on( 'dataReady', function( evt ) {
			// Deselect and blur all widgets.
			stateUpdater( widgetsRepo ).commit();
		} );

		editor.on( 'blur', function() {
			var widget;

			if ( ( widget = widgetsRepo.focused ) )
				blurWidget( widgetsRepo, widget );

			if ( ( widget = widgetsRepo.widgetHoldingFocusedEditable ) )
				setFocusedEditable( widgetsRepo, widget, null );
		} );
	}

	function setupUpcasting( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			upcasts = widgetsRepo._.upcasts,
			processedWidgetOnly,
			snapshotLoaded;

		editor.on( 'dataReady', function() {
			// Clean up all widgets loaded from snapshot.
			if ( snapshotLoaded )
				cleanUpAllWidgetElements( widgetsRepo, editor.editable() );
			snapshotLoaded = 0;

			// Some widgets were destroyed on contentDomUnload,
			// some on loadSnapshot, but that does not include
			// e.g. setHtml on inline editor or widgets removed just
			// before setting data.
			widgetsRepo.destroyAll( true );
			widgetsRepo.initOnAll();
		} );

		editor.on( 'afterPaste', function() {
			editor.fire( 'lockSnapshot' );

			// Init is enough (no clean up needed),
			// because inserted widgets were cleaned up by toHtml.
			var newInstances = widgetsRepo.initOnAll();

			// If just a widget was pasted and nothing more focus it.
			if ( processedWidgetOnly && newInstances.length == 1 )
				newInstances[ 0 ].focus();

			editor.fire( 'unlockSnapshot' );
		} );

		// Set flag so dataReady will know that additional
		// cleanup is needed, because snapshot containing widgets was loaded.
		editor.on( 'loadSnapshot', function( evt ) {
			// Primitive but sufficient check which will prevent from executing
			// heavier cleanUpAllWidgetElements if not needed.
			if ( ( /data-cke-widget/ ).test( evt.data ) )
				snapshotLoaded = 1;

			widgetsRepo.destroyAll( true );
		}, null, null, 9 );

		// Listen after ACF (so data are filtered),
		// but before dataProcessor.dataFilter was applied (so we can secure widgets' internals).
		editor.on( 'toHtml', function( evt ) {
			var toBeWrapped = [],
				toBe,
				element;

			evt.data.dataValue.forEach( function( element ) {
				// Wrapper found - find widget element, add it to be
				// cleaned up (unwrapped) and wrapped and stop iterating in this branch.
				if ( 'data-cke-widget-wrapper' in element.attributes ) {
					element = element.getFirst( isWidgetElement );

					if ( element )
						toBeWrapped.push( [ element ] );

					// Do not iterate over descendants.
					return false;
				}
				// Widget element found - add it to be cleaned up (just in case)
				// and wrapped and stop iterating in this branch.
				else if ( 'data-widget' in element.attributes ) {
					toBeWrapped.push( [ element ] );

					// Do not iterate over descendants.
					return false;
				}
				else if ( upcasts.length ) {
					var upcast, upcasted,
						data,
						i = 0,
						l = upcasts.length;

					for ( ; i < l; ++i ) {
						upcast = upcasts[ i ];
						data = {};

						if ( ( upcasted = upcast[ 0 ]( element, data ) ) ) {
							// If upcast function returned element, upcast this one.
							// It can be e.g. a new element wrapping the original one.
							if ( upcasted instanceof CKEDITOR.htmlParser.element )
								element = upcasted;

							// Set initial data attr with data from upcast method.
							element.attributes[ 'data-cke-widget-data' ] = JSON.stringify( data );

							toBeWrapped.push( [ element, upcast[ 1 ] ] );

							// Do not iterate over descendants.
							return false;
						}
					}
				}
			}, CKEDITOR.NODE_ELEMENT );

			// Clean up and wrap all queued elements.
			while ( ( toBe = toBeWrapped.pop() ) ) {
				cleanUpWidgetElement( toBe[ 0 ] );
				widgetsRepo.wrapElement( toBe[ 0 ], toBe[ 1 ] );
			}

			// Used to determine whether only widget was pasted.
			processedWidgetOnly = evt.data.dataValue.children.length == 1 &&
				isWidgetWrapper( evt.data.dataValue.children[ 0 ] );
		}, null, null, 8 );
	}

	// Setup observer which will trigger checkWidgets on:
	// * keyup.
	function setupWidgetsObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			buffer = CKEDITOR.tools.eventsBuffer( widgetsRepo.MIN_WIDGETS_CHECK_INTERVAL, checkWidgets ),
			ignoredKeys = { 16:1,17:1,18:1,37:1,38:1,39:1,40:1,225:1 }; // SHIFT,CTRL,ALT,LEFT,UP,RIGHT,DOWN,RIGHT ALT(FF)

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			// Schedule check on keyup, but not more often than once per MIN_CHECK_DELAY.
			editable.attachListener( editable.isInline() ? editable : editor.document, 'keyup', function( evt ) {
				if ( !( evt.data.getKey() in ignoredKeys ) )
					buffer.input();
			}, null, null, 999 );
		} );

		editor.on( 'contentDomUnload', buffer.reset );

		widgetsRepo.on( 'checkWidgets', widgetsRepo.checkWidgets, widgetsRepo );

		editor.on( 'contentDomInvalidated', checkWidgets );

		function checkWidgets() {
			widgetsRepo.fire( 'checkWidgets' );
		}
	}

	// Helper for coordinating which widgets should be
	// selected/deselected and which one should be focused/blurred.
	function stateUpdater( widgetsRepo ) {
		var currentlySelected = widgetsRepo.selected,
			toBeSelected = [],
			toBeDeselected = currentlySelected.slice( 0 ),
			focused = null;

		return {
			select: function( widget ) {
				if ( CKEDITOR.tools.indexOf( currentlySelected, widget ) < 0 )
					toBeSelected.push( widget );

				var index = CKEDITOR.tools.indexOf( toBeDeselected, widget );
				if ( index >= 0 )
					toBeDeselected.splice( index, 1 );

				return this;
			},

			focus: function( widget ) {
				focused = widget;
				return this;
			},

			commit: function() {
				var focusedChanged = widgetsRepo.focused !== focused,
					widget;

				widgetsRepo.editor.fire( 'lockSnapshot' );

				if ( focusedChanged && ( widget = widgetsRepo.focused ) ) {
					blurWidget( widgetsRepo, widget );
				}

				while ( ( widget = toBeDeselected.pop() ) ) {
					currentlySelected.splice( CKEDITOR.tools.indexOf( currentlySelected, widget ), 1 );
					// Widget could be destroyed in the meantime - e.g. data could be set.
					if ( widget.isInited() )
						widget.setSelected( false );
				}

				if ( focusedChanged && focused ) {
					widgetsRepo.focused = focused;
					widgetsRepo.fire( 'widgetFocused', { widget: focused } );
					focused.setFocused( true );
				}

				while ( ( widget = toBeSelected.pop() ) ) {
					currentlySelected.push( widget );
					widget.setSelected( true );
				}

				widgetsRepo.editor.fire( 'unlockSnapshot' );
			}
		};
	}


	//
	// WIDGET helpers ---------------------------------------------------------
	//

	var transparentImageData = 'data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D',
		// LEFT, RIGHT, UP, DOWN, DEL, BACKSPACE - unblock default fake sel handlers.
		keystrokesNotBlockedByWidget = { 37:1,38:1,39:1,40:1,8:1,46:1 };

	function cancel( evt ) {
		evt.cancel();
	}

	function copySingleWidget( widget, isCut ) {
		var editor = widget.editor,
			doc = editor.document;

		// We're still handling previous copy/cut.
		// When keystroke is used to copy/cut this will also prevent
		// conflict with copySingleWidget called again for native copy/cut event.
		if ( doc.getById( 'cke_copybin' ) )
			return;

			// [IE] Use span for copybin and its container to avoid bug with expanding editable height by
			// absolutely positioned element.
		var copybinName = ( editor.blockless || CKEDITOR.env.ie ) ? 'span' : 'div',
			copybin = doc.createElement( copybinName ),
			copybinContainer = doc.createElement( copybinName ),
			// IE8 always jumps to the end of document.
			needsScrollHack = CKEDITOR.env.ie && CKEDITOR.env.version < 9;

		copybinContainer.setAttributes( {
			id: 'cke_copybin',
			'data-cke-temp': '1'
		} );

		// Position copybin element outside current viewport.
		copybin.setStyles( {
			position: 'absolute',
			width: '1px',
			height: '1px',
			overflow: 'hidden'
		} );

		copybin.setStyle( editor.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-5000px' );

		copybin.setHtml( '<span data-cke-copybin-start="1">\u200b</span>' + widget.wrapper.getOuterHtml() + '<span data-cke-copybin-end="1">\u200b</span>' );

		// Save snapshot with the current state.
		editor.fire( 'saveSnapshot' );

		// Ignore copybin.
		editor.fire( 'lockSnapshot' );

		copybinContainer.append( copybin );
		editor.editable().append( copybinContainer );

		var listener1 = editor.on( 'selectionChange', cancel, null, null, 0 ),
			listener2 = widget.repository.on( 'checkSelection', cancel, null, null, 0 );

		if ( needsScrollHack ) {
			var docElement = doc.getDocumentElement().$,
				scrollTop = docElement.scrollTop;
		}

		// Once the clone of the widget is inside of copybin, select
		// the entire contents. This selection will be copied by the
		// native browser's clipboard system.
		var range = editor.createRange();
		range.selectNodeContents( copybin );
		range.select();

		if ( needsScrollHack )
			docElement.scrollTop = scrollTop;

		setTimeout( function() {
			// [IE] Focus widget before removing copybin to avoid scroll jump.
			if ( !isCut )
				widget.focus();

			copybinContainer.remove();

			listener1.removeListener();
			listener2.removeListener();

			editor.fire( 'unlockSnapshot' );

			if ( isCut ) {
				widget.repository.del( widget );
				editor.fire( 'saveSnapshot' );
			}
		}, 100 ); // Use 100ms, so Chrome (@Mac) will be able to grab the content.
	}

	// [IE] Force keeping focus because IE sometimes forgets to fire focus on main editable
	// when blurring nested editable.
	// @context widget
	function onEditableBlur() {
		var active = CKEDITOR.document.getActive(),
			editor = this.editor,
			editable = editor.editable();

		// If focus stays within editor override blur and set currentActive because it should be
		// automatically changed to editable on editable#focus but it is not fired.
		if ( ( editable.isInline() ? editable : editor.document.getWindow().getFrame() ).equals( active ) )
			editor.focusManager.focus( editable );
	}

	// Force selectionChange when editable was focused.
	// Similar to hack in selection.js#~620.
	// @context widget
	function onEditableFocus() {
		// Gecko does not support 'DOMFocusIn' event on which we unlock selection
		// in selection.js to prevent selection locking when entering nested editables.
		if ( CKEDITOR.env.gecko )
			this.editor.unlockSelection();

		// We don't need to force selectionCheck on Webkit, because on Webkit
		// we do that on DOMFocusIn in selection.js.
		if ( !CKEDITOR.env.webkit ) {
			this.editor.forceNextSelectionCheck();
			this.editor.selectionChange( 1 );
		}
	}

	// Position drag handler according to the widget's element position.
	function positionDragHandler( widget ) {
		var handler = widget.dragHandlerContainer;

		handler.setStyle( 'top', widget.element.$.offsetTop - DRAG_HANDLER_SIZE + 'px' );
		handler.setStyle( 'left', widget.element.$.offsetLeft + 'px' );
	}

	function setupDragHandler( widget ) {
		if ( !widget.draggable )
			return;

		var editor = widget.editor,
			editable = editor.editable(),
			img = new CKEDITOR.dom.element( 'img', editor.document ),
			container = new CKEDITOR.dom.element( 'span', editor.document );

		container.setAttributes( {
			'class': 'cke_reset cke_widget_drag_handler_container',
			// Split background and background-image for IE8 which will break on rgba().
			style: 'background:rgba(220,220,220,0.5);background-image:url(' + editor.plugins.widget.path + 'images/handle.png)'
		} );

		img.setAttributes( {
			'class': 'cke_reset cke_widget_drag_handler',
			'data-cke-widget-drag-handler': '1',
			src: transparentImageData,
			width: DRAG_HANDLER_SIZE,
			title: editor.lang.widget.move,
			height: DRAG_HANDLER_SIZE
		} );

		if ( widget.inline ) {
			img.setAttribute( 'draggable', 'true' );
			img.on( 'dragstart', function( evt ) {
				evt.data.$.dataTransfer.setData( 'text', JSON.stringify( { type: 'cke-widget', editor: editor.name, id: widget.id } ) );
			} );
		} else
			img.on( 'mousedown', onBlockWidgetDrag, widget );

		container.append( img );
		widget.wrapper.append( container );
		widget.dragHandlerContainer = container;
	}

	function onBlockWidgetDrag() {
		var finder = this.repository.finder,
			locator = this.repository.locator,
			liner = this.repository.liner,
			editor = this.editor,
			editable = editor.editable(),
			listeners = [],
			sorted = [],

			// Harvest all possible relations and display some closest.
			relations = finder.greedySearch(),

			buffer = CKEDITOR.tools.eventsBuffer( 50, function() {
				locations = locator.locate( relations );

				// There's only a single line displayed for D&D.
				sorted = locator.sort( y, 1 );

				if ( sorted.length ) {
					liner.prepare( relations, locations );
					liner.placeLine( sorted[ 0 ] );
					liner.cleanup();
				}
			} ),

			locations, y;

		// Let's have the "dragging cursor" over entire editable.
		editable.addClass( 'cke_widget_dragging' );

		// Cache mouse position so it is re-used in events buffer.
		listeners.push( editable.on( 'mousemove', function( evt ) {
			y = evt.data.$.clientY;
			buffer.input();
		} ) );

		function onMouseUp() {
			var l;

			buffer.reset();

			// Stop observing events.
			while ( ( l = listeners.pop() ) )
				l.removeListener();

			onBlockWidgetDrop.call( this, sorted );
		}

		// Mouseup means "drop". This is when the widget is being detached
		// from DOM and placed at range determined by the line (location).
		listeners.push( editor.document.once( 'mouseup', onMouseUp, this ) );

		// Mouseup may occur when user hovers the line, which belongs to
		// the outer document. This is, of course, a valid listener too.
		listeners.push( CKEDITOR.document.once( 'mouseup', onMouseUp, this ) );
	}

	function onBlockWidgetDrop( sorted ) {
		var finder = this.repository.finder,
			liner = this.repository.liner,
			editor = this.editor,
			editable = this.editor.editable();

		if ( !CKEDITOR.tools.isEmpty( liner.visible ) ) {
			// Retrieve range for the closest location.
			var range = finder.getRange( sorted[ 0 ] );

			// Focus widget (it could lost focus after mousedown+mouseup)
			// and save this state as the one where we want to be taken back when undoing.
			this.focus();
			editor.fire( 'saveSnapshot' );
			// Group all following operations in one snapshot.
			editor.fire( 'lockSnapshot', { dontUpdate: 1 } );

			// Reset the fake selection, which will be invalidated by insertElementIntoRange.
			// This avoids a situation when getSelection() still returns a fake selection made
			// on widget which in the meantime has been moved to other place. That could cause
			// an error thrown e.g. by saveSnapshot or stateUpdater.
			editor.getSelection().reset();

			// Attach widget at the place determined by range.
			editable.insertElementIntoRange( this.wrapper, range );

			// Focus again the dropped widget.
			this.focus();

			// Unlock snapshot and save new one, which will contain all changes done
			// in this method.
			editor.fire( 'unlockSnapshot' );
			editor.fire( 'saveSnapshot' );
		}

		// Clean-up custom cursor for editable.
		editable.removeClass( 'cke_widget_dragging' );

		// Clean-up all remaining lines.
		liner.hideVisible();
	}

	function setupEditables( widget ) {
		var editableName,
			editableDef,
			definedEditables = widget.editables;

		widget.editables = {};

		if ( !widget.editables )
			return;

		for ( editableName in definedEditables ) {
			editableDef = definedEditables[ editableName ];
			widget.initEditable( editableName, typeof editableDef == 'string' ? { selector: editableDef } : editableDef );
		}
	}

	function setupMask( widget ) {
		if ( !widget.mask )
			return;

		var img = new CKEDITOR.dom.element( 'img', widget.editor.document );
		img.setAttributes( {
			src: transparentImageData,
			'class': 'cke_reset cke_widget_mask'
		} );
		widget.wrapper.append( img );
		widget.mask = img;
	}

	// Replace parts object containing:
	// partName => selector pairs
	// with:
	// partName => element pairs
	function setupParts( widget ) {
		if ( widget.parts ) {
			var parts = {},
				el, partName;

			for ( partName in widget.parts ) {
				el = widget.wrapper.findOne( widget.parts[ partName ] );
				parts[ partName ] = el;
			}
			widget.parts = parts;
		}
	}

	function setupWidget( widget, widgetDef ) {
		setupWrapper( widget );
		setupParts( widget );
		setupEditables( widget );
		setupMask( widget );
		setupDragHandler( widget );

		// #11145: [IE8] Non-editable content of widget is draggable.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			widget.wrapper.on( 'dragstart', function( evt ) {
				// Allow text dragging inside nested editables.
				if ( !getNestedEditable( widget, evt.data.getTarget() ) )
					evt.data.preventDefault();
			} );
		}

		widget.wrapper.removeClass( 'cke_widget_new' );
		widget.element.addClass( 'cke_widget_element' );

		widget.on( 'key', function( evt ) {
			var keyCode = evt.data.keyCode;

			// ENTER.
			if ( keyCode == 13 )
				widget.edit();
			// CTRL+C or CTRL+X.
			else if ( keyCode == CKEDITOR.CTRL + 67 || keyCode == CKEDITOR.CTRL + 88 ) {
				copySingleWidget( widget, keyCode == CKEDITOR.CTRL + 88 );
				return; // Do not preventDefault.
			}
			// Pass chosen keystrokes to other plugins or default fake sel handlers.
			// Pass all CTRL/ALT keystrokes.
			else if ( keyCode in keystrokesNotBlockedByWidget || ( CKEDITOR.CTRL & keyCode ) || ( CKEDITOR.ALT & keyCode ) )
				return;

			return false;
		}, null, null, 999 );
		// Listen with high priority so it's possible
		// to overwrite this callback.

		widget.on( 'doubleclick', function( evt ) {
			widget.edit();
			evt.cancel();
		} );

		if ( widgetDef.data )
			widget.on( 'data', widgetDef.data );

		if ( widgetDef.edit )
			widget.on( 'edit', widgetDef.edit );

		if ( widget.draggable ) {
			widget.on( 'data', function() {
				positionDragHandler( widget );
			}, null, null, 999 );
		}
	}

	function setupWidgetData( widget, startupData ) {
		var widgetDataAttr = widget.element.data( 'cke-widget-data' );

		if ( widgetDataAttr )
			widget.setData( JSON.parse( widgetDataAttr ) );
		if ( startupData )
			widget.setData( startupData );

		// Unblock data and...
		widget.dataReady = true;

		// Write data to element because this was blocked when data wasn't ready.
		writeDataToElement( widget );

		// Fire data event first time, because this was blocked when data wasn't ready.
		widget.fire( 'data', widget.data );
	}

	function setupWrapper( widget ) {
		// Retrieve widget wrapper. Assign an id to it.
		var wrapper = widget.wrapper = widget.element.getParent();
		wrapper.setAttribute( 'data-cke-widget-id', widget.id );
	}

	function writeDataToElement( widget ) {
		widget.element.data( 'cke-widget-data', JSON.stringify( widget.data ) );
	}

	//
	// EXPOSE PUBLIC API ------------------------------------------------------
	//

	CKEDITOR.plugins.widget = Widget;
	Widget.repository = Repository;
	Widget.nestedEditable = NestedEditable;
})();

/**
 * An event fired when a widget definition is registered by the {@link CKEDITOR.plugins.widget.repository#add} method.
 * It is possible to modify the definition being registered.
 *
 * @event widgetDefinition
 * @member CKEDITOR.editor
 * @param {CKEDITOR.plugins.widget.definition} data Widget definition.
 */

/**
 * This is an abstract class that describes the definition of a widget.
 * It is a type of {@link CKEDITOR.plugins.widget.repository#add} method's second argument.
 *
 * Widget instances inherit from registered widget definitions, although not in a prototypal way.
 * They are simply extended with corresponding widget definitions. Note that not all properties of
 * the widget definition become properties of a widget. Some, like {@link #data} or {@link #edit}, become
 * widget's events listeners.
 *
 * @class CKEDITOR.plugins.widget.definition
 * @abstract
 * @mixins CKEDITOR.feature
 */

/**
 * Widget definition name. It is automatically set when the definition is
 * {@link CKEDITOR.plugins.widget.repository#add registered}.
 *
 * @property {String} name
 */

/**
 * The method executed while initializing a widget, after a widget instance
 * is created, but before it is ready. It is executed before the first
 * {@link CKEDITOR.plugins.widget#event-data} is fired so it is common to
 * use the `init` method to populate widget data with information loaded from
 * the DOM, like for exmaple:
 *
 *		init: function() {
 *			this.setData( 'width', this.element.getStyle( 'width' ) );
 *
 *			if ( this.parts.caption.getStyle( 'display' ) != 'none' )
 *				this.setData( 'showCaption', true );
 *		}
 *
 * @property {Function} init
 */

/**
 * The function to be used to upcast an element to this widget or a
 * comma-separated list of upcast methods from the {@link #upcasts} object.
 *
 * The upcast function **is not** executed in the widget context (because the widget
 * does not exist yet) and two arguments are passed:
 *
 * * `element` ({@link CKEDITOR.htmlParser.element}) &ndash; The element to be checked.
 * * `data` (`Object`) &ndash; The object which can be extended with data which will then be passed to the widget.
 *
 * An element will be upcasted if a function returned `true` or an instance of
 * a {@link CKEDITOR.htmlParser.element} if upcasting meant DOM structure changes
 * (in this case the widget will be initialized on the returned element).
 *
 * @property {String/Function} upcast
 */

/**
 * The object containing functions which can be used to upcast this widget.
 * Only those pointed by the {@link #upcast} property will be used.
 *
 * In most cases it is appropriate to use {@link #upcast} directly,
 * because majority of widgets need just one method.
 * However, in some cases the widget author may want to expose more than one variant
 * and then this property may be used.
 *
 *		upcasts: {
 *			// This function may upcast only figure elements.
 *			figure: function() {
 *				// ...
 *			},
 *			// This function may upcast only image elements.
 *			image: function() {
 *				// ...
 *			},
 *			// More variants...
 *		}
 *
 *		// Then, widget user may choose which upcast methods will be enabled.
 *		editor.on( 'widgetDefinition', function( evt ) {
 *			if ( evt.data.name == 'image' )
 * 				evt.data.upcast = 'figure,image'; // Use both methods.
 *		} );
 *
 * @property {Object} upcasts
 */

/**
 * The function to be used to downcast this widget or
 * a name of the downcast option from the {@link #downcasts} object.
 *
 * The downcast funciton will be executed in the {@link CKEDITOR.plugins.widget} context
 * and with `widgetElement` ({@link CKEDITOR.htmlParser.element}) argument which is
 * the widget's main element.
 *
 * The function may return an instance of the {@link CKEDITOR.htmlParser.node} class if the widget
 * needs to be downcasted to a different node than the widget's main element.
 *
 * @property {String/Function} downcast
 */

/**
 * The object containing functions which can be used to downcast this widget.
 * Only the one pointed by the {@link #downcast} property will be used.
 *
 * In most cases it is appropriate to use {@link #downcast} directly,
 * because majority of widgets have just one variant of downcasting (or none at all).
 * However, in some cases the widget author may want to expose more than one variant
 * and then this property may be used.
 *
 *		downcasts: {
 *			// This downcast may transform the widget into the figure element.
 *			figure: function() {
 *				// ...
 *			},
 *			// This downcast may transform the widget into the image element with data-* attributes.
 *			image: function() {
 *				// ...
 *			}
 *		}
 *
 *		// Then, the widget user may choose one of the downcast options when setting up his editor.
 *		editor.on( 'widgetDefinition', function( evt ) {
 *			if ( evt.data.name == 'image' )
 * 				evt.data.downcast = 'figure';
 *		} );
 *
 * @property downcasts
 */

/**
 * If set, it will be added as the {@link CKEDITOR.plugins.widget#event-edit} event listener.
 * This means that it will be executed when a widget is being edited.
 * See the {@link CKEDITOR.plugins.widget#method-edit} method.
 *
 * @property {Function} edit
 */

/**
 * If set, it will be added as the {@link CKEDITOR.plugins.widget#event-data} event listener.
 * This means that it will be executed every time the {@link CKEDITOR.plugins.widget#property-data widget data} changes.
 *
 * @property {Function} data
 */

/**
 * The method to be executed when the widget's command is executed in order to insert a new widget
 * (widget of this type is not focused). If not defined, then the default action will be
 * performed which means that:
 *
 * * An instance of the widget will be created in a detached {@link CKEDITOR.dom.documentFragment document fragment},
 * * The {@link CKEDITOR.plugins.widget#method-edit} method will be called to trigger widget editing,
 * * The widget element will be inserted into DOM.
 *
 * @property {Function} insert
 */

/**
 * The name of a dialog window which will be opened on {@link CKEDITOR.plugins.widget#method-edit}.
 * If not defined, then the {@link CKEDITOR.plugins.widget#method-edit} method will not perform any action and
 * widget's command will insert a new widget without opening a dialog window first.
 *
 * @property {String} dialog
 */

/**
 * The template which will be used to create a new widget element (when the widget's command is executed).
 * This string is populated with {@link #defaults default values} by using the {@link CKEDITOR.template} format.
 * Therefore it has to be a valid {@link CKEDITOR.template} argument.
 *
 * @property {String} template
 */

/**
 * The data object which will be used to populate the data of a newly created widget.
 * See {@link CKEDITOR.plugins.widget#property-data}.
 *
 *		defaults: {
 *			showCaption: true,
 *			align: 'none'
 *		}
 *
 * @property defaults
 */

/**
 * An object containing definitions of widget components (part name => CSS selector).
 *
 *		parts: {
 *			image: 'img',
 *			caption: 'div.caption'
 *		}
 *
 * @property parts
 */

/**
 * An object containing definitions of nested editables (editable name => {@link CKEDITOR.plugins.widget.nestedEditable.definition}).
 *
 *		editables: {
 *			header: 'h1',
 *			content: {
 *				selector: 'div.content',
 *				allowedContent: 'p strong em; a[!href]'
 *			}
 *		}
 *
 * @property editables
 */

/**
 * Widget name displayed in elements path.
 *
 * @property {String} pathName
 */

/**
 * If set to `true`, the widget's element will be covered with a transparent mask.
 * This will prevent its content from being clickable, which matters in case
 * of special elements like embedded Flash or iframes that generate a separate "context".
 *
 * @property {Boolean} mask
 */

/**
 * If set to `true/false`, it will force the widget to be either an inline or a block widget.
 * If not set, the widget type will be determined from the widget element.
 *
 * Widget type influences whether a block (`div`) or an inline (`span`) element is used
 * for the wrapper.
 *
 * @property {Boolean} inline
 */

/**
 * The label for the widget toolbar button.
 *
 *		editor.widgets.add( 'simplebox', {
 *			button: 'Create a simple box'
 *		} );
 *
 *		editor.widgets.add( 'simplebox', {
 *			button: editor.lang.simplebox.title
 *		} );
 *
 * @property {String} button
 */

/**
 * Whether widget should be draggable. Defaults to `true`.
 * If set to `false` drag handler will not be displayed when hovering widget.
 *
 * @property {Boolean} draggable
 */

/**
 * This is an abstract class that describes the definition of a widget's nested editable.
 * It is a type of values in the {@link CKEDITOR.plugins.widget.definition#editables} object.
 *
 * In the simplest case the definition is a string which is a CSS selector used to
 * find an element that will become a nested editable inside the widget. Note that
 * the widget element can be a nested editable, too.
 *
 * In the more advanced case a definition is an object with a required `selector` property.
 *
 *		editables: {
 *			header: 'h1',
 *			content: {
 *				selector: 'div.content',
 *				allowedContent: 'p strong em; a[!href]'
 *			}
 *		}
 *
 * @class CKEDITOR.plugins.widget.nestedEditable.definition
 * @abstract
 */

/**
 * The CSS selector used to find an element which will become a nested editable.
 *
 * @property {String} selector
 */

/**
 * The [Advanced Content Filter](#!/guide/dev_advanced_content_filter) rules
 * which will be used to limit the content allowed in this nested editable.
 * This option is similar to {@link CKEDITOR.config#allowedContent} and one can
 * use it to limit the editor features available in the nested editable.
 *
 * @property {CKEDITOR.filter.allowedContentRules} allowedContent
 */

/**
 * Nested editable name displayed in elements path.
 *
 * @property {String} pathName
 */