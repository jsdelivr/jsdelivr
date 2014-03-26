YUI.add('gallery-permalink', function(Y) {

	Y.Permalink = Y.Base.create('permalink', Y.Widget, [
		Y.WidgetStack
		], {
			renderUI: function() {
				var contentBox = this.get('contentBox');

				var anchor = this._renderAnchor();
				contentBox.appendChild(anchor);

				var boundingBox = this.get('boundingBox');
				boundingBox.setStyle('position', 'relative');
				var left = this.get('left');
				var top = this.get('top');
				if(!left) left = 0;
				if(!top) top = 0;
				boundingBox.setStyle('left', left + 'px');
				boundingBox.setStyle('top', top + 'px');
			},

			bindUI: function() {
				Y.Permalink.superclass.bindUI.apply(this, arguments);
				var contentBox = this.get('contentBox');

				Y.delegate("mouseover", Y.bind(this.get("linkGenerator"), this), contentBox, "a");
			},

			_handleClick: function(e) {
				e.preventDefault();
				var target = e.target;
				if(!target.hasAttribute('href')) {
					target = target.get('parentNode');
				}
				var href = target.get('href');
				if(document.all) {
					window.external.AddFavorite(href,document.title); 
				} else if(window.sidebar) {
					window.sidebar.addPanel (document.title,href,'');
				}
			},

			_getDefaultLinkGenerator: function(val) {
				if(!this.base) {
					this.base = window.location.href;
				}
				//default logic when no linkGenerator function is provided
				var generatorFunction = function() {
					var anchor = this.get("anchor");
					var destUrl = val ? val() : this.base;
					anchor.set('href', destUrl);
					anchor.blur();
					anchor.focus();
				};
				return generatorFunction 
			},

			_renderAnchor: function() {
				var base = decodeURIComponent(window.location.href);
				if(base.indexOf('?') != -1) {
					base = base.substring(0, base.indexOf('?'));
				}

				var label = this.get('label');
				var anchor;
				if(!label) {
					label = 'Permalink';
				}
				anchor = Y.Node.create('<a href="' + base + '">' + label + '</a>');

				anchor.setStyle('text-align', 'center');
				this.set("anchor", anchor);
				anchor.on('click', this._handleClick);
				return anchor;
			}
		}, {
		ATTRS: {
			// Define widget attributes here (optional).
        		label: null,
			left: null,
			top: null,
			linkGenerator: {
				valueFn: '_getDefaultLinkGenerator',

				setter: function(val) {
					return this._getDefaultLinkGenerator(val);
				}
			}
	 	}
		// Define static properties and methods here (optional).
	});	


}, 'gallery-2011.11.30-20-58' ,{requires:['widget', 'widget-stack'], skinnable:false});
