/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
['aloha/jquery','aloha/plugin', 'aloha/floatingmenu', 'i18n!numerated-headers/nls/i18n', 'i18n!aloha/nls/i18n','css!numerated-headers/css/numerated-headers.css',],
function(jQuery, Plugin, FloatingMenu, i18n, i18nCore) {
	

   var
	$ = jQuery,
	GENTICS = window.GENTICS,
	Aloha = window.Aloha;
	
   return Plugin.create('numerated-headers', {
     
	 numeratedactive : true,
	 headingselector : 'h1, h2, h3, h4, h5, h6',
	 
     /**
      * Initialize the plugin
      */
     init: function () {
       var that = this;

	   if ( typeof this.settings.numeratedactive !== 'undefined' ) {
			this.numeratedactive = this.settings.numeratedactive;
		}

	   // modifyable selector for the headers, that should be numerated
	   if ( typeof this.settings.headingselector !== 'undefined' ) {
			this.headingselector = this.settings.headingselector;
		}
	   // modifyable selector for the baseobject. Where should be numerated
	   if ( typeof this.settings.baseobjectSelector !== 'undefined' ) {
			this.baseobjectSelector = this.settings.baseobjectSelector;
		}
		
       	    // add button to toggle format-less pasting
          this.numeratedHeadersButton = new Aloha.ui.Button({
            'iconClass' : 'aloha-button aloha-button-numerated-headers',
            'size' : 'small',
            'onclick' : function () {
		   if(that.numeratedHeadersButton.isPressed()) {
			//that.numeratedHeadersButton.setPressed(false);
			that.removeNumerations();
		   }
		   else {
			//that.numeratedHeadersButton.setPressed(true);
			that.createNumeratedHeaders();
		   }
            },
            'tooltip' : i18n.t('button.numeratedHeaders.tooltip'),
            'toggle' : true,
	    'pressed' : this.numeratedactive
          });

          FloatingMenu.addButton(
            'Aloha.continuoustext',
            this.numeratedHeadersButton,
            i18nCore.t('floatingmenu.tab.format'),
            1
          );
	   
	  // We need to bind to selection-changed event to recognize backspace and delete interactions
	  Aloha.bind( 'aloha-selection-changed', function ( event ) {
	    if ( that.numeratedHeadersButton.isPressed() ) {
		that.createNumeratedHeaders();
	    }
	  });
     },

	 removeNumerations : function () {
		var active_editable_obj = this.getBaseElement();

		if ( !active_editable_obj ) {
			return;
		}

		var headers = active_editable_obj.find(this.headingselector);
		headers.each( function() {
			jQuery(this).find('span[role=annotation]').each(function(){jQuery(this).remove();});
		});
	 },

	getBaseElement: function() {

		if ( typeof this.baseobjectSelector !== 'undefined' ) {
			if( jQuery(this.baseobjectSelector).length > 0 ) {
				return jQuery(this.baseobjectSelector);
			} else {
				return false;
			}
		} else {
			if ( typeof Aloha.activeEditable == "undefined" || Aloha.activeEditable == null ) {
        			return false;
        		} else {
				return Aloha.activeEditable.obj;
			}
		}
	},


	/*
	* checks if the given Object contains a note Tag that looks like this:
	* <span annotation=''>
	*
	* @param {Object} obj - The Object to check
	*/
     	hasNote: function(obj) {
	
		if(!obj || !jQuery(obj).length > 0){	
			return false;
		}

		obj = jQuery(obj);

		if( obj.find('span[role=annotation]').length > 0 ) {
			return true;
		}

		return false;
	},

	
	/*
	* checks if the given Object has textual content.
	* A possible "<span annotation=''>" tag will be ignored
	*
	* @param {Object} obj - The Object to check
	*/
	hasContent: function(obj) {
	
		if( !obj || !jQuery(obj).length > 0 ) {	
			return false;
		}

		obj = jQuery(obj);

		// we have to check the content of this object without the annotation span
		var objCleaned = obj.clone().find('span[role=annotation]').remove().end();

		// check for text, also in other possible sub tags
		if ( objCleaned.text().trim().length > 0 ) {
			return true;
		}
	
		return false;
	},


     createNumeratedHeaders: function() {

	var active_editable_obj = this.getBaseElement();

	if(!active_editable_obj){
		return;
	}
	
	var that = this;
      
        var headers = active_editable_obj.find(this.headingselector);

		if ( typeof headers == "undefined" || headers.length == 0 ) {
           return;
      }

      var base_rank = parseInt(headers[0].nodeName.substr(1));
      var prev_rank = null;
      var current_annotation = [];
      var annotation_pos = 0;

      // initialize the base annotations
      for ( var i=0; i < (6 - base_rank) + 1; i++ ) {
          current_annotation[i] = 0; 
      }
      
      headers.each(function(){
	// build and count annotation only if there is content in this header
	if( that.hasContent(this) ) {

       		var current_rank = parseInt(this.nodeName.substr(1));
        	if( prev_rank == null ){
          		//increment the main annotation 
          		current_annotation[annotation_pos]++;
        	}
        	//starts a sub title
        	else if ( current_rank > prev_rank ) {
          		current_annotation[++annotation_pos]++; 
        	}
        	//continues subtitles
        	else if ( current_rank == prev_rank ) {
          		current_annotation[annotation_pos]++; 
        	}
        	//goes back to a main title
        	else if ( current_rank < prev_rank ) {
          		var current_pos = current_rank - base_rank;
          		for( var j=annotation_pos; j > (current_pos); j-- ){
            			current_annotation[j] = 0; //reset current sub-annotation
          		}
          		annotation_pos = current_pos;
          		current_annotation[annotation_pos]++; 
        	}

        	prev_rank = current_rank;

        	var annotation_result = current_annotation[0];
        	for( var i = 1; i < current_annotation.length; i++ ){
          		if(current_annotation[i] != 0){
             			annotation_result += ("." + current_annotation[i]); 
          		} 
        	}
	
		if ( that.hasNote(this) ) {
			jQuery(this).find('span[role=annotation]').html(annotation_result); 
		} else {
			jQuery(this).prepend("<span role='annotation'>" + annotation_result + "</span> ");
		}
	} else {
		// no Content, so remove the Note, if there is one
		if ( that.hasNote(this) ) {
			jQuery(this).find('span[role=annotation]').remove();
		}
		
	}

      })
     }
     
   });
});
