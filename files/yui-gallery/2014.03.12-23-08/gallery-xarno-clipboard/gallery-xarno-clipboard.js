YUI.add('gallery-xarno-clipboard', function(Y) {

	Y.namespace('Xarno').Clipboard = Y.Base.create('xarno-clipboard', Y.Base, [], {
	
		_movie : null,
		
		_swf : null,
	
		initializer : function(){
			this.publish('ready', { defaultFn: Y.bind(this._defReady, this), fireOnce:true });
			this._renderUI();
			this._bindUI();
		},
		
		moveToAndCopy : function(target) {
			
			this.moveTo(target).copy(target);
		},
		
		hide : function() {
			this._movie.setStyles({
				left: '-10px',
				top: '-10px',
				width: '1',
				height: '1'
			});
		},
		
		moveTo : function(target) {
			this._movie.setStyles({
				left: target.getX(),
				top: target.getY(),
				width: target.getComputedStyle('width'),
				height: target.getComputedStyle('height')
			});
			
			return this;
		},
		
		copy : function(target) {
			var copyTarget = this.get('clipTarget');
			
			if (target !== null && target !== undefined) {
				copyTarget = target;
			} else {
				copyTarget = Y.one(copyTarget);
			}
			
			if (copyTarget) {
				this.setText( copyTarget.getContent() );
			}
			
			return this;
		},
		
		setText : function(text) {
			this._swfCall('setText', [ text ]);
			
			return this;
		},
		
		_movieReady : function() {
			this.fire('ready');
		},
		
		_renderUI : function(){
			var movie = Y.Node.create('<div />'),
				swf = null;
			
			Y.one('body').prepend(movie);
			movie.set('id', Y.stamp(movie));
			movie.setStyles({
				width: '1px',
				height: '1px',
				overflow: 'hidden',
				position: 'absolute',
				zIndex: '16000'
			});
			
			
			swf = new Y.SWF(movie, this.get('swfPath'), {
				fixedAttributes : {
					allowScriptAccess: 'always',
					allowNetworking: 'all',
					wmode: 'transparent'
				}
			});
			
			swf.on('swfReady', Y.bind(this._movieReady, this));
			
			this._movie = movie;
			this._swf = swf;
		},
		
		_bindUI : function() {
			this._movie.on('mouseout', this.hide, this);
			this.after('handChange', this._updateHand, this);
			this.after('debugChange', this._updateDebug, this);
		},
		
		_defReady : function(e) {
			this._updateHand();
			this._updateDebug();
		},
		
		_updateHand : function(e) {
			var bool = (e && e.newVal) ? e.newVal : this.get('hand');
			this._swfCall('showHand', [bool] );
		},
		
		_updateDebug : function(e){
			var bool = (e && e.newVal) ? e.newVal : this.get('debug');
			this._swfCall('setDebug', [bool]);
		},
		
		_swfCall : function(func, args) {
			var swf = this._swf._swf._node;
			if (!args) { 
				  args= []; 
			}
			
			try {
				return(swf[func].apply(swf, args));
			} catch (err) {
				return null;
			}
		}
	
	}, {
		ATTRS : {
			swfPath : {
				value : 'XarnoClipboard.swf'
			},
			
			clipTarget : {},
			
			hand : {
				value : true
			},
			
			debug : {
				value : false
			}
		}
	});


}, 'gallery-2011.03.30-19-47' ,{requires:['node','event','base-build','swf']});
