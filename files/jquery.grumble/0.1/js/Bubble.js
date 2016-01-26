/**   (c) 2011 James Cryer, Huddle (www.huddle.com) 	*/
/**   http://jamescryer.github.com/grumble.js/ 		*/

(function($, window){

    var defaults = {
        type: '',
        text: '',
        top: 0,
        left: 0,
        angle: 45,
        size: 50,
        distance: 50,
        template: '<div class="grumble" style="display:none;filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\')">&#160;</div>',
        textTemplate: '<div class="grumble-text" style="display:none;"><div class="outer"><div class="inner">{text}</div></div></div>',
        context: null
    };

    window.GrumbleBubble = function(options){
    	
        this.options = $.extend({},defaults,options);
        this.context = $(this.options.context || $('body')); 
        this.css = {};
        this.create();
    };

    window.GrumbleBubble.prototype = {

        create: function(){
    	    var tmpl = window.GrumbleBubble.prototype.tmpl;
            this.bubble = $( tmpl(this.options.template) );
            this.text = $( tmpl(this.options.textTemplate, { text:this.options.text }));
            this.prepare();
        },

        /*
          the rotation is adjusted because the background image defaults to what would look like 45 degrees
          I dont like this, the code should be agnostic of the image and style
        */
        setBubbleRotation: function(){
            this.rotateDeg = this.options.angle - 45;
            if( this.rotateDeg < 0 ){
                this.rotateDeg += 360;
            }
        },

        prepare: function(){
            var isAlreadyInserted = this.bubble.get(0).parentNode;

			this.setBubbleRotation();

            this.applyStyles();

            if( isAlreadyInserted !== this.context){
                this.append();
            }

            this.rotate();
        },

        applyStyles: function(){

            this.setPosition();

            this.css.width = this.options.size;
            this.css.height = this.options.size;

            this.text
                .css(this.css)
                .addClass('grumble-text'+this.options.size);

            this.bubble
                .css(this.css)
                .addClass(this.options.type+'grumble'+this.options.size);

            // remember calculated position for use by external components
            this.realLeft = this.css.left;
            this.realTop = this.css.top;
        },

        setPosition: function(){
            var ratio = this.options.angle/-360,
                xRadius = Math.cos(ratio*2*Math.PI),
                yRadius = Math.sin(ratio*2*Math.PI),
                halfSize = this.options.size/2,
                sizeSquared = this.options.size*this.options.size,
                halfedHypotenuse = Math.sqrt(sizeSquared + sizeSquared)/2,
                top = (this.options.top+halfSize) - xRadius * (this.options.distance + halfedHypotenuse),
                left = (this.options.left-halfSize) - yRadius * (this.options.distance + halfedHypotenuse);

            this.css.top = top - this.options.size;
            this.css.left = left;
        },

        append: function(){
            var body = this.context;
            this.bubble.appendTo(body);
            this.text.appendTo(body);
        },

        rotate: function(){
            if(navigator.appName === 'Microsoft Internet Explorer' && window.document.documentMode < 10){
                this.ieRotate();
            } else {
                this.cssRotate();
            }
        },

        cssRotate: function(){
            this.bubble.css({
                '-moz-transform': 'rotate('+this.rotateDeg+'deg)',
                '-webkit-transform': 'rotate('+this.rotateDeg+'deg)',
				'-o-transform': 'rotate('+this.rotateDeg+'deg)',
                'transform': 'rotate('+this.rotateDeg+'deg)'
            });
        },

        ieRotate: function(){
            var deg = this.rotateDeg,
                deg2radians = Math.PI * 2 / 360,
                rad = deg * deg2radians,
                costheta = Math.cos(rad),
                sintheta = Math.sin(rad),
                element = this.bubble.get(0),
                width, height;

            // use Matrix filter
            element.filters.item(0).M11 = costheta;
            element.filters.item(0).M12 = -sintheta;
            element.filters.item(0).M21 = sintheta;
            element.filters.item(0).M22 = costheta;

            width = this.bubble.width();
            height = this.bubble.height();

            // adjust position, IE rotates from center but also increases the width and height
            this.bubble.css({
                left: this.css.left - ((width - this.options.size)/2),
                top: this.css.top - ((height - this.options.size)/2)
            });
        },

        adjust: function(options){
            $.extend(this.options,options);
            this.prepare();
        },
		
		tmpl: function(template, obj, escapeContent) {
			for (var key in obj) {
				if (obj[key] === null) obj[key] = '';
				if (typeof (obj[key]) === 'object' && obj[key].length) { obj[key] = obj[key].join(', '); }
				template = template.replace(new RegExp('{' + key + '}', 'g'), escapeContent ? escape(obj[key]) : obj[key]);
			}
			return template;
		}
		
    };
}($, window));
