/**
 *	UI Layout Callbacks Package
 *
 *	NOTE: These callbacks must load AFTER the jquery.layout...js library loads
 *
 *	Updated:	2011-07-10
 *	Author:		Kevin Dalman (kevin@jquery-dev.com)
 */
;(function(b){var c=b.layout;if(!c.callbacks)c.callbacks={};if(!c.defaults)c.defaults={north:{},south:{},east:{},west:{},center:{}};c.callbacks.resizePaneAccordions=function(d,a){(a.jquery?a:b(a.panel)).find(".ui-accordion:visible").each(function(){var a=b(this);a.data("accordion")&&a.accordion("resize")})};c.callbacks.resizeTabLayout=function(d,a){(a.jquery?a:b(a.panel)).filter(":visible").find(".ui-layout-container:visible").andSelf().each(function(){var a=b(this).data("layout");a&&a.resizeAll()})};
for(var i=0;i<4;i++)c.defaults[["north","south","east","west"][i]].pseudoClose={hideObject:"iframe",skipIE:!1};c.callbacks.pseudoClose=function(d,a,c,f){var g=b.extend({},b.layout.defaults[d].pseudoClose,f.pseudoClose);if(g.skipIE&&b.layout.browser.msie)return!0;g.hideObject==="object"&&(g.hideObject+=",embed");setTimeout(function(){var c=g.hideObject,c=c==="pane"||a[0].tagName===c.toUpperCase()?a:a.find(c),b=a.data("parentLayout"),h=b.state[d],e=h.pseudoClose||{};e.size?(e.resizable&&b.enableResizable(d),
f.minSize=e.minSize,b.setSizeLimits(d),b.sizePane(d,e.size),e={},c.css("visibility","hidden").css("visibility","visible")):(e.size=h.size,e.minSize=f.minSize,f.minSize=0,e.resizable=f.resizable,b.disableResizable(d),b.setSizeLimits(d),b.sizePane(d,h.minSize),c.css("visibility","hidden"));h.pseudoClose=e},50);return!1}})(jQuery);