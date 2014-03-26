YUI.add('gallery-slidecheckbox', function(Y) {

	var SLIDECHECKBOX='SlideCheckbox',
	CBX = 'contentBox',
	WRAPPER = 'wrapper',
	SLIDER = 'slider',
	SLIDERWRAP = 'sliderwrap',
	LABELON = 'labelOn',
	LABELOFF = 'labelOff',
	HANDLE = 'handle';
	
	Y[SLIDECHECKBOX] = Y.Base.create(
	SLIDECHECKBOX,
	Y.Widget,
	[Y.MakeNode],
		{
			anim : null,
			currentX : null,
			lastX : null,
			renderUI : function() {
				this.src = this.get('srcNode').addClass(this.getClassName('hidden'));
				this.get(CBX).append(this._makeNode()).append(this.src);
				
				this._locateNodes();

				var leftX = this._labelOnNode.one('div').get('offsetWidth'),
				rightX = this._labelOffNode.one('div').get('offsetWidth'), 
				width = this._labelOnNode.get('offsetWidth'),
				skin = this.getSkinName(),
				ios5 = skin? skin.indexOf('ios5') > -1 : null;

				if(leftX > rightX){
					this._labelOffNode.one('div').setStyle('width',leftX);
				}else{
					this._labelOnNode.one('div').setStyle('width',rightX);
					width = this._labelOnNode.get('offsetWidth');
				}
				
				this.left = -this._labelOnNode.get('offsetWidth') + 3;

				var wrapperWidth = 2 * width;
				
				if(ios5){
					this._slideWrapWidth = 2 * width + 28;
					this.left = this.left + 11;
					wrapperWidth = width + 14;
				}else{
					this._slideWrapWidth = 3 * width + 10;
					this._handleNode.setStyle('width',width - 3);
				}
				this._sliderwrapNode.setStyle('width',this._slideWrapWidth);
				this._wrapperNode.setStyle('width',wrapperWidth);
			},
			bindUI : function(){
				this.disabled = this.src.get('disabled') || this.src.get('readonly');
				
				var dd = new Y.DD.Drag({
					node: this._sliderwrapNode,
					activeHandle : this._handleNode,
					lock: this.disabled
				}),
				cb = this.get(CBX);
				
				this._addDragConstraint(dd);
				
				dd.on('drag:drag',function(e){
					var xy = this._wrapperNode.getXY();
					
					//If the node is repositioned we need to reapply the constraint
					if(xy[1] !== dd.actXY[1]){
						dd.unplug();
						this._addDragConstraint(dd);
						e.halt(true);
					}
					
					if(dd.actXY[0] % 2 === 0){
						this.lastX = this.currentX;
					}
					this.currentX = dd.actXY[0];
					
				}, this);
				
				dd.on('drag:end',this.move, this);
				
				cb.on('focus',function(){
					cb.on('key',this.goLeft,'down:37',this);
					cb.on('key',this.goRight,'down:39',this);
					cb.on('key',function(e){
						e.preventDefault();
						this.move();
					},'down:32',this);
				},this);
				cb.on('blur',function(){
					cb.detach('key');
					cb.blur();
				},this);
			},syncUI : function(){
				this._sliderwrapNode.setStyle('left',
					this.src.get('checked')?  0 : this.left
				);
			},destructor : function(){
				this.anim && this.anim.stop().destroy();
				this.src=null;
			},
			goLeft : function(){
				this.to = this.left;
				this._execute();
			},
			goRight : function(){
				this.to = 0;
				this._execute();
			},
			move : function(){
				this.from = this._replacePx(this._sliderwrapNode.getComputedStyle('left'));
				
				if(this.lastX !== null){
					Y.log("current: " + this.currentX + ", last: " + this.lastX  + ", left: " + this.left);
					if(this.currentX < this.lastX || this.from === this.left){
						this.goLeft();
					}else{
						this.goRight();
					}
				}
				
				if(this.from > this.left){
					this.goLeft();
				}else{
					this.goRight();
				}
			},
			_addDragConstraint : function(dd){
				var xy = this._wrapperNode.getXY();
				dd.plug(Y.Plugin.DDConstrained, {
					constrain:{
						top:xy[1],
						bottom:xy[1] + this._wrapperNode.get('offsetHeight'),
						right:xy[0] + this._slideWrapWidth,
						left:xy[0] + this.left
					}
				});
			},
			_defaultCB : function(el) {
				return null;
			},
			_onClick : function(e){
				e.preventDefault();
				this.move();
			},
			_execute : function(){
				this.focus();
				if(this.disabled){
					return;
				}
				this.src.set('checked',!this.src.get('checked'));
				if(this.anim === null){
					this.anim = new Y.Anim({
						node: this._sliderwrapNode,
						from: {left:this.from},
						duration: this.get('duration'),
						to: {left:this.to},
						easing: 'easeIn'
					});
				}
				this.lastX = null;
				this.anim.set('from',{left:(this.from? this.from : this.baseX)});
				this.anim.set('to',{left:this.to});
				this.anim.run();

				Y.log("New value: " + this.src.get('checked'));
			},
			_replacePx : function(el){
				return parseInt(el.replace('px',''));
			}
		},
		{
			ATTRS:{
				duration: {value:0.2},
				strings : {
					value:{
						labelOn: 'ON',
						labelOff: 'OFF'
					}
				}
			},
			_CLASS_NAMES: [WRAPPER,SLIDER,SLIDERWRAP,LABELON,LABELOFF,HANDLE],
			_TEMPLATE: [
				'<div class="{c wrapper}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span>',
				'<div class="{c slider}"><div class="{c sliderwrap}">',
				'<div class="{c labelOn}"><label><div>{s labelOn}</div></label></div>',
				'<div class="{c handle}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span></div>',
				'<div class="{c labelOff}"><label><div>{s labelOff}</div></label></div>',
				'</div></div></div>'
			].join('\n'),
			_EVENTS:{
				slider: [
					{type: 'click',fn:'_onClick'}
				]
			},
			HTML_PARSER: {
				value: function (srcNode) {
					return srcNode.getAttribute('checked'); 
				}
			}
		}
	);


}, 'gallery-2012.11.07-21-32' ,{skinnable:true, requires:['node-base', 'anim-base', 'anim-easing', 'base-build', 'event-key', 'event-move', 'widget', 'node-style', 'gallery-makenode', 'dd-drag', 'dd-constrain']});
