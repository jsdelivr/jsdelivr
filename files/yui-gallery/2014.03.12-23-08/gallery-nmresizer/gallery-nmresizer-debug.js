YUI.add('gallery-nmresizer', function (Y, NAME) {

Y.Nmresizer = Y.Base.create('nmresizer', Y.Widget, [], { 
	initializer : function( config ) {
			
	},
		
	loadAndResize : function(config) {
		// check for required parameters
		if (typeof config.newdiv == "undefined") {
			Y.log('nmresizer requires a "newdiv" parameter', 'error');
			return;
		}
		else if (typeof config.resizediv == "undefined") {
			Y.log('nmresizer requires a "resizediv" parameter', 'error');
			return;
		}
			
		// make sure provided CSS IDs include leading pound sign
		if (config.olddiv && !config.olddiv.match(/^(#|\.)/)) {
			config.olddiv = '#' + config.olddiv;
		}
		if (!config.newdiv.match(/^(#|\.)/)) {
			config.newdiv = '#' + config.newdiv;
		}
		if (!config.resizediv.match(/^(#|\.)/)) {
			config.resizediv = '#' + config.resizediv;
		}
		if (config.resizeclass && !config.resizeclass.match(/^\./)) {
			config.resizeclass = '.' + config.resizeclass;
		}
			
		if (typeof config.animDuration !== "undefined") {
			// use provided animDuration, overriding default
			this.set('animDuration', config.animDuration);
		}
		if (typeof config.maxWidth !== "undefined") {
			config.maxWidth = String(config.maxWidth);
			if (config.maxWidth.match(/px$/)) { config.maxWidth = config.maxWidth.replace(/px$/,''); }
			this.set('maxWidth', config.maxWidth);
		}
		if (typeof config.maxHeight !== "undefined") {
			config.maxHeight = String(config.maxHeight);				
			if (config.maxHeight.match(/px$/)) { config.maxHeight = config.maxHeight.replace(/px$/,''); }
			this.set('maxHeight', config.maxHeight);
		}
		if (typeof config.restrainHeight !== "undefined") {
			config.restrainHeight = String(config.restrainHeight);				
			if (config.restrainHeight.match(/px$/)) { config.restrainHeight = config.restrainHeight.replace(/px$/,''); }
			this.set('restrainHeight', config.restrainHeight);
		}
		if (typeof config.restrainWidth !== "undefined") {
			config.restrainWidth = String(config.restrainWidth);
			if (config.restrainWidth.match(/px$/)) { config.restrainWidth = config.restrainWidth.replace(/px$/,''); }			
			this.set('restrainWidth', config.restrainWidth);
		}
		if (typeof config.offsetWidth !== "undefined") {
			config.offsetWidth = String(config.offsetWidth);				
			if (config.offsetWidth.match(/px$/)) { config.offsetWidth = config.offsetWidth.replace(/px$/,''); }	
			this.set('offsetWidth', config.offsetWidth);
		}
		if (typeof config.offsetHeight !== "undefined") {
			config.offsetHeight = String(config.offsetHeight);					
			if (config.offsetHeight.match(/px$/)) { config.offsetHeight = config.offsetHeight.replace(/px$/,''); }	
			this.set('offsetHeight', config.offsetHeight);
		}
			
		config.resizediv = config.resizediv ? config.resizediv : config.newdiv;
			
		// determine current tab dimensions
		config.oldtabheight = Y.one(config.resizediv).getComputedStyle('height');
		config.oldtabwidth = Y.one(config.resizediv).getComputedStyle('width');
			
		// delay measurement until all images in config.newdiv have been loaded
		if (Y.one(config.newdiv + ' img')) {
			var totalimages = Y.all(config.newdiv + ' img').size();
			var imagesloaded = 0;
			var images = [];
			var nmresizer = this;
			Y.all(config.newdiv + ' img').each(function(o,idx) {
				if (o.get('src') && o.get('src').match(/\.(jpg|jpeg|gif|png)$/i)) {
					images[idx] = new Image();
					images[idx].src = o.get('src');
					images[idx].onload = function() {
						//o.set('src', images[idx].src);
						imagesloaded++;
						if (imagesloaded == totalimages) {
							nmresizer.doLoadAndResize(config);
						}
					};
					images[idx].onerror = function() {
						// image load attempted, record it (perhaps image didn't exist in path)
						imagesloaded++;
						if (imagesloaded == totalimages) {
							nmresizer.doLoadAndResize(config);
						}
					};	
				}
				else {
					totalimages--;
					if (!totalimages) { this.doLoadAndResize(config); }
				}
			}, this);
		}
		else {
			this.doLoadAndResize(config);
		}
	},
		
	doLoadAndResize : function(config) {
		var offviewportwidth = this.get('restrainWidth') ? this.get('restrainWidth') + 'px' : 'auto';			
		var offviewportheight = this.get('restrainHeight') ? this.get('restrainHeight') + 'px' : 'auto';
			
		Y.one(config.newdiv).setStyles({
			display:'block',
			position:'absolute',
			left:'-5000px',
			visibility:'hidden',
			width:offviewportwidth,
			height:offviewportheight
		});
		Y.one(config.newdiv).removeClass('displaynone');
			
		if (typeof config.noWidthResize == "undefined" || !config.noWidthResize) {
			// resize width
			config.newtabwidth = parseInt(Y.one(config.newdiv).get('offsetWidth')) + parseInt(this.get('offsetWidth')) + 'px';
			if (this.get('maxWidth') && parseInt(config.newtabwidth, 10) > this.get('maxWidth')) {
				config.newtabwidth = this.get('maxWidth') + 'px';
			}
		}
			
		if (typeof config.noHeightResize == "undefined" || !config.noHeightResize) {
			// resize height
			config.newtabheight = parseInt(Y.one(config.newdiv).get('offsetHeight')) + parseInt(this.get('offsetHeight')) + 'px';
			if (this.get('maxHeight') && parseInt(config.newtabheight, 10) > this.get('maxHeight')) {
				config.newtabheight = this.get('maxHeight') + 'px';
			}
		}
			
		//Y.log('newtabwidth: ' + config.newtabwidth + ' newtabheight: ' + config.newtabheight);
		if (config.onStart) {
			config.onStart(config);
		}
			
		// return newdiv to viewport
		Y.one(config.newdiv).setStyles({
			position:'',
			left:''
		});
			
		Y.one(config.resizediv).setStyles({
			width:config.oldtabwidth,
			height:config.oldtabheight
		});
			
		// hide olddiv
		if (config.olddiv !== config.newdiv) {
			Y.one(config.olddiv).setStyles({
				display:'none',
				width:'',
				height:''
			});	
		}

		// start transition
		if (config.oldtabheight == config.newtabheight && config.oldtabwidth == config.newtabwidth) {
			// no transition necessary, just show new element
			Y.one(config.newdiv).setStyles({
				display:'block',
				visibility:'visible'
			});
			if (config.resizediv !== config.newdiv) {
				Y.one(config.newdiv).setStyles({
					width:'auto',
					height:'auto'
				});
			}
			if (config.onEnd) {
				config.onEnd(config);
			}
		}
		else {
			var transoptions = {
				easing:'ease-out',
				duration:this.get('animDuration')
			};
				
			if (typeof config.newtabwidth !== "undefined") {
				transoptions.width = config.newtabwidth;
			}
			if (typeof config.newtabheight !== "undefined") {
				transoptions.height = config.newtabheight;
			}
				
			if (typeof config.resizeclass !== "undefined" && config.resizeclass) {
				// now that resizediv has been measured, resize all divs assigned to 
				// class rather than single div
				config.resizediv = config.resizeclass;
			}

			Y.log('resize ' + config.resizediv + ' to ' + transoptions.width + ' x ' + transoptions.height);
			// animate resizediv to fit config.newdiv
			Y.all(config.resizediv).transition(transoptions, function() {
				// release inline dimension restraints
				/*
				Y.one(config.resizediv).setStyles({
					width:'',
					height:''
				});
				*/
				// reveal contents
				Y.one(config.newdiv).setStyles({
					visibility:'visible'
				});
				if (config.resizediv !== config.newdiv) {
					Y.one(config.newdiv).setStyles({
						width:'auto',
						height:'auto'
					});
				}
				if (config.onEnd) {
					config.onEnd(config);
				}
			});
		}
	}
}, {
    ATTRS : { 
		animDuration : {
			value : 0.5
		},
		maxHeight : {
			value : 0
		},
		maxWidth : {
			value : 0
		},
		restrainHeight : {
			value : 0
		},
		restrainWidth: {
			value : 0
		},
		offsetWidth : {
			value : 0
		},
		offsetHeight : {
			value : 0
		}
	}
		
});


}, 'gallery-2013.05.10-00-54', {
    "supersedes": [
        ""
    ],
    "requires": [
        "base-build",
        "widget",
        "event-mouseenter",
        "node",
        "transition"
    ],
    "optional": [
        ""
    ]
});
