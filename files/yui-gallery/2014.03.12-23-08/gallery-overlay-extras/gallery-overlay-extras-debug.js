YUI.add('gallery-overlay-extras', function(Y) {

	/*!
	 * Overlay Extras
	 * 
	 * Oddnut Software
	 * Copyright (c) 2009-2011 Eric Ferraiuolo - http://oddnut.com
	 * YUI BSD License - http://developer.yahoo.com/yui/license.html
	 */
 
	var OVERLAY			= 'overlay',
		HOST			= 'host',
		RENDER_UI		= 'renderUI',
		BIND_UI			= 'bindUI',
		SYNC_UI			= 'syncUI',
		RENDERED		= 'rendered',
		BOUNDING_BOX	= 'boundingBox',
		VISIBLE			= 'visible',
		Z_INDEX			= 'zIndex',
		ALIGN			= 'align',
		
		CHANGE			= 'Change',
		
		isBoolean		= Y.Lang.isBoolean,
		getCN			= Y.ClassNameManager.getClassName,
		
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
		}()),
		
		OverlayModal, OverlayKeepaligned, OverlayAutohide, OverlayPointer;
		
	// *** OverlayModal *** //
	
	(function(){
		
		var OVERLAY_MODAL	= 'overlayModal',
			MODAL			= 'modal',
			MASK			= 'mask',
			MODAL_CLASSES	= {
				modal	: getCN(OVERLAY, MODAL),
				mask	: getCN(OVERLAY, MASK)
			};
			
		OverlayModal = Y.Base.create(OVERLAY_MODAL, Y.Plugin.Base, [], {
			
			// *** Instance Members *** //
			
			_maskNode	: null,
			_uiHandles	: null,
			
			// *** Lifecycle Methods *** //
			
			initializer : function (config) {
				
				this.afterHostMethod(RENDER_UI, this.renderUI);
				this.afterHostMethod(BIND_UI, this.bindUI);
				this.afterHostMethod(SYNC_UI, this.syncUI);
				
				if (this.get(HOST).get(RENDERED)) {
					this.renderUI();
					this.bindUI();
					this.syncUI();
				}
			},
			
			destructor : function () {
				
				if (this._maskNode) {
					this._maskNode.remove(true);
				}
				
				this._detachUIHandles();
				this.get(HOST).get(BOUNDING_BOX).removeClass(MODAL_CLASSES.modal);
			},
			
			renderUI : function () {
				
				var bb = this.get(HOST).get(BOUNDING_BOX),
					bbParent = bb.get('parentNode') || Y.one('body');
				
				this._maskNode = Y.Node.create('<div></div>');
				this._maskNode.addClass(MODAL_CLASSES.mask);
				this._maskNode.setStyles({
					position	: supportsPosFixed ? 'fixed' : 'absolute',
					width		: '100%',
					height		: '100%',
					top			: '0',
					left		: '0',
					display		: 'none'
				});
				
				bbParent.insert(this._maskNode, bbParent.get('firstChild'));
				bb.addClass(MODAL_CLASSES.modal);
			},
			
			bindUI : function () {
				
				this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
				this.afterHostEvent(Z_INDEX+CHANGE, this._afterHostZIndexChange);
			},
			
			syncUI : function () {
				
				var host = this.get(HOST);
				
				this._uiSetHostVisible(host.get(VISIBLE));
				this._uiSetHostZIndex(host.get(Z_INDEX));
			},
			
			// *** Private Methods *** //
			
			_focus : function () {
				
				var host = this.get(HOST),
					bb = host.get(BOUNDING_BOX),
					oldTI = bb.get('tabIndex');
					
				bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);
				host.focus();
				bb.set('tabIndex', oldTI);
			},
			
			_blur : function () {
				
				this.get(HOST).blur();
			},
			
			_getMaskNode : function () {
				
				return this._maskNode;
			},
			
			_uiSetHostVisible : function (visible) {
				
				if (visible) {
					Y.later(1, this, '_attachUIHandles');
					this._maskNode.setStyle('display', 'block');
					this._focus();
				} else {
					this._detachUIHandles();
					this._maskNode.setStyle('display', 'none');
					this._blur();
				}
			},
			
			_uiSetHostZIndex : function (zIndex) {
				
				this._maskNode.setStyle(Z_INDEX, zIndex || 0);
			},
			
			_attachUIHandles : function (modal) {
			
				if (this._uiHandles) { return; }
				
				var host = this.get(HOST),
					bb = host.get(BOUNDING_BOX);
				
				this._uiHandles = [
					bb.on('clickoutside', Y.bind(this._focus, this)),
					bb.on('focusoutside', Y.bind(this._focus, this))
				];
				
				if ( ! supportsPosFixed) {
					this._uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
						var maskNode = this._maskNode;
						maskNode.setStyle('top', maskNode.get('docScrollY'));
					}, this)));
				}
			},
			
			_detachUIHandles : function () {
				
				Y.each(this._uiHandles, function(h){
					h.detach();
				});
				this._uiHandles = null;
			},
			
			_afterHostVisibleChange : function (e) {
				
				this._uiSetHostVisible(e.newVal);
			},
			
			_afterHostZIndexChange : function (e) {
				
				this._uiSetHostZIndex(e.newVal);
			}
			
		}, {
			
			// *** Static *** //
			
			NS		: MODAL,
			
			ATTRS	: {
				
				maskNode : {
					getter		: '_getMaskNode',
					readOnly	: true
				}
				
			},
			
			CLASSES	: MODAL_CLASSES
			
		});
		
	}());
	
	// *** OverlayKeepaligned *** //
	
	(function(){
		
		var OVERLAY_KEEPALIGNED	= 'overlayKeepaligned',
			KEEPALIGNED			= 'keepaligned';
		
		OverlayKeepaligned = Y.Base.create(OVERLAY_KEEPALIGNED, Y.Plugin.Base, [], {
			
			// *** Instance Members *** //
			
			_uiHandles : null,
			
			// *** Lifecycle Methods *** //
			
			initializer : function (config) {
				
				this.afterHostMethod(BIND_UI, this.bindUI);
				this.afterHostMethod(SYNC_UI, this.syncUI);
				
				if (this.get(HOST).get(RENDERED)) {
					this.bindUI();
					this.syncUI();
				}
			},
			
			destructor : function () {
				
				this._detachUIHandles();
			},
			
			bindUI : function () {
				
				this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
			},
			
			syncUI : function () {
				
				this._uiSetHostVisible(this.get(HOST).get(VISIBLE));
			},
			
			// *** Public Methods *** //
			
			syncAlign : function () {
				
				this.get(HOST)._syncUIPosAlign();
			},
			
			// *** Private Methods *** //
			
			_uiSetHostVisible : function (visible) {
				
				if (visible) {
					this._attachUIHandles();
				} else {
					this._detachUIHandles();
				}
			},
			
			_attachUIHandles : function () {
				
				if (this._uiHandles) { return; }
				
				var syncAlign = Y.bind(this.syncAlign, this);
					
				this._uiHandles = [
					Y.on('windowresize', syncAlign),
					Y.on('scroll', syncAlign)
				];
			},
			
			_detachUIHandles : function () {
				
				Y.each(this._uiHandles, function(h){
					h.detach();
				});
				this._uiHandles = null;
			},
			
			_afterHostVisibleChange : function (e) {
				
				this._uiSetHostVisible(e.newVal);
			}
			
		}, {
			
			// *** Static *** //
			
			NS : KEEPALIGNED
			
		});
		
	}());
	
	// *** OverlayAutohide *** //
	
	(function(){
		
		var OVERLAY_AUTOHIDE	= 'overlayAutohide',
			AUTOHIDE			= 'autohide',
			CLICKED_OUTSIDE		= 'clickedOutside',
			FOCUSED_OUTSIDE		= 'focusedOutside',
			PRESSED_ESCAPE		= 'pressedEscape';
		
		OverlayAutohide = Y.Base.create(OVERLAY_AUTOHIDE, Y.Plugin.Base, [], {
			
			// *** Instance Members *** //
			
			_uiHandles : null,
			
			// *** Lifecycle Methods *** //
			
			initializer : function (config) {
				
				this.afterHostMethod(BIND_UI, this.bindUI);
				this.afterHostMethod(SYNC_UI, this.syncUI);
				
				if (this.get(HOST).get(RENDERED)) {
					this.bindUI();
					this.syncUI();
				}
			},
			
			destructor : function () {
				
				this._detachUIHandles();
			},
			
			bindUI : function () {
				
				this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
			},
			
			syncUI : function () {
				
				this._uiSetHostVisible(this.get(HOST).get(VISIBLE));
			},
			
			// *** Private Methods *** //
			
			_uiSetHostVisible : function (visible) {
				
				if (visible) {
					Y.later(1, this, '_attachUIHandles');
				} else {
					this._detachUIHandles();
				}
			},
			
			_attachUIHandles : function () {
				
				if (this._uiHandles) { return; }
				
				var host = this.get(HOST),
					bb = host.get(BOUNDING_BOX),
					hide = Y.bind(host.hide, host),
					uiHandles = [];
				
				if (this.get(CLICKED_OUTSIDE)) {
					uiHandles.push(bb.on('clickoutside', hide));
				}
				
				if (this.get(FOCUSED_OUTSIDE)) {
					uiHandles.push(bb.on('focusoutside', hide));
				}
				
				if (this.get(PRESSED_ESCAPE)) {
					uiHandles.push(bb.on('key', hide, 'down:27'));
				}
				
				this._uiHandles = uiHandles;
			},
			
			_detachUIHandles : function () {
				
				Y.each(this._uiHandles, function(h){
					h.detach();
				});
				this._uiHandles = null;
			},
			
			_afterHostVisibleChange : function (e) {
				
				this._uiSetHostVisible(e.newVal);
			}
			
		}, {
			
			// *** Static *** //
			
			NS : AUTOHIDE,
			
			ATTRS : {
				
				clickedOutside	: {
					value		: true,
					validator	: isBoolean
				},
				
				focusedOutside	: {
					value		: true,
					validator	: isBoolean
				},
				
				pressedEscape	: {
					value		: true,
					validator	: isBoolean
				}
				
			}
			
		});
		
	}());
	
	// *** OverlayPointer *** //
	
	(function(){
		
		var OVERLAY_POINTER	= 'overlayPointer',
			POINTER			= 'pointer',
			POINTING		= 'pointing',
			POINTER_CLASSES	= {
				pointer		: getCN(OVERLAY, POINTER),
				pointing	: getCN(OVERLAY, POINTING)
			};
			
		OverlayPointer = Y.Base.create(OVERLAY_POINTER, Y.Plugin.Base, [], {
			
			// *** Instance Members *** //
			
			_pointerNode : null,
			
			// *** Lifecycle Methods *** //
			
			initializer : function (config) {
				
				this.afterHostMethod(RENDER_UI, this.renderUI);
				this.afterHostMethod(BIND_UI, this.bindUI);
				this.afterHostMethod(SYNC_UI, this.syncUI);
				
				if (this.get(HOST).get(RENDERED)) {
					this.renderUI();
					this.bindUI();
					this.syncUI();
				}
			},
			
			destructor : function () {
				
				var host		= this.get(HOST),
					bb			= host.get(BOUNDING_BOX),
					align		= host.get(ALIGN),
					pointerNode	= this._pointerNode;
				
				bb.removeClass(POINTER_CLASSES.pointing);
				if (align && align.points) {
					bb.removeClass(getCN(OVERLAY, POINTING, align.points[0]));
				}
				
				if (pointerNode) {
					pointerNode.remove(true);
				}
			},
			
			renderUI : function () {
				
				this._pointerNode = Y.Node.create('<span></span>').addClass(POINTER_CLASSES.pointer);
				this.get(HOST).get(BOUNDING_BOX).append(this._pointerNode);
			},
			
			bindUI : function () {
				
				this.afterHostEvent(ALIGN+CHANGE, this._afterHostAlignChange);
			},
			
			syncUI : function () {
				
				this._uiSetHostAlign(this.get(HOST).get(ALIGN));
			},
			
			// *** Private Methods *** //
			
			_getPointerNode : function () {
				
				return this._pointerNode;
			},
			
			_uiSetHostAlign : function (newAlign, prevAlign) {
				
				var host		= this.get(HOST),
					bb			= host.get(BOUNDING_BOX),
					pointerNode	= this._pointerNode;
				
				if (prevAlign && prevAlign.points) {
					bb.removeClass(getCN(OVERLAY, POINTING, prevAlign.points[0]));
					bb.removeClass(getCN(OVERLAY, POINTING, prevAlign.points[0], prevAlign.points[1]));
				}
				
				// Overlay is aligned to another node (not viewport) on one of it's sides (not centered)
				if (newAlign && newAlign.node && newAlign.points[0] !== Y.WidgetPositionAlign.CC) {
					bb.addClass(POINTER_CLASSES.pointing);
					bb.addClass(getCN(OVERLAY, POINTING, newAlign.points[0]));
					bb.addClass(getCN(OVERLAY, POINTING, newAlign.points[0], newAlign.points[1]));
					pointerNode.show();
				} else {
					pointerNode.hide();
					bb.removeClass(POINTER_CLASSES.pointing);
				}
				
				// sync align because we changed the DOM
				host._syncUIPosAlign();
			},
			
			_afterHostAlignChange : function (e) {
				
				this._uiSetHostAlign(e.newVal, e.prevVal);
			}
			
		}, {
			
			// *** Static *** //
			
			NS		: POINTER,
			
			ATTRS	: {
				
				pointerNode : {
					getter		: '_getPointerNode',
					readOnly	: true
				}
				
			},
			
			CLASSES	: POINTER_CLASSES
			
		});
		
	}());
	
	// *** Attach Plugins *** //
	
	Y.Plugin.OverlayModal		= OverlayModal;
	Y.Plugin.OverlayKeepaligned	= OverlayKeepaligned;
	Y.Plugin.OverlayAutohide	= OverlayAutohide;
	Y.Plugin.OverlayPointer		= OverlayPointer;


}, 'gallery-2011.05.04-20-03' ,{supersedes:['gallery-overlay-modal'], requires:['overlay','plugin','event-resize','gallery-outside-events']});
