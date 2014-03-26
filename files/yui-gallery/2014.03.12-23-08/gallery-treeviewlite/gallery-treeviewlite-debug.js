YUI.add('gallery-treeviewlite', function(Y) {

       /**
        * Simple Treeview
        *
        * Copyright (c) 2010 Matt Parker, Lamplight Database Systems Ltd
        * YUI BSD - http://developer.yahoo.com/yui/license.html
        */
       /**
        * Really lightweight treeview plugin that can be attached to a Node via the plug method.
        * It's just a listener and some css
        * @class TreeviewLite
        * @constructor
        * @namespace Plugin
        */



        // for minimizing
        var HOST            = "host",
            TREEVIEWLITE    = "treeviewlite",
        		getCN           = Y.ClassNameManager.getClassName,
            CSS_TOP         = getCN( TREEVIEWLITE ), //"yui3-treeviewlite",
            CSS_HAS_CHILD   = getCN( TREEVIEWLITE , "haschild" ), //"yui3-treeviewlite-haschild", 
            CSS_FINAL_CHILD = getCN( TREEVIEWLITE , "lastchild" ), //"yui3-treeviewlite-lastchild",
            CSS_COLLAPSED   = getCN( TREEVIEWLITE , "collapsed" ), //"yui3-treeviewlite-collapsed";
            
            
            

        TreeviewLite = function(config) {

            TreeviewLite.superclass.constructor.apply(this, arguments);
        };
        
        



        
        /**
        * @property NAME
        * @type {String}
        */
        TreeviewLite.NAME = "treeviewLitePlugin";

        /**
        * @property NS
        * @description The treeview instance will be placed on the Node instance 
        *         under the treeviewlight namespace. It can be accessed via Node.treeviewlight;
        * @type {String}
        */
        TreeviewLite.NS = "treeviewLite";



        /**
         * There are no attributes to set.  It's that simple.
         */
        TreeviewLite.ATTRS = {};
        
        Y.extend(TreeviewLite, Y.Plugin.Base, {
            
            /**
             * Stores handles for delegated event listener(s).
             * @property _delegates
             * @protected
             * @type Array
             */
            _delegates: [],
            
            
            /**
             * Lifecycle: add classes and a delegated listener
             * @method initializer
             */
            initializer: function(){
            

              this.renderUI();
              this.bindUI();
                

            },
            
            /**
             * Lifecycle: removes classes and listener(s)
             * @method destructor
             */
            destructor: function(){

              var host = this.get(HOST);
              
              host.removeClass( CSS_TOP );
              host.all( "li" ).removeClass( CSS_HAS_CHILD )
                              .removeClass( CSS_COLLAPSED )
                              .removeClass( CSS_FINAL_CHILD );
              // remove event(s);
              Y.each( this._delegates , function(d){d.detach( );} );
            },

            /**
             * <p>Adds some CSS to the various nodes in the tree.</p>
             * @method bindUI
             */
            renderUI : function() {
              var host = this.get(HOST);
              
              host.addClass( CSS_TOP );
              
              Y.each( host.all( "li" ) , function(n){ 
                   
                   // add class if they have child lists
                   n.removeClass( CSS_HAS_CHILD );
                   if( n.one( "ol li,ul li" ) ){
                       n.addClass( CSS_HAS_CHILD );
                   }
                   
                   // add a 'last child' css.
                   n.removeClass( CSS_FINAL_CHILD );
                   if( n.next() === null ) {
                     n.addClass( CSS_FINAL_CHILD );
                   }
              });            
            },


            /**
             * <p>Adds a delegated listener to the top of the tree
             * to open toggle the collapsed state of any list item
             * containing a nested list.</p>
             * @method bindUI
             */
            bindUI : function() {
                 
                 // add a delegated listener to expand collapsed sub trees
                 this._delegates.push( this.get(HOST).delegate( "click" , 
                    this._toggleCollapse , 
                    "li." + CSS_HAS_CHILD + " span" , 
                    this, 
                    true)
                 );            
            },
            
            /**
             * <p>Opens or collapses a nested list.</p>
             * @method _toggleCollapse
             * @param {EventFacade} e Event object
             * @protected 
             */
            _toggleCollapse : function( ev ){
                 var parent = ev.currentTarget.get( "parentNode" );
                 if( parent.one("ol,ul") ){
                   if( parent.hasClass( CSS_COLLAPSED ) ) { 
                     /**
                      * <p>Event fired when a list is opened</p>
                      * @event open
                      * @param {EventFacade} ev Event object
                      */
                     this.fire( "open" , ev );
                   } else {
                     /**
                      * <p>Event fired when a list is collapsed</p>
                      * @event collapse
                      * @param {EventFacade} ev Event object
                      */
                     this.fire( "collapse" , ev );
                   }
                   parent.toggleClass( CSS_COLLAPSED );
                 }
            }
            
            
            
        } );
        
        
        
        
        
        Y.Plugin.TreeviewLite = TreeviewLite;


}, 'gallery-2010.06.02-18-59' ,{requires:['node','plugin','classnamemanager']});
