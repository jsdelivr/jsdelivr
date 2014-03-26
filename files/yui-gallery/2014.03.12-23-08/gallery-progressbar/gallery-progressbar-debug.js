YUI.add('gallery-progressbar', function(Y) {

	Y.ProgressBar = Y.Base.create('progressBar', Y.Widget, [], {
		
		currentLabel : '',
		
		/** set up **/
		renderUI : function() {
			this.get('contentBox').append(Y.substitute(this.get('layout'), 
				{sliderClass: this.getClassName('slider'),
				labelClass : this.getClassName('label')}
			));
		},
		
		bindUI : function() {
			this.after('labelChange', this._updateLabel);
			this.after('progressChange', this._updateBackground);
		},
		
		syncUI : function() {
			this._updateBackground();
		},
		
		/** A little bit of sugar **/
		increment : function(step) {
			step = step || 1;
			this.set('progress', this.get('progress') + parseFloat(step,10));
			return this;
		},
		
		update : function(progress) {
			this.set('progress', progress);
			return this;
		},
		
		setLabelAt : function(position, value) {
			var label = this.get('label');
			position = parseFloat(position, 10);
			label[position] = value;
			this.set('label', label);
			return this;
		},
		
		removeLabelAt : function(position) {
			var label = this.get('label');
			position = parseFloat(position, 10);
			if(label[position] !== undefined && label[position] !== null) {
				delete label[position];
			}
			this.get('label', label);
			return this;
		},
		
		/** protected updaters **/
		_updateLabel : function(e) {
			var attrs =  this.getAttrs(),
			    label = this.get('label'),
			    progress = this.get('progress'),
			    keys, labelString;
			
			if(label[progress] !== undefined && label[progress] !== null) {
				labelString = label[progress];
			} else {
				keys = Y.Object.keys(label);
				keys.sort(Y.Array.numericSort);
				var i = -1, l = keys.length;
				while(++i < l) {
					if(keys[i] <= progress) {
						labelString = label[keys[i]];
					}
				}
			}
			attrs.label = labelString || '';
			this.get('contentBox').one('.' + this.getClassName('label')).set('text', Y.substitute(this.get('labelTemplate'), attrs ));
		},
		
		_updateBackground : function(e) {
			var slider = this.get('contentBox').one('.' + this.getClassName('slider')),
			    position = slider.get('offsetWidth') * this.get('progress') / 100;
			
			slider.setStyle('backgroundPosition', position + 'px center');
			
			this._updateLabel();
		}
		
	}, {
		ATTRS : {
			labelTemplate : {
				value : '{label} - {progress}%'
			},
			
			label : {
				value : {0:'Loading', 100:'Complete'},
				validator : function(val){
					return (Y.Lang.isString(val) || Y.Lang.isObject(val));
				},
				setter : function(val) {
					if(Y.Lang.isString(val)) {
						val = {0:val};
					}
					return val;
				}
			},
			
			layout : {
				value : '<div class="{sliderClass} {labelClass}"></div>'
			},
			
			precision : {
				value : 2,
				setter : function(val) {
					return parseInt(val,10);
				}
			},
			
			progress : {
				value : 0,
				setter : function(val) {
					var precision = Math.pow(10,this.get('precision'));
					val = parseFloat(val,10);
					if(val < 0) {
						val = 0;
					} else if(val > 100) {
						val = 100;
					}
					return Math.round(val * precision) / precision;
				}
			}
		}
	});


}, 'gallery-2010.06.30-19-54' ,{requires:['widget','substitute']});
