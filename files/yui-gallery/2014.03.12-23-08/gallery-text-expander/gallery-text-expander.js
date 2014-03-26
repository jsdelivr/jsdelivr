YUI.add('gallery-text-expander', function(Y) {

var TextExpander = function(cfg) {
    TextExpander.superclass.constructor.apply(this, arguments);
};

TextExpander.NAME = "textExpander";
TextExpander.NS = "expander";

TextExpander.ATTRS = {
    line_height: {value: null},
    min_height: {value: null},
    max_height: {value: null}
};

Y.extend(TextExpander, Y.Plugin.Base, {

    initializer : function(cfg) {
        this.t_area = this.get("host");
        if (this.get('line_height')) {
            this.line_height_set = true;
        } else if(! this.get('line_height')) {
            if (this.t_area.get('lineHeight')) {
                this.set('line_height', this.t_area.get('lineHeight'));
                this.line_height_set = true;
            } else if (this.t_area.get('fontSize')) {
                this.set('line_height', this.t_area.get('fontSize'));
                this.line_height_set = true;
            } else {
                this.prev_scroll_height = this.t_area.get('scrollHeight');
                this.previous_line_height = null;
            }
        }
        if (! this.get('min_height')) {
            this.set('min_height', parseInt(this.t_area.getStyle('height'), 10));
        }
        if (! this.get('max_height')) {
            if (this.line_height_set) {
                this.set('max_height', this.line_height * 35);
            } else {
                this.set('max_height', 450);
            }
            
        }
        this.t_area.setStyle('overflow', 'hidden');
        
        this.t_area.on('keyup', function(e) {
            if (e.keyCode === 8 || e.keyCode === 46 || (e.keycode == 88 && (e.ctrlKey || e.metaKey))) {
                //Backspace or delete
                this.shrink_area();
            }
            this.enlarge_area();
        }, this);
        this.enlarge_area();
    },
    
    enlarge_area: function() {
        var area = this.t_area,
            h = parseInt(area.getStyle('height'), 10),
            new_h = 0,
            scroll_h = area.get('scrollHeight'),
            line_height = this.get('line_height') || (scroll_h - this.prev_scroll_height);
        
        if (scroll_h > h) {
            if (! this.line_height_set) {
                if (line_height > 50) {
                    // Most likely a paste so using the scroll difference would be wrong.
                    line_height = 0;
                } else if (line_height === this.previous_line_height) {
                    // If it's the same height twice in a row it's probably the normal line
                    // height.
                    this.set('line_height', line_height);
                    this.line_height_set = true;
                } else {
                    this.previous_line_height = line_height;
                }
                
            }
            new_h = Math.min(scroll_h+line_height, this.get('max_height'));
            area.setStyle('height', (new_h+'px'));
            this.set_overflow();
            this.prev_scroll_height = scroll_h+line_height;
        }       
    },
    
    shrink_area: function() {
        // This method is expensive on large text areas and creates some flicker
        // so we want to minimize it's use to only be shrinking the text area.
        var area = this.t_area, 
            current_len = area.get('value').length, 
            current_width = area.get('offsetWidth'),
            scroll_h = 0,
            h = 0;
        
        // First time through have to set the prev lengths, don't do this on 
        // initialize as it can take a bit to count and may not be needed.
        if (! this.prev_len) {
            this.prev_len = current_len;
        }
        if (! this.prev_width) {
            this.prev_with = current_width;
        }

        if (current_len < this.prev_len || current_width > this.prev_width) {
            area.setStyle('height', "1px");
            
            scroll_h = area.get('scrollHeight');
            h = Math.max(this.get('min_height'), scroll_h);
            
            area.setStyle('height', h + "px");
            this.set_overflow();
            this.prev_len = current_len; 
            this.prev_width = current_width; 
        }       
    },
    
    set_overflow: function() {
        this.t_area.setStyle('overflow', 
            (this.t_area.get('scrollHeight') > this.get('max_height') ? "auto" : "hidden")); 
    }
});
Y.TextExpander = TextExpander;


}, 'gallery-2010.03.23-17-54' ,{requires:['plugin']});
