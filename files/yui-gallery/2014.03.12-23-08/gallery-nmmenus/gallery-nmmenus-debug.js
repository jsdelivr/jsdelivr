YUI.add('gallery-nmmenus', function (Y, NAME) {

Y.NMMenus = Y.Base.create('nmmenus', Y.Widget, [], { 
	initializer : function( config ) {
		// add hasSubMenu class to all submenus
		Y.all('#' + this.get('menudivid') + ' ul li ul').each(function(submenu) {
			submenu.get('parentNode').one('.topLink').addClass('hasSubMenu');
		});

		if (this.get('ajaxLoadFunc')) {	
			// invoke custom function that sets up JS observers for menu items
		        this.get('ajaxLoadFunc').call(null, this, this);
		}
		
		// init variables for menuItemPulsate function
		this.set('pulsesleft', this.get('pulses'));
		this.set('pulseduration', this.get('pulseduration') / this.get('pulses'));
		
		if (!this.get('nopulsate') && !this.get('ajaxLoadFunc')) {
			// no custom AJAX stuff set, trigger menu item pulsate
			this.initNavMenuPulsate.call(this);
		}
		
		// make sure that top level menu items are not erronously marked as active
		Y.all('#' + this.get('menudivid') + ' .topLink').each(function(node) {
			if (!node.hasClass('hasSubMenu')) {	
				// make sure top level links are marked as inactive on mouseleave
				Y.on('mouseleave', function(e) {
					node.get('parentNode').removeClass('active');
				}, node);
			}
		});

		Y.all('#' + this.get('menudivid') + ' .hasSubMenu').each(function(node, idx) {
			var topLi = node.get('parentNode'),
				subMenu = topLi.one('ul');

			// establish mouseenter observer
			Y.on('mouseenter', function(e) {
				// make sure all other menus do not have .active class set
				Y.all('#' + this.get('menudivid') + ' .hasSubMenu').get('parentNode').removeClass('active');
				
				// mark menu as active
				topLi.addClass('active');
				
				// calculate menu dimensions
				var menuDimensions = this.calcMenuDimensions(subMenu);

				switch (this.get('anim')) {
					case 'fade':
					subMenu.setStyles({
						opacity:0,
						display:'block',
						height:''
					});
					subMenu.transition({
						opacity:1,
						easing:'ease-out',
						duration:this.get('inDuration')
					});	
					break;
					
					case 'blind':
					// submenu needs to be set position:absolute so that parent li does not expand to fit menu width
					// set absolute position properites dynamically	
					subMenu.setStyles({
						height: '0px',
						display:'block',
						position:'absolute',
						top:node.getComputedStyle('height'),
						width:menuDimensions[0]
					});
					// start transition
					subMenu.transition({
						height:menuDimensions[1],
						duration:this.get('inDuration'),
						easing:'ease-out',
						on : {
							end:function() {
								subMenu.setStyle('height', '');
							}
						}
					});
					break;
					
					default:
					break;
				}
			}, topLi, this);
			
			Y.on('mouseleave', function(e) {
				// hide menu
				this.hideNavMenu.call(this, {
					topLi:topLi
				});
			}, topLi, this);
		}, this);
	},

	calcMenuDimensions : function(subMenu) {
		// return menu dimensions, need to temporarily unhide menu to measure it
		subMenu.setStyles({
			display: 'block',
			height:''
		});
		var menuHeight = subMenu.getComputedStyle('height');
		var menuWidth = subMenu.getComputedStyle('width');
		subMenu.setStyle('display', 'none');
		
		return [menuWidth, menuHeight];
	},
	
	hideNavMenu : function(configObj) {
		// set subMenu property to use as an alias referencing the submenu, below
		configObj.subMenu = configObj.topLi.one('ul');
		switch (this.get('anim')) {
			case 'fade':
			configObj.subMenu.transition({
				opacity:0,
				duration:this.get('outDuration'),
				easing:'ease-out',
				on : {
					end:function() {
						configObj.subMenu.setStyles({
							height:'0px',
							display:'none'
						});
						configObj.topLi.removeClass('active');
					}
				}
			});
			break;

			case 'blind':
			configObj.subMenu.transition({
				height:'0px',
				duration:this.get('outDuration'),
				easing:'ease-out',
				on : {
					end:function() {
						configObj.subMenu.setStyle('display', 'none');
						configObj.topLi.removeClass('active');
					}
				}
			});
			break;
			
			default:
			break;
		}
	},
	
	initNavMenuPulsate : function(callbackFunc, callbackArgs) {	
		Y.all('#' + this.get('menudivid') + ' li a.topLink').each(function(node) {
			node = node.get('parentNode');

			Y.delegate('click', Y.bind(function(e) {
				if (e.target.get('href').match(/#$/) && e.target.hasClass('topLink')) {
					// cancel click
					e.preventDefault();
					return;
				}
				else if (Y.one('#' + e.target.get('id')).hasClass('noajax')) { 
					// abort, but do not cancel click
					return; 
				}
				e.preventDefault();
				if (e.target.hasClass('topLink')) {
					// top level link, do not init pulsate
					window.location.href = e.target.get('href');
				}
				else {
					this.menuItemPulsate(e.target.get('id'), function() {
						window.location.href = e.target.get('href');
					});
				}
			}, this), node, 'a');
		}, this);
	},
		
	menuItemPulsate : function(ID, callbackFunc, callbackArgs) {
		// mimics Script.aculo.us's Effect.Pulsate using YUI transition
		Y.one('#' + ID).transition({
			opacity:0,
			duration:(this.get('pulseduration') / 2),
			on : {
				end: Y.bind(function() {
					Y.one('#' + ID).transition({
						opacity:1,
						duration:(this.get('pulseduration') / 2),
						on : {
							end: Y.bind(function() {
								if (this.get('pulsesleft') > 1) {
									this.set('pulsesleft', this.get('pulsesleft') - 1);
									this.menuItemPulsate.call(this, ID, callbackFunc, callbackArgs);
								}
								else {
									// reset pulsesleft var
									this.set('pulsesleft', this.get('pulses'));
									
									// hide menu
									this.hideNavMenu.call(this, {
										topLi:Y.one('#' + this.get('menudivid') + ' li.active')	
									});
									
									if (callbackFunc) {
										callbackFunc(callbackArgs);
									}
									else {
										// no custom JS load trigger, just navigate to href
										window.location.href = Y.one('#' + ID).get('href');
									}
								}
							}, this)
						}
					});
				}, this)
			}
		});
	}

	        
}, {
    ATTRS : { 
		anim : {
			value : 'fade'
		},
		
		inDuration : {
			value : 0.35
		},
		
		outDuration : {
			value : 0.25
		},
		
		menudivid : {
			value : 'menublock'
		},
		
		pulses : {
			value : 2
		},
		
		pulseduration : {
			value : 0.3
		},
		
		ajaxLoadFunc : {
			
		}
	}
});

}, 'gallery-2013.05.02-22-59', {
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
