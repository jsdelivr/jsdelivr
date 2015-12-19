/**
Textualizer v2.5.0
@author Kirollos Risk

Dual licensed under the MIT or GPL Version 2 licenses.

Copyright (c) 2011 Kirollos Risk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function ($, window) {

    "use strict";

    var Textualizer,

        COMMON_CHARACTER_ARRANGE_DELAY = 1000,
        REMAINING_CHARACTERS_DELAY = 500,
        EFFECT_DURATION = 2000,
        REMAINING_CHARACTERS_APPEARANCE_MAX_DELAY = 2000,
        REMOVE_CHARACTERS_MAX_DELAY = 2000,

        EVENT_CHANGED = 'textualizer.changed';

    // Gets the computed style of an element
    function getStyle(element) {

        var computedStyle, key, camelCasedStyle, i, len, styleList = {};

        if (window.getComputedStyle) {
            computedStyle = window.getComputedStyle(element, null);

            if (computedStyle.length) {
                for (i = 0, len = computedStyle.length; i < len; i++) {
                    camelCasedStyle = computedStyle[i].replace(/\-([a-z])/, function (a, b) {
                        return b.toUpperCase();
                    });

                    styleList[camelCasedStyle] = computedStyle.getPropertyValue(computedStyle[i]);
                }
            } else {
                for (key in computedStyle) {
                    if (typeof computedStyle[key] !== 'function' && key !== 'length') {
                        styleList[key] = computedStyle[key];
                    }
                }
            }
        } else {
            computedStyle = element.currentStyle || element.style;

            for (key in computedStyle) {
                if (Object.prototype.hasOwnProperty.call(computedStyle, key)) {
                    styleList[key] = computedStyle[key];
                }
            }
        }

        return styleList;
    }

    function Character() {
        this.character = null; // A character
        this.domNode = null; // The span element that wraps around the character
        this.pos = null; // The domNode position
        this.used = false;
        this.inserted = false;
        this.visited = false;
    }

    function Snippet() {
        this.str = ''; // The text string
        this.characterList = []; // Array of ch objects
    }

    Snippet.prototype = {
        // Loops through <characterList>, and find the first character that matches <val>, and hasn't been already used.
        use: function (val) {
            var ch = null;

            $.each(this.characterList, function () {
                if (this.character === val && !this.used) {
                    this.used = true;
                    ch = this;
                    return false; // break;
                }
            });

            return ch;
        },
        // Resets ever character in <characterList>
        reset: function () {
            $.each(this.characterList, function () {
                this.inserted = false;
                this.used = false;
            });
        }
    };

    Textualizer = function ($element, data, options) {
        var self = this,
            list = [],
            snippets,

            index, previous, showCharEffect = null,

            playing = false,
            paused = false,

            elementHeight, position,

            $clone, $container, $phantomContainer;

        // If an effect is chosen, then look for it in the list of effects
        if (options.effect !== 'random') {
            $.each($.fn.textualizer.effects, function () {
                if (this[0] === options.effect) {
                    showCharEffect = this[1];
                    return false; // break;
                }
            });
        }

        // Clone the target element, and remove the id attribute (if it has one)
        // Why remove the id? Cuz when we clone an element, the id is also copied.  That's a very bad thing,
        $clone = $element.clone().removeAttr('id').appendTo(window.document.body);

        // Copy all the styles.  This is especially necessary if the clone was being styled by id in a stylesheet)
        $clone.css(getStyle($element[0]));

        // Note that the clone needs to be visible so we can do the proper calculation
        // of the position of every character.  Ergo, move the clone outside of the window's
        // visible area.
        $clone.css({
            position: 'absolute',
            top: '-1000px'
        });

        $phantomContainer = $('<div />').css({
            'position': 'relative',
            'visibility': 'hidden'
        }).appendTo($clone);

        // Make sure any animating character disappear when outside the boundaries of
        // the element
        $element.css('overflow', 'hidden');

        // Contains transitioning text
        $container = $('<div />').css('position', 'relative').appendTo($element);

        elementHeight = $element.height();

        position = {
            bottom: elementHeight
        };

        function positionSnippet(snippet, phantomSnippets) {
            // If options.centered is true, then we need to center the text.
            // This cannot be done solely with CSS, because of the absolutely positioned characters
            // within a relative container.  Ergo, to achieve a vertically-aligned look, do
            // the following simple math:
            var yOffset = options.centered ? (elementHeight - $phantomContainer.height()) / 2 : 0;

            // Figure out the positioning, and clone the character's domNode
            $.each(phantomSnippets, function (index, c) {
                c.pos = c.domNode.position();
                c.domNode = c.domNode.clone();

                c.pos.top += yOffset;

                c.domNode.css({
                    'left': c.pos.left,
                    'top': c.pos.top,
                    'position': 'absolute'
                });

                snippet.characterList.push(c);
            });

            $phantomContainer.html('');
        }

        /* PRIVATE FUNCTIONS */

        // Add all chars first to the phantom container. Let the browser deal with the formatting.
        function addCharsToSnippet(i) {
            var phantomSnippets = [],
                snippet = new Snippet(),
                j, ch, c, len;

            snippet.str = list[i];
            snippets.push(snippet);

            for (j = 0, len = snippet.str.length; j < len; j++) {
                ch = snippet.str.charAt(j);

                if (ch === '') {
                    $phantomContainer.append(' ');
                } else {
                    c = new Character();
                    c.character = ch;
                    c.domNode = $('<span/>').text(ch);

                    $phantomContainer.append(c.domNode);
                    phantomSnippets.push(c);
                }
            }

            positionSnippet(snippet, phantomSnippets);

            return snippet;
        }

        function getHideEffect() {
            var dfd, eff;

            eff = [

            function (target) {
                dfd = $.Deferred();
                target.animate({
                    top: position.bottom,
                    opacity: 'hide'
                }, dfd.resolve);
                return dfd.promise();
            }, function (target) {
                dfd = $.Deferred();
                target.fadeOut(1000, dfd.resolve);
                return dfd.promise();
            }];

            return eff[Math.floor(Math.random() * eff.length)];
        }

        function removeCharacters(previousSnippet, currentSnippet) {
            var keepList = [],
                removeList = [],
                finalDfd = $.Deferred(),
                hideEffect = getHideEffect(),
                currChar;

            // For every character in the previous text, check if it exists in the current text.
            // YES ==> keep the character in the DOM
            // NO ==> remove the character from the DOM
            $.each(previousSnippet.characterList, function (index, prevChar) {
                currChar = currentSnippet.use(prevChar.character);

                if (currChar) {
                    currChar.domNode = prevChar.domNode; // use the previous DOM domNode
                    currChar.inserted = true;

                    keepList.push(currChar);
                } else {
                    (function hideCharacter(deferred) {
                        removeList.push(deferred);
                        hideEffect(prevChar.domNode.delay(Math.random() * REMOVE_CHARACTERS_MAX_DELAY)).done(function () {
                            prevChar.domNode.remove();
                            deferred.resolve();
                        });
                    })($.Deferred());
                }
            });

            $.when.apply(null, removeList).done(function () {
                return finalDfd.resolve(keepList);
            });

            return finalDfd.promise();
        }

        function showCharacters(snippet) {
            var effects = $.fn.textualizer.effects,

                effect = options.effect === 'random' ? effects[Math.floor(Math.random() * (effects.length - 2)) + 1][1] : showCharEffect,

                finalDfd = $.Deferred(),
                animationDfdList = [];

            // Iterate through all ch objects
            $.each(snippet.characterList, function (index, ch) {
                // If the character has not been already inserted, animate it, with a delay
                if (!ch.inserted) {

                    ch.domNode.css({
                        'left': ch.pos.left,
                        'top': ch.pos.top
                    });

                    (function animateCharacter(deferred) {
                        window.setTimeout(function () {
                            effect({
                                item: ch,
                                container: $container,
                                dfd: deferred
                            });
                        }, Math.random() * REMAINING_CHARACTERS_APPEARANCE_MAX_DELAY);
                        animationDfdList.push(deferred);
                    })($.Deferred());

                }
            });

            // When all characters have finished moving to their position, resolve the final promise
            $.when.apply(null, animationDfdList).done(function () {
                finalDfd.resolve();
            });

            return finalDfd.promise();
        }

        function moveAndShowRemainingCharacters(characters, currentSnippet) {
            var finalDfd = $.Deferred(),
                rearrangeDfdList = [];

            // Move charactes that are common to their new position
            window.setTimeout(function () {
                $.each(characters, function (index, item) {

                    (function rearrangeCharacters(deferred) {
                        item.domNode.animate({
                            'left': item.pos.left,
                            'top': item.pos.top
                        }, options.rearrangeDuration, deferred.resolve);
                        rearrangeDfdList.push(deferred.promise());
                    })($.Deferred());

                });
                // When all the characters have moved to their new position, show the remaining characters
                $.when.apply(null, rearrangeDfdList).done(function () {
                    window.setTimeout(function () {
                        showCharacters(currentSnippet).done(function () {
                            finalDfd.resolve();
                        });
                    }, REMAINING_CHARACTERS_DELAY);
                });
            }, COMMON_CHARACTER_ARRANGE_DELAY);

            return finalDfd.promise();
        }

        function rotater() {
            // If we've reached the last snippet
            if (index === list.length - 1) {

                // Reset the position of every character in every snippet
                $.each(snippets, function (j, snippet) {
                    snippet.reset();
                });
                index = -1;

                // If loop=false, pause (i.e., pause at this last blurb)
                if (!options.loop) {
                    self.pause();
                }
            }

            index++;
            next(index); // rotate the next snippet
        }

        function rotate(i) {
            var dfd = $.Deferred(),
                current = snippets[i];

            // If this is the first time the blurb is encountered, each character in the blurb is wrapped in
            // a span and appended to an invisible container, thus we're able to calculate the character's position
            if (!current) {
                current = addCharsToSnippet(i);
            }

            if (previous) {
                removeCharacters(previous, current).done(function (characters) {
                    moveAndShowRemainingCharacters(characters, current).done(function () {
                        dfd.resolve();
                    });
                });

            } else {
                showCharacters(current).done(function () {
                    dfd.resolve();
                });
            }

            previous = current;

            return dfd.promise();
        }

        function next(i) {
            if (paused) {
                return;
            }

            // <rotate> returns a promise, which completes when a blurb has finished animating.  When that
            // promise is fulfilled, transition to the next blurb.
            rotate(i).done(function () {
                $element.trigger(EVENT_CHANGED, {
                    index: i
                });
                window.setTimeout(rotater, options.duration);
            });
        }

        /* PRIVILEDGED FUNCTIONS */

        this.data = function (dataSource) {
            this.stop();
            list = dataSource;
            snippets = [];
        };

        this.stop = function () {
            this.pause();
            playing = false;
            previous = null;
            index = 0;
            $container.empty();
            $phantomContainer.empty();
        };

        this.pause = function () {
            paused = true;
            playing = false;
        };

        this.start = function () {
            if (list.length === 0 || playing) {
                return;
            }

            index = index || 0;
            playing = true;
            paused = false;

            next(index);
        };

        this.destroy = function () {
            $container.parent().removeData('textualizer').end().remove();

            $phantomContainer.remove();
        };

        if (data && data instanceof Array) {
            this.data(data);
        }
    };

    $.fn.textualizer = function ( /*args*/ ) {
        var args = arguments,
            snippets, options, instance, txtlzr;

        // Creates a textualizer instance (if it doesn't already exist)
        txtlzr = (function ($element) {

            instance = $element.data('textualizer');

            if (!instance) {
                snippets = [];

                if (args.length === 1 && args[0] instanceof Array) {
                    snippets = args[0];
                } else if (args.length === 1 && typeof args[0] === 'object') {
                    options = args[0];
                } else if (args.length === 2) {
                    snippets = args[0];
                    options = args[1];
                }

                if (snippets.length === 0) {
                    $element.find('p').each(function () {
                        snippets.push($(this).text());
                    });
                }

                // Clear the contents in the container, since this is where the blurbs will go
                $element.html("");

                // Create a textualizer instance, and store in the HTML node's metadata
                instance = new Textualizer($element, snippets, $.extend({}, $.fn.textualizer.defaults, options));
                $element.data('textualizer', instance);
            }

            return instance;

        })(this);

        if (typeof args[0] === 'string' && txtlzr[args[0]]) {
            txtlzr[args[0]].apply(txtlzr, Array.prototype.slice.call(args, 1));
        }

        return this;
    };

    $.fn.textualizer.defaults = {
        effect: 'random',
        duration: 2000,
        rearrangeDuration: 1000,
        centered: false,
        loop: true
    };

    // Effects for characters transition+animation. Customize as you please
    $.fn.textualizer.effects = [
        ['none', function (obj) {
            obj.container.append(obj.item.domNode.show());
        }],
        ['fadeIn', function (obj) {
            obj.container.append(obj.item.domNode.fadeIn(EFFECT_DURATION, obj.dfd.resolve));
            return obj.dfd.promise();
        }],
        ['slideLeft', function (obj) {
            obj.item.domNode.appendTo(obj.container).css({
                'left': -1000
            }).show().animate({
                'left': obj.item.pos.left
            }, EFFECT_DURATION, obj.dfd.resolve);

            return obj.dfd.promise();
        }],
        ['slideTop', function (obj) {
            obj.item.domNode.appendTo(obj.container).css({
                'top': -1000
            }).show().animate({
                'top': obj.item.pos.top
            }, EFFECT_DURATION, obj.dfd.resolve);

            return obj.dfd.promise();
        }]
    ];

})(jQuery, window);