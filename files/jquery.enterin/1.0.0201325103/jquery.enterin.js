/*
 * EnterIN jQuery Plugin v1.0
 * 
 * Copyright 2013 Gianfilippo Balestriero
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

(function ($) {
	
	$.fn.enterin = function(options) {
		
		var $defaults = {
			
			controllers:	'#enterin-ctrl',
			maxScale:		20,
			effectTime:		3.0,
			ease:			'linear',
			endCallback:	function(){}
			
		};
		
		var settings = $.extend( {}, $defaults, options );
        
        var enterin = {
        	
        	init: function(element){
 
 				enterin.isInit = true;
        		
        		enterin.wrapper = jQuery(element);
        		
        		enterin.ctrl	= jQuery(settings.controllers);
        		
        		enterin.setWrapperStyle();
        		
        		enterin.setSlidesStyle();

        		enterin.bindControllers();
        		
        		enterin.bindAnimation();

        	},
        	
        	setWrapperStyle: function(){
        		enterin.wrapper.css("position", 	"relative");
        		enterin.wrapper.css("overflow", 	"hidden");
        	},
        	
        	setSlidesStyle: function(){
        		
        		var time			= settings.effectTime+"s";
        		
        		var ease			= settings.ease;
        		
        		enterin.changeSlide(1);
        		
        		setTimeout(function(){
        			enterin.wrapper.find(".enterin-slide").css("transition", 	"all "+time+" "+ease);
        			enterin.wrapper.find(".enterin-slide").css("position", 		"absolute");
        			enterin.wrapper.find(".enterin-slide").css("top", 			"0px");
        			enterin.wrapper.find(".enterin-slide").css("left", 			"0px");
        		},10);
        		
        		
        	},
        	
        	bindControllers: function(){
        		
        		enterin.isInit = false;
        		
				enterin.ctrl.find("[data-enterin]").click(function(){
					
					var $this  	= jQuery(this);
					var $to	    = $this.data("enterin");
					
					enterin.changeSlide($to);
					
				});		
        		
        	},
        	
        	bindAnimation: function(){
        		
        		var countSlides 	= enterin.wrapper.find(".enterin-slide").length;

				jQuery(".enterin-slide").unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

	        	jQuery(".enterin-slide").eq(enterin.to-1).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	        		if(enterin.isInit) {
	        			enterin.isInit = false;
	        			return;
	        		}
	        		else {
	        			settings.endCallback(enterin.to-1);
	        		}
				});
				        		
        	},
        	
			changeSlide: function(to) {
				
				var aParams = enterin.calcStyle();
				
				var countSlides 	= enterin.wrapper.find(".enterin-slide").length;
				
        		for(var i = 1; i<=countSlides; i++) {
        			
	    			var scale   = aParams.scales[i-1];
	    			var zindex  = aParams.zindex[i-1];
	    			var opacity = aParams.scales[i-1];
	    			
	    			if(i<to) {
	    				scale  		= (scale*4);
	    				opacity 	= 0;
	    			}
	    			else {
	    				scale 	= aParams.scales[i-to];
	    				zindex 	= aParams.zindex[i-to];
	    				opacity	= aParams.scales[i-to];
	    			}
	  			
	    			enterin.wrapper.find(".enterin-slide").eq(i-1).css("transform", "scale("+scale+")");
	    			enterin.wrapper.find(".enterin-slide").eq(i-1).css("z-index", zindex);
	    			enterin.wrapper.find(".enterin-slide").eq(i-1).css("opacity", opacity);

        			
        		}
   		
     			enterin.to = to;
     			
     			enterin.bindAnimation();
     			
			},
			
			calcStyle: function(){
				
				var countSlides 	= enterin.wrapper.find(".enterin-slide").length;
				
				var cSlide 			= (settings.maxScale/countSlides);

				var division		= (1/settings.maxScale);

				
				var scales				= [];
				var zindexes			= [];
				var maxScales			= [];
        		
        		for(var i = 1; i<=countSlides; i++) {
        			
        			var f = (division*cSlide)*((countSlides+1)-i);
        			
        			var scale   = f;

        			scales.push(scale);
        			zindexes.push(countSlides-i);
        			
        		}				
        		
        		return {
        			scales: scales,
        			zindex: zindexes
        		};
			}
        	
        };
        
		return this.each(function() {
		    enterin.init(this);
		});
		
	};
 
}(jQuery));