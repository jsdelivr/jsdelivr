YUI.add('gallery-overlay-modal', function(Y) {

/*!
 * Overlay Modal Plugin
 * 
 * Oddnut Software
 * Copyright (c) 2009-2010 Eric Ferraiuolo - http://eric.ferraiuolo.name
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 */
 
	var OverlayModal,
		OVERLAY_MODAL = 'overlayModal',
		
		HOST = 'host',
		BOUNDING_BOX = 'boundingBox',
		
		OVERLAY = 'overlay',
		MODAL = 'modal',
		MASK = 'mask',
		
		getCN = Y.ClassNameManager.getClassName,
		
		CLASSES = {
			modal	: getCN(OVERLAY, MODAL),
			mask	: getCN(OVERLAY, MASK)
		},
		
		supportsPosFixed = (function(){
			
			/*! IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax) - http://yura.thinkweb2.com/cft/ */
			
			var isSupported = null,
				el, root;
			
			if (document.createElement) {
				el = document.createElement('div');
				if (el && el.style) {
					el.style.position = 'fixed';
					el.style.top = '10px';
					root = document.body;
					if (root && root.appendChild && root.removeChild) {
						root.appendChild(el);
						isSupported = (el.offsetTop === 10);
						root.removeChild(el);
					}
				}
			}
			
			return isSupported;
		}());
		
	// *** Constructor *** //
	
	OverlayModal = function (config) {
		
		OverlayModal.superclass.constructor.apply(this, arguments);
	};
	
	// *** Static *** //
	
	Y.mix(OverlayModal, {
		
		NAME : OVERLAY_MODAL,
		
		NS : MODAL,
		
		CLASSES : CLASSES
		
	});
	
	// *** Prototype *** //
	
	Y.extend(OverlayModal, Y.Plugin.Base, {
		
		// *** Instance Members *** //
		
		_maskNode : null,
		_uiHandles : null,
		
		// *** Lifecycle Methods *** //
		
		initializer : function (config) {
			
			this._uiHandles = {};
			
			this.doAfter('renderUI', this.renderUI);
			this.doAfter('bindUI', this.bindUI);
			this.doAfter('syncUI', this.syncUI);
			
			if (this.get(HOST).get('rendered')) {
				this.renderUI();
				this.bindUI();
				this.syncUI();
			}
		},
		
		destructor : function () {
			
			if (this._maskNode) {
				this._maskNode.remove(true);
			}
			
			this._detachHandles();
			
			this.get(HOST).get(BOUNDING_BOX).removeClass(CLASSES.modal);
		},
		
		renderUI : function () {
			
			var host = this.get(HOST);
			
			this._maskNode = Y.Node.create('<div></div>');
			this._maskNode.addClass(CLASSES.mask);
			this._maskNode.setStyles({
				position	: supportsPosFixed ? 'fixed' : 'absolute',
				zIndex		: host.get('zIndex') || 0,
				width		: '100%',
				height		: '100%',
				top			: '0',
				left		: '0',
				display		: 'none'
			});
			
			Y.one('body').insertBefore(this._maskNode, Y.one('body').get('firstChild'));
			host.get(BOUNDING_BOX).addClass(CLASSES.modal);
		},
		
		bindUI : function () {
			
			this.doAfter('visibleChange', this._afterHostVisibleChange);
		},
		
		syncUI : function () {
			
			this._uiSetHostVisible(this.get(HOST).get('visible'));
		},
		
		// *** Public Methods *** //
		
		// *** Private Methods *** //
		
		_focus : function () {
			
			var host = this.get(HOST),
				bb = host.get(BOUNDING_BOX),
				oldTI = bb.get('tabIndex');
				
			bb.set('tabIndex', 0);
			host.focus();
			bb.set('tabIndex', oldTI);
		},
		
		_blur : function () {
			
			this.get(HOST).blur();
		},
		
		_uiSetHostVisible : function (visible) {
			
			if (visible) {
				this._attachHandles();
				this._maskNode.setStyle('display', 'block');
				this._focus();
			} else {
				this._detachHandles();
				this._maskNode.setStyle('display', 'none');
				this._blur();
			}
		},
		
		_attachHandles : function () {
		
			var uiHandles = this._uiHandles;
			
			if ( ! uiHandles.focus) {
				uiHandles.focus = Y.one(document).on('focus', Y.bind(function(e){
					if ( ! this.get(HOST).get(BOUNDING_BOX).contains(e.target)) {
						this._focus();
					}
				}, this));
			}
			
			if ( ! uiHandles.click) {
				var bb = this.get(HOST).get(BOUNDING_BOX);
				uiHandles.click = this._maskNode.on('click', Y.bind(bb.scrollIntoView, bb, false));
			}
			
			if ( ! supportsPosFixed && ! uiHandles.scroll) {
				uiHandles.scroll = Y.one(window).on('scroll', Y.bind(function(e){
					this._maskNode.setStyle('top', this._maskNode.get('docScrollY'));
				}, this));
			}
		},
		
		_detachHandles : function () {
			
			var uiHandles = this._uiHandles;
			
			Y.Object.each(uiHandles, function(h, key){
				h.detach();
				delete uiHandles[key];
			});
		},
		
		_afterHostVisibleChange : function (e) {
			
			this._uiSetHostVisible(e.newVal);
		}
		
	});
	
	Y.namespace('Plugin').OverlayModal = OverlayModal;


}, 'gallery-2010.05.21-18-16' ,{requires:['overlay', 'plugin', 'event-focus']});
