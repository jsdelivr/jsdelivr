YUI.add('gallery-slideshow-base', function(Y) {

function Slideshow(config) {
    Slideshow.superclass.constructor.apply(this, arguments);
}

Slideshow.PAUSE_TIME = 5;
Slideshow.NAME = 'slideshow';
Slideshow.ATTRS = {
    pause_time: {
        value: Slideshow.PAUSE_TIME,
        setter: function(val) {
            return this._set_pause_time(val);
        }
    },
    auto_advance: { value: true },
    slides: { value: [] },
    current_slide: { 
        value: 0,
        validator: function(val) {
            return this._validate_current_slide(val);
        }
    },
    slide_count: { value: 0 },
    activate_play_pause_buttons: { value: true },
    play_button: { value: null },
    pause_button: { value: null },
    activate_next_prev_buttons: { value: true },
    next_button: { value: null },
    prev_button: { value: null },
    activate_slide_buttons: { value: true },
    slide_buttons: {value: [] }
};
// The CSS selectors
Slideshow.AUTO_SLIDESHOW_SELECTOR = '.slideshow';
Slideshow.SLIDE_SELECTOR = '.slide';
Slideshow.CURRENT_CLASS = 'current';
Slideshow.PLAY_BUTTON_SELECTOR = '.play';
Slideshow.PAUSE_BUTTON_SELECTOR = '.pause';
Slideshow.NEXT_BUTTON_SELECTOR = '.next';
Slideshow.PREV_BUTTON_SELECTOR = '.previous';
Slideshow.BUTTON_SELECTOR = '.slideSelector';
Slideshow.INACTIVE_CLASS = 'inactive';

Slideshow.HTML_PARSER = {
    slides: function (contentBox) {
        var slide_nodes = contentBox.all(Slideshow.SLIDE_SELECTOR);
        if (slide_nodes.size() === 0) {
            slide_nodes = contentBox.get('children');
        }
        return slide_nodes;
    },
    play_button: function(contentBox) {
        return contentBox.all(Slideshow.PLAY_BUTTON_SELECTOR);
    },
    pause_button: function(contentBox) {
        return contentBox.all(Slideshow.PAUSE_BUTTON_SELECTOR);
    },
    next_button: function(contentBox) {
        return contentBox.all(Slideshow.NEXT_BUTTON_SELECTOR);
    },
    prev_button: function(contentBox) {
        return contentBox.all(Slideshow.PREV_BUTTON_SELECTOR);
    },
    slide_buttons: function(contentBox) {
        return contentBox.all(Slideshow.BUTTON_SELECTOR);
    }
};

Y.extend(Slideshow, Y.Widget, {
    initializer: function() {
        // Get how many slides there are
        var slides = this.get('slides'),
            slide_count = slides.size(),
            current_slide = Y.Array.indexOf(slides.hasClass(Slideshow.CURRENT_CLASS), true);
        
        this.set('slide_count', slide_count);
        if (current_slide > -1) {
            this.set('current_slide', current_slide);
        } else {
            // No current slide so add the class to the first slide
            slides.item(0).addClass(Slideshow.CURRENT_CLASS);
        }
        slides.item(this.get('current_slide')).addClass(Slideshow.CURRENT_CLASS);
        this.display_slide = this.get('current_slide');
        this._after_display();

        if (this.get('activate_play_pause_buttons')) {
            this._init_play_pause_buttons();
        }
        
        if (this.get('activate_next_prev_buttons')) {
            this._init_next_prev_buttons();
        }
        
        if (this.get('activate_slide_buttons')) {
            this._init_buttons();
        }
        this.initial_slide = true;
    },
    
    syncUI: function() {
        this._update_slide_display();
        if (this.get('auto_advance')) {
            this._pause();
            
        }
    },
    
    run: function() {
        this.set('auto_advance', true);
        this.advance();
    },
    
    stop: function() {
        this.timer.cancel();
        this.set('auto_advance', false);
    },
    
    show_slide: function(slide_number) {
        this.timer.cancel();
        if (slide_number != this.get('current_slide')) {
            this.set('current_slide', slide_number);        
            this.syncUI();
        }

    },
    
    _display_slide: function(slide_number) {
        this._before_display();
        this.get('slides').item(slide_number).addClass(Slideshow.CURRENT_CLASS);
        this._after_display();
    },
    _before_display: function() {
        this.fire('slideshow:before-slide-displayed', {
            slide: this.get('slides').item(this.display_slide), 
            slide_number: this.display_slide
        });
    },
    _after_display: function() {
        this.fire('slideshow:slide-displayed', {
            slide: this.get('slides').item(this.display_slide),
            slide_number: this.display_slide
        });
    },

    _hide_slide: function(slide_number) {
        this._before_hide();
        this.get('slides').item(slide_number).removeClass(Slideshow.CURRENT_CLASS);
        this._after_hide();
    },
    _before_hide: function() {
        this.fire('slideshow:before-slide-hidden', {
            slide: this.get('slides').item(this.hide_slide), 
            slide_number: this.hide_slide
        });
    },
    _after_hide: function() {
        this.fire('slideshow:slide-hidden', {
            slide: this.get('slides').item(this.hide_slide),
            slide_number: this.hide_slide
        });
    },
    
    advance: function() {
        this.show_slide(this._get_next_slide());
    },

    previous: function() {
        this.show_slide(this._get_previous_slide());
    },
    
    _pause: function() {
        this.timer = Y.later(this.get('pause_time'), this, 'advance');
    },
    
    _get_next_slide: function() {
        var next_slide = this.get('current_slide') + 1;
        if (next_slide >= this.get('slide_count')) {
            return 0;
        } else {
            return next_slide;
        }
    },

    _get_previous_slide: function() {
        var prev_slide = this.get('current_slide') - 1;
        if (prev_slide < 0) {
            return this.get('slide_count') - 1;
        } else {
            return prev_slide;
        }
    },
    
    _update_slide_display: function() {
        var current = this.get('current_slide'),
            count = this.get('slide_count'),
            slides = this.get('slides'),
            i;
            
        for (i = 0; i < count; i++) {
            if (i == current) {
                if (!slides.item(i).hasClass(Slideshow.CURRENT_CLASS)) {
                    this.display_slide = i;
                }
            } else {
                if (slides.item(i).hasClass(Slideshow.CURRENT_CLASS)) {
                    this.hide_slide = i;
                }
            }
        }
        
        // If this is the initial slide we don't want to do the transition as it will flicker
        if (this.initial_slide) {
            this.initial_slide = false;
        } else {
            if (this.display_slide >= 0) {
                this._display_slide(this.display_slide);
            }
            if (this.hide_slide >= 0) {
                this._hide_slide(this.hide_slide);
            }
        }
    },

    _toggle_play_pause: function() {
        if (this.get('activate_play_pause_buttons')) {
            if (this.play_btn) {
                if (this.get('auto_advance')) {
                    this.play_btn.addClass(Slideshow.INACTIVE_CLASS);
                } else {
                    this.play_btn.removeClass(Slideshow.INACTIVE_CLASS);
                }
            }
            if (this.pause_btn) {
                if (this.get('auto_advance')) {
                    this.pause_btn.removeClass(Slideshow.INACTIVE_CLASS);
                } else {
                    this.pause_btn.addClass(Slideshow.INACTIVE_CLASS);
                }
            }
        }
    },
    
    _init_play_pause_buttons: function() {
        this.play_btn = this.get('play_button');
        this.pause_btn = this.get('pause_button');
        this._toggle_play_pause();

        if (this.play_btn) {
            this.play_btn.on('click', function(e){
                e.preventDefault();
                this.fire('slideshow:play-clicked', {
                    slide: this.get('slides').item(this.get('current_slide')),
                    slide_number: this.get('current_slide')
                });
                this.run();
                this._toggle_play_pause();
            }, this);
        }

        if (this.pause_btn) {
            this.pause_btn.on('click', function(e){
                e.preventDefault();
                this.fire('slideshow:pause-clicked', {
                    slide: this.get('slides').item(this.get('current_slide')),
                    slide_number: this.get('current_slide')
                });
                this.stop();
                this._toggle_play_pause();
            }, this);
        }
    },

    _init_next_prev_buttons: function() {
        var next = this.get('next_button'),
            prev = this.get('prev_button');
        if (next) {
            next.on('click', function(e){
                e.preventDefault();
                this.stop();
                this.fire('slideshow:slide-selected', {
                    slide: this.get('slides').item(this._get_next_slide()),
                    slide_number: this._get_next_slide()
                });
                this.advance();
            }, this);
        }

        if (prev) {
            prev.on('click', function(e){
                e.preventDefault();
                this.stop();
                this.fire('slideshow:slide-selected', {
                    slide: this.get('slides').item(this._get_previous_slide()),
                    slide_number: this._get_previous_slide()
                });
                this.previous();
            }, this);
        }
    },

    _init_buttons: function() {
        var buttons = this.get('slide_buttons'),
            button_count = buttons.size(),
            slide_click, i;
        if (button_count > 0) {
            slide_click = function(e, slide_number) {
                e.preventDefault();
                this.stop();
                this.fire('slideshow:slide-selected', {
                    slide: this.get('slides').item(slide_number),
                    slide_number: slide_number
                });
                this.show_slide(slide_number);
            };

            // Setting up the on click functionality for each button
            for(i =0; i < button_count; i++) {
                buttons.item(i).on('click', slide_click, this, i);
                if (i == this.get('current_slide')) {
                    buttons.item(i).addClass('current');
                }
            }
            // Changing the current button as the slide changes
            this.on('slideshow:before-slide-displayed', function(e) {
                buttons.item(e.slide_number).addClass(Slideshow.CURRENT_CLASS);
            });
            this.on('slideshow:before-slide-hidden', function(e) {
                buttons.item(e.slide_number).removeClass(Slideshow.CURRENT_CLASS);
            });
        }
    },
    
    _applyParsedConfig : function(node, cfg, parsedCfg) {
        // mix instead of aggregate
        return (parsedCfg) ? Y.mix(cfg, parsedCfg, false) : cfg;
    },

    /*
     * Converts the seconds into milliseconds
     */
    _set_pause_time: function(val) {
        // Converting from seconds to microseconds
        return val * 1000;
    },
    
    _validate_current_slide: function(val) {
        var min = 0,
            max = this.get("slide_count");
        return (Y.Lang.isNumber(val) && val >= min && val <= max);
    }

});

Slideshow.auto = function(attrs) {
    if (!attrs) { attrs = {}; }
    var selector = attrs.selector || Slideshow.AUTO_SLIDESHOW_SELECTOR,
        pause_time = attrs.pause_time || Slideshow.PAUSE_TIME;

    Y.all(selector).each(function() {
        var slideshow_instance = new Slideshow({
            contentBox: this,
            pause_time: pause_time
        });
        slideshow_instance.render();
    });
};

Y.Slideshow = Slideshow;



}, 'gallery-2010.05.21-18-16' ,{requires:['node', 'event', 'widget']});
