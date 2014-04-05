/*************************************************
**  jQuery Masonry version v2.1.04
**  Copyright David DeSandro, licensed MIT
**  http://desandro.com/resources/jquery-masonry
**************************************************/
(function(a,b,c){"use strict";var d=b.event,e;d.special.smartresize={setup:function(){b(this).bind("resize",d.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",d.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",e&&clearTimeout(e),e=setTimeout(function(){jQuery.event.handle.apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Mason=function(a,c){this.element=b(c),this._create(a),this._init()},b.Mason.settings={isResizable:!0,isAnimated:!1,animationOptions:{queue:!1,duration:500},gutterWidth:0,isRTL:!1,isFitWidth:!1,containerStyle:{position:"relative"}},b.Mason.prototype={_filterFindBricks:function(a){var b=this.options.itemSelector;return b?a.filter(b).add(a.find(b)):a},_getBricks:function(a){var b=this._filterFindBricks(a).css({position:"absolute"}).addClass("masonry-brick");return b},_create:function(c){this.options=b.extend(!0,{},b.Mason.settings,c),this.styleQueue=[];var d=this.element[0].style;this.originalStyle={height:d.height||""};var e=this.options.containerStyle;for(var f in e)this.originalStyle[f]=d[f]||"";this.element.css(e),this.horizontalDirection=this.options.isRTL?"right":"left",this.offset={x:parseInt(this.element.css("padding-"+this.horizontalDirection),10),y:parseInt(this.element.css("padding-top")+16,10)},this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var g=this;setTimeout(function(){g.element.addClass("masonry")},0),this.options.isResizable&&b(a).bind("smartresize.masonry",function(){g.resize()}),this.reloadItems()},_init:function(a){this._getColumns(),this._reLayout(a)},option:function(a,c){b.isPlainObject(a)&&(this.options=b.extend(!0,this.options,a))},layout:function(a,b){for(var c=0,d=a.length;c<d;c++)this._placeBrick(a[c]);var e={};e.height=Math.max.apply(Math,this.colYs);if(this.options.isFitWidth){var f=0;c=this.cols;while(--c){if(this.colYs[c]!==0)break;f++}e.width=(this.cols-f)*this.columnWidth-this.options.gutterWidth}this.styleQueue.push({$el:this.element,style:e});var g=this.isLaidOut?this.options.isAnimated?"animate":"css":"css",h=this.options.animationOptions,i;for(c=0,d=this.styleQueue.length;c<d;c++)i=this.styleQueue[c],i.$el[g](i.style,h);this.styleQueue=[],b&&b.call(a),this.isLaidOut=!0},_getColumns:function(){var a=this.options.isFitWidth?this.element.parent():this.element,b=a.width();this.columnWidth=this.isFluid?this.options.columnWidth(b):this.options.columnWidth||this.$bricks.outerWidth(!0)||b,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((b+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},_placeBrick:function(a){var c=b(a),d,e,f,g,h;d=Math.ceil(c.outerWidth(!0)/(this.columnWidth+this.options.gutterWidth)),d=Math.min(d,this.cols);if(d===1)f=this.colYs;else{e=this.cols+1-d,f=[];for(h=0;h<e;h++)g=this.colYs.slice(h,h+d),f[h]=Math.max.apply(Math,g)}var i=Math.min.apply(Math,f),j=0;for(var k=0,l=f.length;k<l;k++)if(f[k]===i){j=k;break}var m={top:i+this.offset.y};m[this.horizontalDirection]=this.columnWidth*j+this.offset.x,this.styleQueue.push({$el:c,style:m});var n=i+c.outerHeight(!0),o=this.cols+1-l;for(k=0;k<o;k++)this.colYs[j+k]=n},resize:function(){var a=this.cols;this._getColumns(),(this.isFluid||this.cols!==a)&&this._reLayout()},_reLayout:function(a){var b=this.cols;this.colYs=[];while(b--)this.colYs.push(0);this.layout(this.$bricks,a)},reloadItems:function(){this.$bricks=this._getBricks(this.element.children())},reload:function(a){this.reloadItems(),this._init(a)},appended:function(a,b,c){if(b){this._filterFindBricks(a).css({top:this.element.height()});var d=this;setTimeout(function(){d._appended(a,c)},1)}else this._appended(a,c)},_appended:function(a,b){var c=this._getBricks(a);this.$bricks=this.$bricks.add(c),this.layout(c,b)},remove:function(a){this.$bricks=this.$bricks.not(a),a.remove()},destroy:function(){this.$bricks.removeClass("masonry-brick").each(function(){this.style.position="",this.style.top="",this.style.left=""});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"),b(a).unbind(".masonry")}},b.fn.imagesLoaded=function(a){function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}function h(){a.call(c,d)}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a});return c};var f=function(b){a.console&&a.console.error(b)};b.fn.masonry=function(a){if(typeof a=="string"){var c=Array.prototype.slice.call(arguments,1);this.each(function(){var d=b.data(this,"masonry");if(!d)f("cannot call methods on masonry prior to initialization; attempted to call method '"+a+"'");else{if(!b.isFunction(d[a])||a.charAt(0)==="_"){f("no such method '"+a+"' for masonry instance");return}d[a].apply(d,c)}})}else this.each(function(){var c=b.data(this,"masonry");c?(c.option(a||{}),c._init()):b.data(this,"masonry",new b.Mason(a,this))});return this}})(window,jQuery);

/*!
 * jQuery Fancy Letter Plugin v1.1
 *
 * Date: Sun Feb 06 20:51:59 2011 EST
 * Requires: jQuery v1.2.6+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Contributor: Matt Wiebe (::first-letter spec semi-conformance)
 *
 *
*/
(function(g){g.fn.fancyletter=function(m){function k(a,d,b){return['<span class="',b.punctuationClass," ",b.ltrClassPrefix+b["punctuation"+a][d],'">',d,"</span>"].join("")}function l(a,d){var b=a.firstChild,e="",f={};if(!a)return f;for(;a.childNodes.length;)a=a.firstChild;e=a.nodeValue&&a.nodeValue.replace(/^\s\s*/,"")||"";if(e===""&&b&&b.nextSibling)return l(b.nextSibling,d);else{b=e;for(var i=f="",c=0,h=b.charAt(c),j={};h in d.punctuationLeft;){c++;f+=k("Left",h,d);h=b.charAt(c)}j.pl=f;j.firstChar=
h;c++;for(h=b.charAt(c);h in d.punctuationRight;){c++;i+=k("Right",h,d);h=b.charAt(c)}j.pr=i;j.slicePoint=c;f=j;f.node=a;f.val=e;return f}}this.each(function(){var a,d,b,e,f=this;a=g(this);var i=g.extend({},g.fn.fancyletter.defaults,m||{},g.metadata?a.metadata():g.meta?a.data():{}),c=RegExp(i.characters);e=l(f,i);if(e.firstChar){a=e.val;f=e.node;d=e.firstChar;b=d.toLowerCase();if(c.test(d)){c=g("<span></span>");f.nodeValue=a.slice(e.slicePoint);c.html(e.pl+d+e.pr);c.addClass(i.commonClass+" "+i.ltrClassPrefix+
b);c.prependTo(this)}}});return this};g.fn.fancyletter.defaults={commonClass:"fancy-letter",ltrClassPrefix:"ltr-",characters:"[a-zA-Z0-9]",groupPunctuation:true,punctuationClass:"punct",punctuationLeft:{'"':"dquo","'":"squo","\u201c":"ldquo","\u2018":"lsquo","\u00ab":"laquo","\u2039":"lsaquo","(":"lparen"},punctuationRight:{'"':"dquo","'":"squo","\u201d":"rdquo","\u2019":"rsquo","\u00bb":"raquo","\u203a":"rsaquo",")":"rparen"}}})(jQuery);

/*!
 * http://tinynav.viljamis.com v1.03 by @viljamis
 * Licensed under the MIT license.
 */
(function ($, window, i) {
	$.fn.tinyNav = function (options) {

		// Default settings
		var settings = $.extend({
			'active' : 'selected', // String: Set the "active" class
			'header' : false // Boolean: Show header instead of the active item
		}, options);

		return this.each(function () {

			// Used for namespacing
			i++;

			var $nav = $(this),
			// Namespacing
				namespace = 'tinynav',
				namespace_i = namespace + i,
				l_namespace_i = '.l_' + namespace_i,
				$select = $('<select/>').addClass(namespace + ' ' + namespace_i);

			if ($nav.is('ul,ol')) {

				if (settings.header) {
					$select.append(
						$('<option/>').text('Navigation')
					);
				}

				// Build options
				var options = '';

				$nav
					.addClass('l_' + namespace_i)
					.find('a')
					.each(function () {
						options += '<option value="' + $(this).attr('href') + '">';
						for (j = 0; j < $(this).parents('ul, ol').length - 1; j++) {
							options += '&mdash; ';
						}
						options +=	$(this).text() + '</option>';
					});

				// Append options into a select
				$select.append(options);

				var selectors = settings.active.split(',');
				var index_selectors = new Array();
				for (var i=0; i<selectors.length; i++) {
					index_selectors[i] = l_namespace_i + ' li.' + selectors[i];
				}
				index_selectors = index_selectors.join(',');
				// Select the active item
				if (!settings.header) {
					$select
						.find(':eq(' + $(l_namespace_i + ' li')
						.index($(index_selectors)) + ')')
						.attr('selected', true);
				}

				// Change window location
				$select.change(function () {
					window.location.href = $(this).val();
				});

				// Inject select
				$(l_namespace_i).after($select);

			}

		});

	};
})(jQuery, this, 0);

/*
 * Based on the public domain "Responsive Cycle SlideShow" by M. Mikkel Rummelhoff (http://mmikkel.no)
 * Modifications by Sayontan Sinha
 */
(function(window){
	ResponsiveSlideShow.prototype.id = '';
	ResponsiveSlideShow.prototype.$container = null;
	ResponsiveSlideShow.prototype.$slides = null;
	ResponsiveSlideShow.prototype.orgWidth = -1;
	ResponsiveSlideShow.prototype.orgHeight = -1;
	ResponsiveSlideShow.prototype.activeSlideIndex = 0;
	ResponsiveSlideShow.prototype.options = {
		fx:'fade',
		speed:'fast',
		slideResize:0
	};

	function ResponsiveSlideShow($container, $slides, $options) {
		this.$container = $container;
		this.$slides = this.$container.children($slides + ':first');
		this.options = $options;
		this.init();
	}

	ResponsiveSlideShow.prototype.init = function()	{
		this.id = this.$container.attr('id');
		// Check if there's a nav or pager element present
		this.options.startingSlide = this.activeSlideIndex;
		this.options.width = this.$container.width();
		this.options.before = onSlideChange;
		// Init slideshow
		this.$slides.show();
		this.$slides.cycle(this.options);
		// Get original dimensions
		if(this.orgWidth <= 0){
			this.orgWidth = this.$slides.width();
			this.orgHeight = this.$slides.height();
		}
	}

	// Call when width changes
	ResponsiveSlideShow.prototype.update = function() {
		if(this.$slides.width() !== this.$container.width()){ // Container width changed. Rebuild slideshow
			// Get the resize ratio
			var ratio = (Math.floor((this.$container.width() / this.orgWidth)*100))*.01;
			this.$slides.height(Math.floor(this.orgHeight * ratio));
			this.activeSlideIndex = this.$slides.find('.active').index();
			this.$slides.hide().cycle('destroy');
			this.init();
		}
	}

	function onSlideChange(currSlide,nextSlide) {
		jQuery(this).parent().find('.active').removeClass('active');
		jQuery(this).addClass('active');
	}

	window.ResponsiveSlideShow = ResponsiveSlideShow;

}(window)); // End ResponsiveSlideShow

/**
 * suffusion.js - Contains all custom JavaScript functions required by Suffusion
 */

$j = jQuery.noConflict();

$j.fn.extend({
	highlight: function(search, insensitive, hls_class){
		var regex = new RegExp("(<[^>]*>)|(\\b"+ search.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1") +")", insensitive ? "ig" : "g");
		return this.html(this.html().replace(regex, function(a, b, c){
			return (a.charAt(0) == "<") ? a : "<span class=\""+ hls_class +"\">" + c + "</span>";
		}));
	}
});

$j.fn.removeHighlight = function() {
	return this.find("span.search-highlight").each(function() {
		with (this.parentNode) {
			replaceChild(this.firstChild, this);
			normalize();
		}
	}).end();
};

function sufHtmlEncode(value){
	return $j('<div/>').text(value).html();
}

function sufHtmlDecode(value){
	return $j('<div/>').html(value).text();
}

$j(document).ready(function() {
    /* Magazine JS, for the headline section */
	$j('.suf-mag-headlines div.suf-mag-headline-photo').hide();
	$j('div.suf-mag-headline-photo-first').show();
	$j('div.suf-mag-headline-block ul.mag-headlines li.suf-mag-headline-first a').addClass('tab-current');

	$j('div.suf-mag-headline-block ul.mag-headlines li a').hover(function(){
		var thisClass = this.className.substring(17, this.className.indexOf(" "));
		$j('.suf-mag-headlines div.suf-mag-headline-photo').hide();
		$j('div.suf-mag-headline-block ul.mag-headlines li a').removeClass('tab-current');
        $j('div.suf-mag-headline-photo-' + thisClass).show();
		$j(this).addClass('tab-current');
	}   );
    /* End Magazine JS */

    /* Tabbed Widgets */
    $j('.tab-box div.sidebar-tab-content').hide();
    $j('div.sbtab-content-first').show();
    $j('.tab-box ul.sidebar-tabs li.sbtab-first a').addClass('tab-current');

    $j('.tab-box ul.sidebar-tabs li a').click(function(){
        var thisClass = this.className.substring(6, this.className.indexOf(" "));
        $j('.tab-box div.sidebar-tab-content').hide();
        $j('.tab-box div.sbtab-content-' + thisClass).show();
        $j('.tab-box ul.sidebar-tabs li a').removeClass('tab-current');
        $j(this).addClass('tab-current');
    });
    /* End Tabbed Widgets */

    /* JQuery-based fix for widgets that do not print "after_title" */
    $j('.dbx-handle').each(function() {
        $j(this).prependTo(this.parentNode.parentNode);
    });
    /* End JQuery-based fix */

	/* JQuery for tabbed sidebars */
	$j('.sidebar-tab .sidebar-tab-content').each(function() {
		var parentId = this.parentNode.id;
		var parentClass = this.parentNode.className;
		parentClass = parentClass.substring(12);
		$j(this).addClass('sbtab-content-' + parentId);
		$j(this).addClass(parentClass);
	    $j(this).appendTo(this.parentNode.parentNode.parentNode);
	});

	$j('.tabbed-sidebar ul.sidebar-tabs a').each(function() {
		var parentId = this.parentNode.id;
		$j(this).addClass(parentId);
	});

	$j('#wsidebar-top.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#wsidebar-top.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');
	$j('#sidebar.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#sidebar.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');
	$j('#sidebar-b.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#sidebar-b.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');
	$j('#sidebar-2.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#sidebar-2.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');
	$j('#sidebar-2-b.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#sidebar-2-b.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');
	$j('#wsidebar-bottom.tabbed-sidebar ul.sidebar-tabs li:first').addClass('sbtab-first');
	$j('#wsidebar-bottom.tabbed-sidebar div.sidebar-tab-content:first').addClass('sbtab-content-first');

	$j('div.tabbed-sidebar div.sidebar-tab-content').hide();
	$j('div.sbtab-content-first').show();
	$j('div.tabbed-sidebar ul.sidebar-tabs li.sbtab-first a').addClass('tab-current');

	$j('div.tabbed-sidebar ul.sidebar-tabs li a').click(function(){
		$j(this).removeClass('tab-current');
	    var thisClass = this.className.substring(12, this.className.length);
		var parentId = this.parentNode.parentNode.parentNode.id;
	    $j('#' + parentId + '.tabbed-sidebar div.sidebar-tab-content').hide();
	    $j('#' + parentId + '.tabbed-sidebar div.sbtab-content-' + thisClass).show();
	    $j('#' + parentId + '.tabbed-sidebar ul.sidebar-tabs li a').removeClass('tab-current');
	    $j(this).addClass('tab-current');
	});
	/* End tabbed sidebars */

	// Kill empty widget areas
	$j("#horizontal-outer-widgets-1, #horizontal-outer-widgets-2, #widgets-above-header").each(function () {
		if ($j(this).children().length == 0) {
			$j(this).remove();
		}
	});

	// Remove empty sub-menus, generated for Mega menus
	$j('ul.sf-menu .sub-menu').each(function() {
		if ($j(this).children().length == 0) {
			$j(this).remove();
		}
	});

	$j('#left-header-widgets ul.menu, #right-header-widgets ul.menu').each(function() {
		$j(this).addClass('sf-menu');
	});

	$j("ul.sf-menu > li").each(function() {
		if (this.childNodes.length > 1) {
			var drop_down = this.childNodes[1];
			if ($j(drop_down).hasClass('mm-warea') && $j(drop_down).find('.mm-widget').length != 0) {
				$j(this).removeClass('dd-tab').addClass('mm-tab');
				var a_tag_h = this.childNodes[0];
				var a_tag = $j(a_tag_h);
				a_tag.attr('href', '#');
				a_tag.attr('onclick', 'return false;');
				a_tag.prepend("<!--[if !IE]>--><span class='down-ptr'>&nbsp;</span><!--<![endif]-->");
				a_tag.append("<!--[if lt IE 7]>&nbsp;&nbsp;&darr;<![endif]--> <!--[if (!IE)|(gte IE 7)]><span class='down-ptr'>&nbsp;</span><![endif]-->");
				a_tag.addClass('with-arrow');
			}
			else if ($j(drop_down).find('.mm-widget').length == 0 && $j(this).hasClass('mm-tab')) {
				$j(this).remove();
			}
			else if (!$j(this).hasClass('mm-tab')) {
				$j(this).addClass('dd-tab');
			}
		}
		else {
			$j(this).removeClass('dd-tab').addClass('regular-tab');
		}
	});

	$j("ul.sf-menu .dd-tab > ul").each(function() {
		var a_tag_h = this.parentNode.childNodes[0];
		var a_tag = $j(a_tag_h);
		a_tag.prepend("<!--[if !IE]>--><span class='down-ptr'>&nbsp;</span><!--<![endif]-->");
		a_tag.append("<!--[if lt IE 7]>&nbsp;&nbsp;&darr;<![endif]--> <!--[if (!IE)|(gte IE 7)]><span class='down-ptr'>&nbsp;</span><![endif]-->");
		a_tag.addClass('with-arrow');
	});

	$j("ul.sf-menu .dd-tab ul ul").each(function() {
		var a_tag_h = this.parentNode.childNodes[0];
		var a_tag = $j(a_tag_h);
		a_tag.prepend("<!--[if !IE]>--><span class='float-ptr'>&nbsp;</span><!--<![endif]-->");
		a_tag.append("<!--[if lt IE 7]>&nbsp;&nbsp;&rarr;<![endif]--> <!--[if (!IE)|(gte IE 7)]><span class='float-ptr'>&nbsp;</span><![endif]-->");
		a_tag.addClass('drop');
	});

	$j("#nav ul.sf-menu .dd-tab, #nav-top ul.sf-menu .dd-tab").each(function() {
		$j(this).children('ul:first').hide();
		$j(this).find('ul:first').css({visibility: "hidden"});
	});

	$j("ul.sf-menu .dd-tab li.current_page_item > a, ul.sf-menu .dd-tab li.current-cat > a, ul.sf-menu .dd-tab li.current-menu-item > a, " +
			"ul.sf-menu li.current_page_item.dd-tab > a, ul.sf-menu li.current-cat.dd-tab > a, ul.sf-menu li.current-menu-item.dd-tab > a, " +
			"ul.sf-menu li.current_page_item.regular-tab > a, ul.sf-menu li.current-cat.regular-tab > a, ul.sf-menu li.current-menu-item.regular-tab > a").each(function() {
		$j(this).addClass('current');
	});

	$j("ul.sf-menu .mm-tab li.current_page_item > a, ul.sf-menu .mm-tab li.current-cat > a, ul.sf-menu .mm-tab li.current-menu-item > a, " +
			"ul.sf-menu li.current_page_item.mm-tab > a, ul.sf-menu li.current-cat.mm-tab > a, ul.sf-menu li.current-menu-item.mm-tab > a").each(function() {
		$j(this).addClass('mm-current');
	});

	$j("#nav ul.sf-menu .dd-tab, #nav ul.sf-menu .dd-tab li").hover(
		function() {
			if (Suffusion_JS.suf_nav_effect == 'fade') {
				$j(this).children('ul:first').fadeIn(Suffusion_JS.suf_nav_delay).css({visibility: "visible"});
			}
			else {
				$j(this).children('ul:first').show(Suffusion_JS.suf_nav_delay).css({visibility: "visible"});
			}
		},
		function() {
			$j(this).children('ul:first').hide();
			$j(this).find('ul:first').css({visibility: "hidden"});
		}
	);

	$j("#nav-top ul.sf-menu .dd-tab, #nav-top ul.sf-menu .dd-tab li").hover(
		function() {
			if (Suffusion_JS.suf_navt_effect == 'fade') {
				$j(this).find('ul:first').fadeIn(Suffusion_JS.suf_navt_delay).css({visibility: "visible"});
			}
			else {
				$j(this).find('ul:first').show(Suffusion_JS.suf_navt_delay).css({visibility: "visible"});
			}
		},
		function() {
			$j(this).children('ul:first').hide();
			$j(this).find('ul:first').css({visibility: "hidden"});
		}
	);

	// Expand Panel
	$j("#top-bar-right-spanel-tab .open").click(function(){
		$j("#top-bar-right-spanel").slideDown("medium");
		$j(this).css({ display: 'none' });
		$j("#top-bar-right-spanel-tab .close").css({ display: 'block' });
		return false;
	});
	// Collapse Panel
	$j("#top-bar-right-spanel-tab .close").click(function(){
		$j("#top-bar-right-spanel").slideUp("medium");
		$j(this).css({ display: 'none' });
		$j("#top-bar-right-spanel-tab .open").css({ display: 'block' });
		return false;
	});

	$j('#search-info input[type="checkbox"].search-hl').change(function(event) {
		var search = $j('#search-term').val();
		var hls_class = 'search-highlight';
		if ($j(this).attr('checked')) {
			// Highlight search results
			$j('#content .entry').each(function() {
				var quotes = search.match(/"([^"]+)"/g);
				var len = 0;
				var matches = new Array();
				if (quotes != null) {
					len = quotes.length;
					for (i=0; i<len; i++) {
						quotes[i] = quotes[i].replace(/"/g, '');
						matches[matches.length] = quotes[i];
						search = search.replace(quotes[i], ' ');
					}
				}

				var no_quotes = search.match(/\b[\S]+\b/g);
				if (no_quotes != null) {
					len = no_quotes.length;
					for (i=0; i<len; i++) {
						matches[matches.length] = no_quotes[i];
					}
				}

				len = matches.length;
				for (i=0; i<len; i++) {
					var search_string = matches[i];
					$j(this).highlight(search_string);
					$j(this).highlight(search_string, true, hls_class);
				}
			});
		}
		else {
			//Un-highlight search results
			$j('#content .entry').each(function() {
				$j(this).removeHighlight();
			});
		}
	});

	if (typeof Suffusion_JS.suf_jq_masonry_enabled != 'undefined' && Suffusion_JS.suf_jq_masonry_enabled == 'enabled') {
		//$j("#top-bar-right-spanel").masonry();
		//$j("#widgets-above-header").masonry();
		$j("#horizontal-outer-widgets-1").masonry();
		$j("#horizontal-outer-widgets-2").masonry();
		$j("#ad-hoc-1").masonry();
		$j("#ad-hoc-2").masonry();
		$j("#ad-hoc-3").masonry();
		$j("#ad-hoc-4").masonry();
		$j("#ad-hoc-5").masonry();
	}

	if (Suffusion_JS.suf_fix_aspect_ratio == 'preserve') {
		// If the HTML height attribute is present for images, the max-width setting really hammers the image proportions.
		$j(".entry img").removeAttr('height');
	}

	// Fixes for NGG on IE8. This should ideally be on NGG's plugin itself, but given their support or lack thereof :-( ...
	$j(".ngg-gallery-thumbnail img").removeAttr('height');
	$j(".ngg-gallery-thumbnail img").removeAttr('width');

	$j(".widget_calendar tbody td a").each(function() {
		var parent = this.parentNode;
		//var a_tag_h = this.parentNode.childNodes[0];
		var td_tag = $j(parent);
		td_tag.addClass('with-posts');
	});

	$j('a.suf-tile-icon').click(function() {
		var class_name = this.className;
		var thisId = this.id;
		var lastSep = thisId.lastIndexOf('-');
		var elementType = thisId.substr(0, lastSep);
		var elementId = thisId.substr(lastSep);
		var textElementId = elementType + '-text' + elementId;
		$j('#' +  textElementId).toggle();
		if (class_name.indexOf('clicked') > -1) {
			$j(this).removeClass('clicked');
		}
		else {
			$j(this).addClass('clicked');
		}
		var parents = $j(this).parents();
		for (var i=0; i<parents.length; i++) {
			var parent = parents[i];
			if ($j(parent).hasClass('suf-tiles') || $j(parent).hasClass('suf-mag-excerpts')) {
				$j(parents[i-1]).css({
					'min-height': 0
				});
				suffusion_make_tiles_equal($j(parent).children('.suf-tile, .suf-mag-excerpt'));
				break;
			}
		}
		return false;
	});

	// JQuery Cycle stops if there is only one image in it. The following snippet fixes the issue.
	$j('#sliderContent, .sliderContent').each(function() {
		if ($j(this).children().length == 1) {
			var single = this.firstChild;
			$j(single).show();
		}
	});

	$j('.mosaic-page-nav-right a, .mosaic-page-nav-left a').each(function() {
		var parentContainer = $j(this).parent().parent();
		var height = 0.45 * parentContainer.height();
		$j(this).css({top: height + 'px'});
	});

	var staticSlideShow;
	$j('#sliderContent').each(function() {
		staticSlideShow = new ResponsiveSlideShow($j('#slider'), '#sliderContent', {
			fx: Suffusion_JS.suf_featured_fx,
			timeout: Suffusion_JS.suf_featured_interval,
			speed: Suffusion_JS.suf_featured_transition_speed,
			pause: 1,
			sync: Suffusion_JS.suf_featured_sync,
			pager: '#sliderPager',
			prev: 'a.sliderPrev',
			next: 'a.sliderNext',
			slideResize: 0,
			pagerAnchorBuilder: suffusion_anchor_builder
		});
	});

	$j('a.sliderPause').click(
		function() {
			if ($j(this).text() == Suffusion_JS.suf_featured_pause) {
				$j('#sliderContent').cycle('pause');
				$j('a.sliderPause').addClass('activeSlide');
				$j(this).text(Suffusion_JS.suf_featured_resume);
			}
			else {
				$j('#sliderContent').cycle('resume');
				$j('a.sliderPause').removeClass('activeSlide');
				$j(this).text(Suffusion_JS.suf_featured_pause);
			}
			return false;
		}
	);

	$j('.controller-icons #sliderControl a, .controller-icons .sliderControl a').hover(
		function() {
			var parent = $j(this).parent();
			parent.children().addClass('slide-hovered');
			$j(this).addClass('control-hovered');
		},
		function() {
			var parent = $j(this).parent();
			parent.children().addClass('slide-hovered');
			$j(this).removeClass('control-hovered');
		}
	);

	$j('#slider, .slider').hover(
		function() {
			var parent = $j(this).parent();
			if (parent.hasClass('controller-icons')) {
				parent.find('.sliderPrev, .sliderNext').addClass('slide-hovered');
			}
		},
		function() {
			var parent = $j(this).parent();
			if (parent.hasClass('controller-icons')) {
				parent.find('.sliderPrev, .sliderNext').removeClass('slide-hovered');
			}
		}
	);

	$j('.collapse .searchfield').focus(function() {
		$j(this).addClass('search-focus');
	});
	$j('.collapse .searchfield').blur(function() {
		$j(this).removeClass('search-focus');
	});

	$j('a.suf-mosaic-thumb').each(function() {
		$j(this).data('title', $j(this).attr('title'));
		if ($j.fancybox) {
			$j(this).fancybox({
				transitionIn	:	'elastic',
				transitionOut	:	'elastic',
				speedIn		:	600,
				speedOut		:	200,
				overlayShow	:	true,
				overlayColor:	'#000',
				overlayOpacity: 0.8
			});
		}
		else if ($j.colorbox) {
			$j(this).colorbox({
				opacity: 0.8,
				maxWidth: '95%',
				maxHeight: '95%'
			});
		}
	});

	$j('.mosaic-overlay').hover(function() {
		$j(this).stop().animate({
			opacity: 0.65
		}, "medium");
	}, function() {
		$j(this).stop().animate({
			opacity: 0
		}, "medium");
	});

	$j('.entry > p:first-child').each(function() {
		$j(this).addClass('first-para');
	});

	if (Suffusion_JS.suf_show_drop_caps != '') {
		$j(Suffusion_JS.suf_show_drop_caps).fancyletter();
	}

	$j(".exif-button .open").on('click', function(){
		$j(".exif-panel").slideDown("medium");
		$j(this).removeClass('open').addClass('close');
		return false;
	});
	// Collapse Panel
	$j(".exif-button .close").on('click', function(){
		$j(".exif-panel").slideUp("medium");
		$j(this).removeClass('close').addClass('open');
		return false;
	});

	$j('.mm-warea + .sub-menu').each(function() {
		$j(this).remove();
	});

	$j('.mm-warea').each(function() {
		if ($j(this).find('.mm-widget').length == 0) {
			$j(this).remove();
			return;
		}
		var parents = $j(this).parents();
		var parent_li = parents[0];
		var col_control = parents[2];
		var nav = parents[3];
		var nav_left = $j(nav).offset().left;
		var nav_right = nav_left + $j(nav).width();
		var left_pos, current_offset, right_pos;
		var padding = 10;
		if (nav.id == 'nav') {
			padding = 0;
		}

		if ($j(col_control).hasClass('center')) { // Centered menu. Mega-menu will be aligned centrally, but left & right positions will be adjusted to not cross the border.
			left_pos = -($j(this).width() / 2); // Does the centering by moving it to the left by 50% of its width.
			$j(this).css({ left: left_pos });
			current_offset = $j(this).offset();
			right_pos = current_offset.left + $j(this).width();

			if (current_offset.left < nav_left) { // Mega-menu has gone too far left. We will shift it by the difference + padding
				left_pos += nav_left - current_offset.left + padding;
				$j(this).css({ left: left_pos });
			}
			else if (right_pos > nav_right) { // Mega-menu has gone too far right. We will shift it by the difference + padding
				left_pos -= right_pos - nav_right + padding;
				$j(this).css({ left: left_pos });
			}
		}
		else if ($j(col_control).hasClass('left')) {
			left_pos = 0;
			$j(this).css({ left: left_pos });
			current_offset = $j(this).offset();
			right_pos = current_offset.left + $j(this).width();
			if (right_pos > nav_right) {
				left_pos -= right_pos - nav_right + padding;
				$j(this).css({ left: left_pos });
			}
		}
		else if ($j(col_control).hasClass('right')) {
			right_pos = 0;
			$j(this).css({ right: right_pos});
			current_offset = $j(this).offset();
			left_pos = current_offset.left;
			if (left_pos < nav_left) {
				right_pos -= nav_left - left_pos + padding;
				$j(this).css({ right: right_pos});
			}
		}
		$j(this).children('.mm-mason').masonry();
	});

	$j(".mm-warea .float-ptr").each(function() {
		$j(this).remove();
	});

	$j(".mm-warea .drop").each(function() {
		$j(this).removeClass('drop');
	});

	$j(".mm-warea select").focus(function() {
		$j(this).parents('.mm-warea').addClass('keep-open');
	});

	$j(".mm-warea select").blur(function() {
		$j(this).parents('.mm-warea').removeClass('keep-open');
	});

	$j(".mm-warea option").hover(
		function() {
			$j(this).parents('.mm-warea').addClass('keep-open');
		},
		function() {
			$j(this).parents('.mm-warea').removeClass('keep-open');
		}
	);

	$j('.mm-widget img, .cl-widget img').each(function() {
		var widget = $j(this).parents('.mm-widget, .cl-widget');
		if ($j(this).width() > $j(widget).innerWidth()) {
			$j(this).css({width: '100%'});
		}
	});

	$j(window).resize(function() {
		if (typeof staticSlideShow != 'undefined') {
			staticSlideShow.update();
			$j('.controller-icons #sliderControl').css({
				top: '-' + ($j('#sliderContent').height() / 2) + 'px'
			});
		}
		suffusion_balance_heights('.suf-tiles, .suf-mag-excerpts, .suf-mag-categories, .cl-warea, .mm-row-equal');
	});

	$j(function() {
		if (typeof staticSlideShow != 'undefined') {
			//staticSlideShow.update();
			$j('.controller-icons #sliderControl').css({
				top: '-' + ($j('#sliderContent').height() / 2) + 'px'
			});
		}
		suffusion_balance_heights('.suf-tiles, .suf-mag-excerpts, .suf-mag-categories, .cl-warea, .mm-row-equal');
	});

	$j(".sf-menu").tinyNav({
		active: 'current_page_item,current-cat,current-menu-item', // Set the "active" class
		header: false // Show header instead of the active item
	});

	function suffusion_anchor_builder(idx, slide) {
		var anchor;
		if (Suffusion_JS.suf_featured_pager_style == 'numbers') {
			anchor = (idx + 1);
		}
		else {
			anchor = '&nbsp;';
		}
		return '<a href="#">' + anchor + '</a>';
	}

	function suffusion_make_tiles_equal(tiles) {
		var tallest = 0;
		// Reset all tiles to 0 min-height
		tiles.css({
			'height': 'auto'
		});
		tiles.each(function() {
			var currentHeight = $j(this).height();
			if (currentHeight > tallest) {
				tallest = currentHeight;
			}
		});
		tiles.css({
			'height': tallest
		});
	}

	function suffusion_balance_heights(selector) {
		$j(selector).each(function() {
			var children = $j(this).find('.suf-tile, .suf-mag-excerpt, .suf-mag-category, .cl-widget, .mm-widget');
			var wareaColumns = 0;
			if ($j(this).hasClass('cl-warea') || $j(this).hasClass('mm-row-equal') || $j(this).hasClass('suf-tiles')) {
				var baseline = 10 < children.length ? 10 : children.length;
				for (var k = 0; k < baseline; k++) {
					if (k != 0 && $j(children[k-1]).position().top != $j(children[k]).position().top) {
						wareaColumns = k;
						break;
					}
				}

				if (wareaColumns == 0) {
					for (var k=1; k<=10; k++) {
						if ($j(this).hasClass('cl-warea-' + k) || $j(this).hasClass('mm-row-' + k) || $j(this).hasClass('suf-tiles-' + k)) {
							wareaColumns = k;
							break;
						}
					}
				}
			}

			if ($j(this).hasClass('cl-warea-all-row') || $j(this).hasClass('cl-warea-all') || $j(this).hasClass('mm-row-equal') || $j(this).hasClass('suf-tiles')) {
				for (var m = 0; m * wareaColumns < children.length; m = m + 1) {
					var slice = children.slice(m * wareaColumns, (m + 1) * wareaColumns);
					if ($j(this).hasClass('cl-warea-all-row') || $j(this).hasClass('mm-row-equal') || $j(this).hasClass('suf-tiles')) {
						suffusion_make_tiles_equal(slice);
					}
				}
				if ($j(this).hasClass('cl-warea-all')) {
					suffusion_make_tiles_equal(children);
				}
			}
			else if ($j(this).hasClass('cl-warea-masonry')) {
				$j(this).masonry({
					itemSelector: '.cl-widget',
					columnWidth: function(containerWidth) {
						if (wareaColumns == 0) {
							return containerWidth;
						}
						return containerWidth/wareaColumns;
					}
				});
			}
			suffusion_make_tiles_equal($j(this).children('.suf-mag-excerpt, .suf-mag-category'));
		});
	}
});
