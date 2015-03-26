/**
 * Durandal 2.1.0 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * The entrance transition module.
 * @module entrance
 * @requires system
 * @requires composition
 * @requires jquery
 */
define(['durandal/system', 'durandal/composition', 'jquery'], function(system, composition, $) {
    var fadeOutDuration = 100;
    var endValues = {
        left: '0px',
        opacity: 1
    };
    var clearValues = {
        left: '',
        top: '',
        right: '',
        bottom:'',
        position:'',
        opacity: ''
    };

    var isIE = navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/MSIE/);

    var animation = false,
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        elm = document.createElement('div');

    if(elm.style.animationName !== undefined) {
        animation = true;
    }

    if(!animation) {
        for(var i = 0; i < domPrefixes.length; i++) {
            if(elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                animation = true;
                break;
            }
        }
    }

    if(animation) {
        if(isIE){
            system.log('Using CSS3/jQuery mixed animations.');
        }else{
            system.log('Using CSS3 animations.');
        }
    } else {
        system.log('Using jQuery animations.');
    }

    function removeAnimationClasses(ele, fadeOnly){
        ele.classList.remove(fadeOnly ? 'entrance-in-fade' : 'entrance-in');
        ele.classList.remove('entrance-out');
    }

    /**
     * @class EntranceModule
     * @constructor
     */
    var entrance = function(context) {
        return system.defer(function(dfd) {
            function endTransition() {
                dfd.resolve();
            }

            function scrollIfNeeded() {
                if (!context.keepScrollPosition) {
                    $(document).scrollTop(0);
                }
            }

            if (!context.child) {
                $(context.activeView).fadeOut(fadeOutDuration, endTransition);
            } else {
                var duration = context.duration || 500;
                var $child = $(context.child);
                var fadeOnly = !!context.fadeOnly;
                var startValues = {
                    display: 'block',
                    opacity: 0,
                    position: 'absolute',
                    left: fadeOnly || animation ? '0px' : '20px',
                    right: 0,
                    top: 0,
                    bottom: 0
                };

                function startTransition() {
                    scrollIfNeeded();
                    context.triggerAttach();

                    if (animation) {
                        removeAnimationClasses(context.child, fadeOnly);
                        context.child.classList.add(fadeOnly ? 'entrance-in-fade' : 'entrance-in');
                        setTimeout(function () {
                            removeAnimationClasses(context.child, fadeOnly);
                            if(context.activeView){
                                removeAnimationClasses(context.activeView, fadeOnly);
                            }
                            $child.css(clearValues);
                            endTransition();
                        }, duration);
                    } else {
                        $child.animate(endValues, {
                            duration: duration,
                            easing: 'swing',
                            always: function() {
                                $child.css(clearValues);
                                endTransition();
                            }
                        });
                    }
                }

                $child.css(startValues);

                if(context.activeView) {
                    if (animation && !isIE) {
                        removeAnimationClasses(context.activeView, fadeOnly);
                        context.activeView.classList.add('entrance-out');
                        setTimeout(startTransition, fadeOutDuration);
                    } else {
                        $(context.activeView).fadeOut({ duration: fadeOutDuration, always: startTransition });
                    }
                } else {
                    startTransition();
                }
            }
        }).promise();
    };

    return entrance;
});
