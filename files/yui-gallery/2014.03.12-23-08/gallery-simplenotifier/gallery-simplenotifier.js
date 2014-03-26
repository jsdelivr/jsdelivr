YUI.add('gallery-simplenotifier', function(Y) {



   
    /* Notifier class constructor */
    function SimpleNotifier(config) {
        SimpleNotifier.superclass.constructor.apply(this, arguments);
    }

    SimpleNotifier.NAME = "SimpleNotifier";

    SimpleNotifier.ATTRS = {

         message : {
            value: ""
         },
         
         header : {
        	 value: ""
         },
        
         position: {
        	 value: "bottom-right"
         },
         
         timeout : {
             value : 4000
         }
    };
 
    SimpleNotifier.MARKUP = '<div class="yui3-notify-close"><a title="close">X</a></div>'+
					  '<div class="yui3-simplenotifier-header  {header_show} ">{header}</div>' +
					  '<div class="yui3-simplenotifier-message">{message}</div>';
    
    /* Notifier extends the base Widget class */
    Y.extend(SimpleNotifier, Y.Widget, {
    	
    	BOUNDING_TEMPLATE : '<div/>',
    	
    	
        initializer: function() {
            this.publish("closeEvent", {
                defaultFn: this._defCloseEventFn,
                bubbles:false
            });
        },

        destructor : function() {
            
        },

        renderUI : function() {
    
            var nmessage = this.get('message');
            var nheader  = this.get('header');
            var nheader_show;
            if(nheader)   {
            	nheader_show = "simplenotifier-header-show"; 
            }else {
            	nheader_show = "simplenotifier-header-noshow";
            }  
            
            var simplenotifier_content = {
            	message:  nmessage,
                header:   nheader,
                header_show: nheader_show
            };
            
            this.get('contentBox').append(Y.Node.create(Y.substitute(SimpleNotifier.MARKUP, simplenotifier_content)));
            this.get('boundingBox').addClass(this.get('position'));
            
            Y.one('.yui3-notify-close').on('click',function(e) {
                this.fire("closeEvent");
            },this);

        },

        bindUI : function() {
              this.after("messageChange", this._afterMessageChange);
              this.after("headerChange", this._afterHeaderChange);
              this._onHover();
        },
	    
		hide : function(oArgs) {
		
			if(this.timer) {
			      this.timer.stop();
			      this.timer = null;
			    }

		    var anim = new Y.Anim({
                node: this.get('boundingBox'),
                to: {
                    opacity: 0
                },
				easing:'easeIn',
                duration:0.5
           });
          anim.run();
        },

        syncUI : function() {
             this._uiSetMessage(this.get("message"));
             this._uiSetHeader(this.get("header"));
             this.timer = new Y.Timer({
                 length: this.get("timeout"),
                 repeatCount: 1,
                 callback: Y.bind(this.hide, this)
               });
               this.timer.start();
        },
        
        _onHover : function() {
            
        	var cb = this.get("contentBox");
        	cb.on('mouseenter',Y.bind(function(e) {
              if(this.timer) {
            	  this.timer.pause();
              }
        	},this));

        	cb.on('mouseleave',Y.bind(function(e) {
              if(this.timer) {
                this.timer.resume();
              }
            },this));
          },
        	
         /*Listeners, UI update methods */
        _afterMessageChange : function(e) {
            /* Listens for changes in state, and asks for a UI update (controller). */
             this._uiSetMessage(e.newVal);
        },

        _afterHeaderChange : function(e) {
            /* Listens for changes in state, and asks for a UI update (controller). */
        	if(e || e.newVal) {
        		this._uiSetHeader(e.newVal);
        	}
             
        },
        _uiSetMessage : function(val) {
            /* Update the state of attrA in the UI (view) */
            var content = Y.one('.yui3-simplenotifier-message');
            content.set("innerHTML",val);
        },
        _uiSetHeader : function(val) {
            /* Update the state of attrA in the UI (view) */
        	var header = Y.one('.yui3-simplenotifier-header');
            header.set("innerHTML",val);
        },
        _defCloseEventFn:function(){
        	this.hide();
        }

    });

    Y.SimpleNotifier = SimpleNotifier;



}, 'gallery-2012.06.13-20-30' ,{requires:['widget', 'node', 'event', 'substitute', 'dom', 'anim', 'gallery-timer' ], skinnable:true});
