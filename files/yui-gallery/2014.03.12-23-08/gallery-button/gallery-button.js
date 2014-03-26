YUI.add('gallery-button', function(Y) {

/**
 *
 * @version 1.3.0
 */

var YL = Y.Lang,
  YCM = Y.ClassNameManager,
  EVENT_PRESS = 'press',
  CLASS_PRESSED  = '-pressed',
  CLASS_DEFAULT  = '-default',
  CLASS_DISABLED = '-disabled',
  CLASS_NO_LABEL = 'no-label',
  BOUNDING_BOX = 'boundingBox',
  CONTENT_BOX = 'contentBox',
  DEFAULT = 'default',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  HREF = 'href',
  TAB_INDEX = 'tabindex',
  ICON = 'icon',
  TITLE = 'title',
  INNER_HTML = 'innerHTML';


Y.Button = Y.Base.create('button',Y.Widget, [Y.WidgetChild], {

  BOUNDING_TEMPLATE : '<a />',

  CONTENT_TEMPLATE : '<span class="yui3-icon"/>',

  _className : '',

  _mouseIsDown : false,

  _mouseListener : null,
  
  _defaultCB : function() {
    return null;
  },
  
  initializer : function(config) {

    this._className = this.getClassName();
    this.publish(EVENT_PRESS, { defaultFn: this._defPressFn });
    this.after('defaultChange',this._afterDefaultChanged, this);
    this.after('enabledChange',this._afterEnabledChanged, this);
  },

  /**
   * Sets content to the content box
   * @method renderUI
   * @public
   * @since 1.0.0
   */
  renderUI : function(){
    var href = this.get(HREF);
    
    this.get(CONTENT_BOX).setContent(this.get('label'));
    
    if(href) {
        this.get(BOUNDING_BOX).setAttribute(HREF, href);
    } else {
        this.get(BOUNDING_BOX).set('tabIndex',0);
    }
  },

  /**
   * Binds internal `press` to default click event and mouse events for
   *   class changes
   * @method bindUI
   * @public
   * @since 1.0.0
   */
  bindUI : function(){
    var bb = this.get(BOUNDING_BOX);

    bb.on('click', this._defClickFn, this);
    bb.on('mouseup', this._mouseUp, this);
    bb.on('mousedown', this._mouseDown, this);
    bb.after('tabindexChange', this._afterTabindexChange, this);
  },
  
  /**
   * Updates default class and sets enabled
   * @method syncUI
   * @public
   * @since 1.0.0
   */
  syncUI : function() {
    this._updateDefault(this.get(DEFAULT));
    this._updateEnabled(this.get(ENABLED));
    this._updateTabindex(this.get(TAB_INDEX));
  },

  /**
   * Makes button diabled
   * @method disable
   * @public
   * @since 1.1.0
   * @chainable
   */
  disable : function() {
    this.set(ENABLED, false);
    return this;
  },

  /**
   * Makes button enabled
   * @method enable
   * @public
   * @since 1.1.0
   * @chainable
   */
  enable : function() {
    this.set(ENABLED, true);
    return this;
  },

  /**
   * Sets the title attribute to the bounding box
   * @method setTitle
   * @param title String
   * @public
   * @since 1.1.0
   * @chainable
   */
  setTitle : function(title) {
    this.get(BOUNDING_BOX).set(TITLE, title);
    return this;
  },


  //  P R O T E C T E D  //

  /**
   *
   */
  _defClickFn : function(e) {
    var href = this.get(HREF);
    
    if (!this.get(ENABLED)) {
        e.preventDefault();
        return;
    }
    
    if(!href || href === '#') {
        e.preventDefault();
    }
    this.fire(EVENT_PRESS, {click : e});
  },
  
  /**
   * Default press callback function
   * @method _defPressFn
   * @param e Event
   * @protected
   * @since 1.2.0
   */
  _defPressFn : function(e) {
    this._executeCallback(e);
  },

  /**
   * Removes the pressed class
   * @method _mouseUp
   * @protected
   * @since 1.0.0
   */
  _mouseUp : function() {
    this.get(BOUNDING_BOX).removeClass(this._className + CLASS_PRESSED);
    this._mouseIsDown = false;
    if(this._mouseListener !== null) {
      this._mouseListener.detach();
      this._mouseListener = null;
    }
  },

  /**
   * Adds the pressed class to bounding box
   * @method _mouseDown
   * @protected
   * @since 1.0.0
   */
  _mouseDown : function() {
    if(this.get(ENABLED)) {
      this.get(BOUNDING_BOX).addClass(this._className + CLASS_PRESSED);
      this._mouseIsDown = true;
      if(this._mouseListener === null) {
        this._mouseListener = Y.on('mouseup',Y.bind(this._listenForMouseUp,this));
      }
    }
  },
  
  /**
   * Callback for drag out mouse event
   * @method _listenForMouseUp
   * @protected
   * @since 1.0.0
   */
  _listenForMouseUp : function() {
    this._mouseUp();
  },

  /**
   * Updates the enabled state
   * @method _afterEnabledChanged
   * @protected
   * @since 1.0.0
   */
  _afterEnabledChanged : function(e) {
    this._updateEnabled(e.newVal);
  },

  /**
   * Adds or removes the disabled attribute to for the button and 
   *   updates disabled class on bounding box
   * @method _updateEnabled
   * @protected
   * @since 1.0.0
   */
  _updateEnabled : function(status) {
    var bb = this.get(BOUNDING_BOX),
        disableClass = this._className + CLASS_DISABLED;

    if(status) {
      bb.removeClass(disableClass);
      bb.removeAttribute(DISABLED);
    }else{
      bb.addClass(disableClass);
      bb.removeClass(this._className + CLASS_PRESSED);
      bb.setAttribute(DISABLED,DISABLED);
    }

  },

  /**
   * Updates the default state
   * @method _afterDefaultChanged
   * @protected
   * @since 1.0.0
   */
  _afterDefaultChanged : function(e) {
    this._updateDefault(e.newVal);
  },

  /**
   * Updates the default class on the bounding box
   * @method _updateDefault
   * @param state boolean
   * @protected
   * @since 1.2.0
   * @return void
   */
  _updateDefault : function(state) {
    var bb = this.get(BOUNDING_BOX),
        defaultClass = this._className + CLASS_DEFAULT;
    if(state) {
      bb.addClass(defaultClass);
      bb.setAttribute(DEFAULT,DEFAULT);
    }else{
      bb.removeClass(defaultClass);
      bb.set(DEFAULT,'');
    }
  },

  /**
   * Used to fire the internal callback
   *
   * @method _executeCallback
   * @protected
   * @since 1.1.0
   */
  _executeCallback : function(e) {
    if(this.get('callback')) {
      (this.get('callback'))(e);
    }else{
        (this._callbackFromType())(e);
    }
  },
  
  /**
   * Sets the icon class for the bounding box
   *
   * @method _iconSetterFn
   * @protected
   * @since 1.3.0
   */
  _iconSetterFn : function(val) {
    this.get(BOUNDING_BOX).replaceClass(
      YCM.getClassName(ICON, this.get(ICON) || DEFAULT),
      YCM.getClassName(ICON, val || DEFAULT)
    );
    return val;
  },
  
  /**
   * Sets the icon class for the bounding box
   *
   * @method _labelSetterFn
   * @protected
   * @since 1.3.0
   */
  _labelSetterFn : function(val) {
    if (!val || val === '') {
      this.get(BOUNDING_BOX).addClass(this.getClassName(CLASS_NO_LABEL));
    } else {
      this.get(BOUNDING_BOX).removeClass(this.getClassName(CLASS_NO_LABEL));
    }
    this.get(CONTENT_BOX).setContent(val);
    this.set(TITLE, val);
    return val;
  },
  
  /**
   * Sets the title to the bounding box
   *
   * @method _titleSetterFn
   * @protected
   * @since 1.3.0
   */
  _titleSetterFn : function(val) {
    this.get(BOUNDING_BOX).set(TITLE, val);
    return val;
  },
  
  /**
   * Returns a function based on the type of button. Form buttons such 
   *   as Submit and Reset are attached to their parent form if one is
   *   found. An empty function is return to prevent execution errors.
   *
   * @method _callbackFromType
   * @protected
   * @return Function
   * @since 1.3.0
   */
  _callbackFromType : function() {
    var bb = this.get(BOUNDING_BOX), 
        frm = bb.ancestor('form');
        
    switch (this.get('type')) {
        case 'submit':
            if (frm) { return Y.bind(frm.submit, frm); }
            break;
        case 'reset':
            if (frm) { return Y.bind(frm.reset, frm); }
            break;
    }
    
    return function(){};
  },
  
  _afterTabindexChange : function(e) {
    this._updateTabindex(e.newVal);
  },
  
  _updateTabindex : function(val) {
    var bb = this.get(BOUNDING_BOX);
    
    if (val !== undefined && val !== null) {
        bb.setAttribute(TAB_INDEX, val);
    } else {
        bb.removeAttribute(TAB_INDEX);
    }
  }
  
}, {
  EVENTS : {
    PRESS : EVENT_PRESS
  },
  ATTRS : {
      label : {
          value : '',
          validator : YL.isString,
          setter : '_labelSetterFn',
          lazyAdd : false
      },
      callback : {
          validator : YL.isFunction
      },
      enabled : {
          value : true,
          validator : YL.isBoolean
      },
      DEFAULT : {
          value : false,
          validator : YL.isBoolean
      },
      icon : {
        value : DEFAULT,
        setter : '_iconSetterFn',
        lazyAdd : false
      },
      href : {
        value : null
      },
      title : {
          validator : YL.isString,
          setter : '_titleSetterFn'
      },
      tabindex : {
          value : 0
      },
      type : {
          value : 'push',
          validator : YL.isString,
          lazyAdd : false
      }
  },
  /**
   * HTML Parser assumes srcNode is either a &lt;button&gt; or 
   *   &lt;input type="submit|reset"&gt;
   * @since 1.2.0
   */
  HTML_PARSER : {
  
    enabled : function(srcNode) {
        return !srcNode.get(DISABLED);
    },
    
    label : function(srcNode) {
      if(srcNode.getAttribute('value')) {
        return srcNode.getAttribute('value');
      }
      if(srcNode.get(INNER_HTML)) {
        return srcNode.get(INNER_HTML);
      }
      
      // default form button labels based on type
      if(srcNode.get('tagName') === 'INPUT') {
        switch (srcNode.get('type')) {
          case 'reset' : return 'Reset';
          case 'submit' : return 'Submit';
        }
      }
      
      return null;
    },
    
    href : function(srcNode) {
        var href = srcNode.getAttribute(HREF);
        
        if(href) { 
            return href; 
        }
        
        return null;
    },
    
    type : function(srcNode) {
        var type = srcNode.getAttribute('type');
        
        if(type) {
            return type;
        }
        return null;
    },
    
    title : function(srcNode) {
      if(srcNode.getAttribute(TITLE)) {
        return srcNode.getAttribute(TITLE);
      }
      if(srcNode.getAttribute('value')) {
        return srcNode.getAttribute('value');
      }
      if(srcNode.get(INNER_HTML)) {
        return srcNode.get(INNER_HTML);
      }
      return null;
    }
  }
});



}, 'gallery-2011.02.02-21-07' ,{requires:['widget','event-mouseenter','widget-child']});
