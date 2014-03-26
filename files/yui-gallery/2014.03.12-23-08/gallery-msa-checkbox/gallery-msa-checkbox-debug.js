YUI.add('gallery-msa-checkbox', function (Y, NAME) {

'use strict';

Y.namespace('MSA');

function Checkbox(config) {
    Checkbox.superclass.constructor.apply(this, arguments);
}

Checkbox.NAME = "MSACheckbox";

var HANDLE = '.toggle-handle',
	TOGGLE = '.toggle',
	CHECKBOX = 'input[type=checkbox]',
	READONLY = 'readonly',
	DISABLED = 'disabled',
	WEBKITTRANSFORM = 'webkitTransform',
	WIDTH = 'clientWidth',
	ACTIVE = 'active',
	TRANSLATE3D = 'translate3D',
	TEMPLATE = '<div class="toggle {active}"><div class="toggle-handle"></div></div>';

Y.extend(Checkbox, Y.Base, {
	initializer:function(cfg){
		this._handles = [];
		this.renderUI(cfg);
	},
	renderUI:function(cfg){

		cfg.srcNodes.each(function(node){
			
			node.addClass('toggle-hidden');
		
			//we have to remove any label around a checkbox to prevent erronous selecting
			var lbl = node.ancestor("label");
	
			if(lbl){
				lbl.setAttribute("for",Math.random());
			}
	
			node.insert(Y.Lang.sub(TEMPLATE,{
				active:node.get('checked')? ACTIVE : ''
			}),'after');

		});
		
		this.bindUI();
	},
	bindUI:function(){
		var start = {},
		touchMove = false,
		distanceX = false;
		
		this._handles.push(
			Y.delegate('gesturemovestart', function (e) {
				var toggle = e.currentTarget,
				handle      = toggle.one(HANDLE),
				toggleWidth = toggle.get(WIDTH),
				handleWidth = handle.get(WIDTH),
				offset      = toggle.hasClass(ACTIVE) ? (toggleWidth - handleWidth) : 0;

				start     = { pageX : e.pageX - offset, pageY : e.pageY };
				touchMove = false;
			
				Y.log('Move: offset:' + offset + 'e.pageX: ' + e.pageX + 'pageY' + e.pageX);
			
			},'body','.toggle',this)
		);
		
		this._handles.push(
			Y.delegate('gesturemove', function (e) {
				/*
				if (e.touches.length > 1) {
					return; // Exit if a pinch
				}*/

				var toggle = e.currentTarget,
				handle      = toggle.one(HANDLE),
				//current     = e.touches[0],
				current 	= e,
				toggleWidth = toggle.get(WIDTH),
				handleWidth = handle.get(WIDTH),
				offset      = toggleWidth - handleWidth;

				touchMove = true;
				distanceX = current.pageX - start.pageX;

				Y.log('Move: distanceX:' + distanceX + 'current.pageX: ' + current.pageX + 'start.pageX' + start.pageX);

				if (Math.abs(distanceX) < Math.abs(current.pageY - start.pageY) || toggle.previous(CHECKBOX).get(DISABLED)) {
					return;
				}

				e.preventDefault();

				if (distanceX < 0) {
					return (handle.setStyle(WEBKITTRANSFORM,TRANSLATE3D + '(0,0,0)'));
				}
				if (distanceX > offset) {
					return (handle.setStyle(WEBKITTRANSFORM, TRANSLATE3D + '(' + offset + 'px,0,0)'));
				}

				handle.setStyle(WEBKITTRANSFORM, TRANSLATE3D + '(' + distanceX + 'px,0,0)');

				toggle.toggleClass(ACTIVE,(distanceX > (toggleWidth/2 - handleWidth/2)));
			
			},'body','.toggle',this)
		);
		
		this._handles.push(
			Y.delegate('gesturemoveend', function (e) {

				var toggle = e.currentTarget,
				handle      = toggle.one(HANDLE),
				toggleWidth = toggle.get(WIDTH),
				handleWidth = handle.get(WIDTH),
				offset      = (toggleWidth - handleWidth),
				slideOn     = (!touchMove && !toggle.hasClass(ACTIVE)) || (touchMove && (distanceX > (toggleWidth/2 - handleWidth/2)));

				if(toggle.previous(CHECKBOX).get(DISABLED))
					return;

				if (slideOn) {
					handle.setStyle(WEBKITTRANSFORM, TRANSLATE3D + '(' + offset + 'px,0,0)');
				} else {
					handle.setStyle(WEBKITTRANSFORM, TRANSLATE3D + '(0,0,0)');
				}

				Y.log('MoveEnd: slideOn: ' + slideOn);

				toggle.toggleClass(ACTIVE, slideOn)
				.previous(CHECKBOX).set('checked',slideOn);
				
				this.fire('toggle', {
					isActive: slideOn
				});

				touchMove = false;
				toggle    = false;
			
			},'body','.toggle',this)
		);
	},
	destructor:function(){

		for(var x=0;x < this._handles.length;x++){
			this._handles[x].detach();
		}
	
		this._handles = null;
	}
});

Y.MSA.Checkbox = Checkbox;


}, 'gallery-2014.03.12-23-08', {
    "skinnable": "true",
    "requires": [
        "node-base",
        "base",
        "event-base",
        "event-move",
        "event-delegate",
        "node-event-delegate",
        "node-style"
    ],
    "optional": [
        ""
    ]
});
