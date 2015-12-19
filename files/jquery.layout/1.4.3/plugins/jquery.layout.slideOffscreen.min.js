/**
 *	UI Layout Plugin: Slide-Offscreen Animation
 *
 *	Prevent panes from being 'hidden' so that an iframes/objects 
 *	does not reload/refresh when pane 'opens' again.
 *	This plug-in adds a new animation called "slideOffscreen".
 *	It is identical to the normal "slide" effect, but avoids hiding the element
 *
 *	Requires Layout 1.3.0.RC30.1 or later for Close offscreen
 *	Requires Layout 1.3.0.RC30.5 or later for Hide, initClosed & initHidden offscreen
 *
 *	Version:	1.1 - 2012-11-18
 *	Author:		Kevin Dalman (kevin@jquery-dev.com)
 *	@preserve	jquery.layout.slideOffscreen-1.1.js
 */
(function(d){var b=d.layout;d.effects&&(b.defaults.panes.useOffscreenClose=!1,b.plugins&&(b.plugins.effects.slideOffscreen=!0),b.effects.slideOffscreen=d.extend(!0,{},b.effects.slide),d.effects.slideOffscreen=function(g){return this.queue(function(){var c=d.effects,i=g.options,a=d(this),e=a.data("layoutEdge"),j=a.data("parentLayout").state,e=j[e].size,f=this.style,k="show"==c.setMode(a,i.mode||"show"),c=i.direction||"left",l="up"==c||"down"==c?"top":"left",m="up"==c||"left"==c,p=b.config.offscreenCSS||
{},h=b.config.offscreenReset,n={};n[l]=(k?m?"+=":"-=":m?"-=":"+=")+e;k?(a.data("offscreenResetTop",{top:f.top,bottom:f.bottom}),m?a.css(l,isNaN(e)?"-"+e:-e):"right"===c?a.css({left:j.container.layoutWidth,right:"auto"}):a.css({top:j.container.layoutHeight,bottom:"auto"}),"top"===l&&a.css(a.data(h)||{})):(a.data("offscreenResetTop",{top:f.top,bottom:f.bottom}),a.data(h,{left:f.left,right:f.right}));a.show().animate(n,{queue:!1,duration:g.duration,easing:i.easing,complete:function(){a.data("offscreenResetTop")&&
a.css(a.data("offscreenResetTop")).removeData("offscreenResetTop");k?a.css(a.data(h)||{}).removeData(h):a.css(p);g.callback&&g.callback.apply(this,arguments);a.dequeue()}})})})})(jQuery);