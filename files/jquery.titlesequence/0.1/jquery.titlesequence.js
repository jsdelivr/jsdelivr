/*
 * jQuery titleSequence Plugin
 *
 * Copyright (c) 2012 Grant McLean <grant@mclean.net.nz>
 * Dual licensed under the MIT or GPL Version 2 licenses or later.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */

(function($) {

    var next_cue = function(cue) {
        var seq = this;
        if(!cue) {
            this.i  = this.i + 1;
            if(this.i > this.sequence.length) {  // Sequence is done
                return;
            }
            cue = this.sequence[ this.i - 1 ];
        }
        if(typeof(cue) === 'function') {
            return cue(this);
        }
        if(cue.delete) {
            $(cue.delete).remove();
        }
        var target;
        if(cue.selector) {
            target = $(cue.selector);
        }
        if(cue.content !== undefined) {
            if(!target) {
                target = $('<div />');
            }
            target.html( cue.content );
        }
        if(cue.id) {
            target.attr('id', cue.id);
        }
        if(cue.class) {
            target.addClass(cue.class);
        }
        if(cue.css) {
            target.css(cue.css);
        }
        if(cue.content !== undefined) {
            if(!cue.selector) {
                var parent = cue.container ? this.el.find(cue.container) : this.el;
                parent.append(target);
            }
        }
        var pause = cue.pause || 0;
        if(cue.duration) {
            var pause_cue = cue.pause ? {pause: cue.pause} : undefined;
            if(cue.no_wait) {
                target.animate(
                    cue.animate,
                    cue.duration * this.time_factor,
                    cue.easing || 'swing'
                );
                return seq.next_cue(pause_cue);
            }
            if(target.length === 1) {
                return target.animate(
                    cue.animate,
                    cue.duration * this.time_factor,
                    cue.easing || 'swing',
                    function() { seq.next_cue(pause_cue); }
                );
            }
            else {
                target.animate(
                    cue.animate,
                    cue.duration * this.time_factor,
                    cue.easing || 'swing'
                );
                pause = pause + cue.duration;
            }
        }
        if(pause > 0) {
            return setTimeout(function() { seq.next_cue(); }, pause * this.time_factor);
        }
        else {
            return seq.next_cue();
        }
    };

    $.fn.titleSequence = function(sequence, options) {
        $(this).each(function(x) {
            var title_sequence = $.extend({
                el: $(this),
                i: 0,
                sequence: sequence,
                next_cue: next_cue,
                time_factor: 1
            }, options);
            title_sequence.next_cue();
        });
        return this;
    };

})(jQuery);

