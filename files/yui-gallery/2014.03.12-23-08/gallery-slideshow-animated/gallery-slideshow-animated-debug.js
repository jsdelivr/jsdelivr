YUI.add('gallery-slideshow-animated', function(Y) {

    /***********************************
    * Functionality to add animation to the slideshow
    *
    ***********************************/
    function SlideshowAnimated(config) { 
        SlideshowAnimated.superclass.constructor.apply(this, arguments);
    }

    SlideshowAnimated.NAME = 'slideshowanimated';
    SlideshowAnimated.ANIMATION_DURATION = 0.5;
    SlideshowAnimated.EASING = Y.Easing.easeNone;
    SlideshowAnimated.ATTRS = { 
        animation_out: { 
            value: {
                from: { opacity: 1},
                to: { opacity: 0 },
                duration: SlideshowAnimated.ANIMATION_DURATION,
                easing: SlideshowAnimated.EASING
            }
        },
        animation_in: { 
            value: {
                from: {opacity: 0},
                to: { opacity: 1 },
                duration: SlideshowAnimated.ANIMATION_DURATION,
                easing: SlideshowAnimated.EASING
            }
        },
        reverse_animation: { value: false }
    };


    Y.extend(SlideshowAnimated, Y.Slideshow, {
        initializer: function() {
            // Setup the display/hide animation
            if (this.get('animation_in')) {
                this.anim_in = new Y.Anim(this.get('animation_in'));
                this.anim_in.on('end', this._after_display, this);
                if (this.get('reverse_animation')) {
                    this.orig_anim_in = this.anim_in;
                    // Creating the reverse animation
                    this.reverse_anim_in = new Y.Anim(this.get('animation_out'));
                    this.reverse_anim_in.on('end', this._after_display, this);
                    this.reverse_anim_in.set('reverse', true);
                }
            } else {
                this.anim_in = null;
            }
            if (this.get('animation_in')) {
                this.anim_out = new Y.Anim(this.get('animation_out'));
                this.anim_out.on('end', this._after_hide, this);
                if (this.get('reverse_animation')) {
                    this.orig_anim_out = this.anim_out;
                    // Creating the reverse animation
                    this.reverse_anim_out = new Y.Anim(this.get('animation_in'));
                    this.reverse_anim_out.on('end', this._after_hide, this);
                    this.reverse_anim_out.set('reverse', true);
                }
            } else {
                this.anim_out = null;
            }

            this._prep_slides();

        },

        _prep_slides: function() {
            // Checking if the animation is setting the opacity
            // If it is then set all the non-current slides to the opacity
            var t = this.anim_out.get('to'),
                opacity = (parseInt(t.opacity, 10));
            if (!isNaN(opacity)) {
                this.get('slides').each(function(slide) {
                    if (!slide.hasClass(Y.Slideshow.CURRENT_CLASS)) {
                        slide.setStyle('opacity', opacity);
                    }
                });
            }
        },

        show_slide: function(slide_number) {
            this.timer.cancel();
            if (this._anim_running()) {
                Y.later(this.get('pause_time')/20, this, 'show_slide', slide_number);
            } else {
                if (slide_number != this.get('current_slide')) {
                    this.set('current_slide', slide_number);
                    this.syncUI();
                }
            }
        },

        _anim_running: function() {
            if (this.anim_in.get('running') || this.anim_out.get('running')) {  
                return true; 
            } else {
                return false;
            }
        },
        
        _display_slide: function(slide_number) {
            var slide = this.get('slides').item(slide_number);
            this._before_display();
            slide.addClass(Y.Slideshow.CURRENT_CLASS);
            this.anim_in.set('node', slide);
            this.anim_in.run();
        },
        
        _hide_slide: function(slide_number) {
            this._before_hide();
            this.anim_out.set('node', this.get('slides').item(slide_number));
            this.anim_out.run();
        },
        _after_hide: function() {
            this.get('slides').item(this.hide_slide).removeClass(Y.Slideshow.CURRENT_CLASS);
            this.fire('slideshow:slide-hidden', {
                slide: this.get('slides').item(this.hide_slide),
                slide_number: this.hide_slide
            });
        },
        advance: function() {
            if (this.get('reverse_animation')) {
                this.anim_in = this.orig_anim_in;
                this.anim_out = this.orig_anim_out;
            }
            this.anim_in.set('reverse', false);
            this.anim_out.set('reverse', false);
            this.show_slide(this._get_next_slide());
        },

        previous: function() {
            if (this.get('reverse_animation')) {
                this.anim_in = this.reverse_anim_in;
                this.anim_out = this.reverse_anim_out;
            }
            this.show_slide(this._get_previous_slide());
        }
    });

    /**
    * Panning slideshow
    *
    *
    **/
    function SlideshowPanned(config) { 
        SlideshowPanned.superclass.constructor.apply(this, arguments);
    }

    SlideshowPanned.NAME = 'slideshowpanned';
    SlideshowPanned.ATTRS = {
        container: { value: null }
    };
    // The CSS selectors
    SlideshowPanned.CONTAINER_SELECTOR = '.container';
    SlideshowPanned.HTML_PARSER = {
        container: function(contentBox) {
            return contentBox.one(SlideshowPanned.CONTAINER_SELECTOR);
        }
    };

    Y.extend(SlideshowPanned, SlideshowAnimated, {
        initializer: function() {
            var x, y,
                current_slide = this.get('slides').item(this.get('current_slide'));
            this.anim_in.set('node', this.get('container'));
            this.anim_in.on('end', this._after_hide, this); // The anim_in does the showing and hiding in this case.
            this.top_corner = {y: current_slide.getY(), x: current_slide.getX()};
            this.slide_start_positions = [];
            this.get('slides').each(function(slide) {
                y = slide.getY();
                x = slide.getX();
                this.slide_start_positions.push({
                    x: x - this.top_corner.x,
                    y: y - this.top_corner.y
                });
            }, this);
        },
        
        _prep_slides: function() {
            // Nothing currently needed
        },
        
        _container_location: function() {
            var con = this.get('container'),
                x = con.getX(),
                y = con.getY();
            return {x: x, y: y};
        },
        
        _display_slide: function(slide_number) {
            var slide_pos = this.slide_start_positions[slide_number],
                prev_pos = this.slide_start_positions[this.hide_slide],
                current_loc = this._container_location(),
                top = false,
                left = false,
                move_to = {};

            if (slide_pos.y != prev_pos.y) {
                // Not at the current location so have to move
                if (slide_pos.y < prev_pos.y) {
                    // Move the container down (+), 
                    // so items on the top are visible
                    top = (Math.abs(prev_pos.y) - Math.abs(slide_pos.y)) + current_loc.y - this.top_corner.y;
                } else {
                    // Move to the top (-)
                    top = (slide_pos.y - Math.abs(prev_pos.y) - current_loc.y + this.top_corner.y) * -1;
                }
            }
            if (top !== false) {
                move_to.top = top;
            }
                        
            if (slide_pos.x != prev_pos.x) {
                // Not at the current location so have to move
                if (slide_pos.x < prev_pos.x) {
                    // Move the container to the right (+), 
                    // so items on the left are visible
                    left = (Math.abs(prev_pos.x) - Math.abs(slide_pos.x)) + current_loc.x - this.top_corner.x;
                    //left = left + current_loc.x - slide_pos.x;
                } else {
                    // Move to the left (-)
                    left = (slide_pos.x - Math.abs(prev_pos.x) - current_loc.x + this.top_corner.x) * -1;
                }
            }
            if (left !== false) {
                move_to.left = left;
            }

            this._before_display();
            this.anim_in.set('to', move_to);
            
            this._before_hide();
            this.anim_in.run();
            this.get('slides').item(slide_number).addClass(Y.Slideshow.CURRENT_CLASS);
            this.get('slides').item(this.hide_slide).removeClass(Y.Slideshow.CURRENT_CLASS);
        },
        _hide_slide: function(slide_number) {
            // Do nothing for the panning slideshow
            // as the slide is hidden as part of the 
            // show slide 
        }
    });
//    SlideshowPanned = Y.Base.build("SlideshowPanned", SlideshowAnimated, [Panned]);
    
    /**
    * Auto Generation of slideshows
    *
    *
    **/
    
    SlideshowAnimated.AUTO_HORIZONTAL_CLASS = 'horizontalSlideshow';
    SlideshowAnimated.AUTO_CROSS_HORIZONTAL_CLASS = 'horizontalCrossSlideshow';
    SlideshowAnimated.AUTO_VERTICAL_CLASS = 'verticalSlideshow';
    SlideshowAnimated.AUTO_CROSS_VERTICAL_CLASS = 'verticalCrossSlideshow';
    SlideshowAnimated.AUTO_PANNING_CLASS = 'panningSlideshow';
    SlideshowAnimated.auto_shows = {};
    SlideshowAnimated._auto_get_slide = function(show_node) {
        var slide = show_node.one('.slide.current');
        if (! slide ) {
            slide = show_node.one('.slide');
            slide.addClass(Y.Slideshow.CURRENT_CLASS);
        }
        return slide;  
    };
    SlideshowAnimated._auto_merge_attrs = function(new_attrs, user_attrs) {
        var attrs = new_attrs, 
            duration = SlideshowAnimated.ANIMATION_DURATION,
            easing = SlideshowAnimated.EASING;
        if (user_attrs) {
            if (user_attrs.duration) {
                duration = user_attrs.duration;
            }
            if (user_attrs.easing) {
                easing = user_attrs.easing;
            }
            attrs = Y.merge(user_attrs, new_attrs);
        }
        if( attrs.animation_in ) {
            if (! attrs.animation_in.duration ) {
                attrs.animation_in.duration = duration;
            }
            if (! attrs.animation_in.easing ) {
                attrs.animation_in.easing = easing;
            }
        }
        if( attrs.animation_out ) {
            if (! attrs.animation_out.duration ) {
                attrs.animation_out.duration = duration;
            }
            if (! attrs.animation_out.easing ) {
                attrs.animation_out.easing = easing;
            }
        }
        return attrs;
    };
    SlideshowAnimated._auto_horizontal = function(show_node, show_class, user_attrs) {
        var slide = SlideshowAnimated._auto_get_slide(show_node), 
            width = parseInt(slide.getComputedStyle('width'), 10), 
            x, right_x, show_attrs;
            
        if (! width) {
            if(slide.getStyle('display').toLowerCase() == 'none') {
                slide.setStyle('display', 'block');
                width = parseInt(slide.getComputedStyle('width'), 10);
            }
        }
        x = parseInt(slide.getComputedStyle('left'), 10) || 0;
        right_x = x + width;
        
        if (show_class === SlideshowAnimated.AUTO_CROSS_HORIZONTAL_CLASS) {
            show_attrs = {
                animation_out: { from: { left: x }, to: {left: right_x} },
                animation_in: { from: {left: right_x }, to: {left: x} }
            };       
        } else {
            show_attrs = {
                animation_out: { from: { left: x }, to: {left: (-1 * right_x)} },
                animation_in: { from: {left: right_x }, to: {left: x} }
            };
        }
        show_attrs.contentBox = show_node;
        show_attrs.reverse_animation = { value: true };
        return new SlideshowAnimated(SlideshowAnimated._auto_merge_attrs(show_attrs, user_attrs));
    };
    SlideshowAnimated._auto_vertical = function(show_node, show_class, user_attrs) {
        var slide = SlideshowAnimated._auto_get_slide(show_node), 
            height = parseInt(slide.getComputedStyle('height'), 10),
            show_attrs;
        if (! height) {
            if(slide.getStyle('display').toLowerCase() == 'none') {
                slide.setStyle('display', 'block');
                height = parseInt(slide.getComputedStyle('height'), 10);
            }
        }

        if (show_class === SlideshowAnimated.AUTO_CROSS_VERTICAL_CLASS) {
            show_attrs = {
                animation_out: { from: { top: 0 }, to: {top: (-1 * height)} },
                animation_in: { from: {top: (-1 * height) }, to: {top: 0} }
            };       
        } else {
            show_attrs = {
                animation_out: { from: { top: 0 }, to: {top: height} },
                animation_in: { from: {top: (-1 * height) }, to: {top: 0} }
            };
        }
        show_attrs.contentBox = show_node;
        show_attrs.reverse_animation = { value: true };
        return new SlideshowAnimated(SlideshowAnimated._auto_merge_attrs(show_attrs, user_attrs));
    };    
    SlideshowAnimated.auto_shows[SlideshowAnimated.AUTO_HORIZONTAL_CLASS] = function(show_node, user_attrs) {
        return SlideshowAnimated._auto_horizontal(show_node, SlideshowAnimated.AUTO_HORIZONTAL_CLASS, user_attrs);
    };
    SlideshowAnimated.auto_shows[SlideshowAnimated.AUTO_CROSS_HORIZONTAL_CLASS] = function(show_node, user_attrs) {
        return SlideshowAnimated._auto_horizontal(show_node, SlideshowAnimated.AUTO_CROSS_HORIZONTAL_CLASS, user_attrs);
    };
    SlideshowAnimated.auto_shows[SlideshowAnimated.AUTO_VERTICAL_CLASS] = function(show_node, user_attrs) {
        return SlideshowAnimated._auto_vertical(show_node, SlideshowAnimated.AUTO_VERTICAL_CLASS, user_attrs);
    };
    SlideshowAnimated.auto_shows[SlideshowAnimated.AUTO_CROSS_VERTICAL_CLASS] = function(show_node, user_attrs) {
        return SlideshowAnimated._auto_vertical(show_node, SlideshowAnimated.AUTO_CROSS_VERTICAL_CLASS, user_attrs);
    };
    SlideshowAnimated.auto_shows[SlideshowAnimated.AUTO_PANNING_CLASS] = function(show_node, user_attrs) {
        return new SlideshowPanned(SlideshowAnimated._auto_merge_attrs({contentBox: show_node}, user_attrs));
    };

    SlideshowAnimated.auto = function(attrs) {
        var show_classes = [], show, c, i, len;
        for (c in SlideshowAnimated.auto_shows){
            if (SlideshowAnimated.auto_shows.hasOwnProperty(c)) {
                show_classes.push(c);
            }
        }
        Y.all(Y.Slideshow.AUTO_SLIDESHOW_SELECTOR).each(function() {
            show = false;
            for (i=0, len = show_classes.length; i < len; i++) {
                if (this.hasClass(show_classes[i])){
                    show = SlideshowAnimated.auto_shows[show_classes[i]](this, attrs);
                    break;
                }
            }
            if (!show) {
                show = new SlideshowAnimated(SlideshowAnimated._auto_merge_attrs({contentBox: this}, attrs));
            }
            show.render();
        });
    };


    Y.SlideshowAnimated = SlideshowAnimated;
    Y.SlideshowPanned = SlideshowPanned;


}, 'gallery-2010.05.21-18-16' ,{requires:['node', 'event', 'widget', 'anim', 'gallery-slideshow-base']});
