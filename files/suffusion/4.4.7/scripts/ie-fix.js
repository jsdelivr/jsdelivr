/**
 * Handles transparent PNGs and max-widths for IE6. This is a replacement for the MSIE Expressions used in prior versions of the theme.
 * The CSS will now pass validation.
 *
 * @since 3.7.9
 */

/**
* DD_belatedPNG: Adds IE6 support: PNG images for CSS background-image and HTML <IMG/>.
* Author: Drew Diller
* Email: drew.diller@gmail.com
* URL: http://www.dillerdesign.com/experiment/DD_belatedPNG/
* Version: 0.0.7a
* Licensed under the MIT License: http://dillerdesign.com/experiment/DD_belatedPNG/#license
*
* Example usage:
* DD_belatedPNG.fix('.png_bg'); // argument is a CSS selector
* DD_belatedPNG.fixPng( someNode ); // argument is an HTMLDomElement
**/

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('2 E={J:\'E\',Z:{},1E:7(){4(x.1l&&!x.1l[6.J]){x.1l.23(6.J,\'24:25-26-27:3\')}4(1F.11){1F.11(\'28\',7(){E=29})}},1G:7(){2 a=x.1m(\'8\');x.1H.1b.1n(a,x.1H.1b.1b);2 b=a.1o;b.1c(6.J+\'\\\\:*\',\'{12:2a(#1I#2b)}\');b.1c(6.J+\'\\\\:9\',\'Q:1p;\');b.1c(\'1J.\'+6.J+\'1K\',\'12:y; 1q:y; Q:1p; z-2c:-1; 1d:-1r; 1L:1M;\');6.1o=b},1N:7(){2 a=13.2d;4(13.1e.K(\'2e\')!=-1||13.1e.K(\'1q\')!=-1){E.1f(a)}4(13.1e==\'8.1s\'){2 b=(a.F.1s==\'y\')?\'y\':\'2f\';G(2 v M a.3){a.3[v].9.8.1s=b}}4(13.1e.K(\'14\')!=-1){E.1t(a)}},1t:7(a){4(a.F.14.K(\'2g\')!=-1){2 b=a.F.14;b=1u(b.2h(b.1v(\'=\')+1,b.1v(\')\')),10)/2i;a.3.N.9.8.14=a.F.14;a.3.C.I.2j=b}},15:7(a){2k(7(){E.1f(a)},1)},2l:7(a){2 b=a.1O(\',\');G(2 i=0;i<b.2m;i++){6.1o.1c(b[i],\'12:2n(E.1P(6))\')}},1f:7(a){a.S.1Q=\'\';6.1R(a);6.16(a);6.1t(a);4(a.O){6.1S(a)}},1T:7(b){2 c=6;2 d={2o:\'16\',2p:\'16\'};4(b.17==\'A\'){2 e={2q:\'15\',2r:\'15\',2s:\'15\',2t:\'15\'};G(2 a M e){d[a]=e[a]}}G(2 h M d){b.11(\'1w\'+h,7(){c[d[h]](b)})}b.11(\'2u\',6.1N)},1x:7(a){a.8.2v=1;4(a.F.Q==\'2w\'){a.8.Q=\'2x\'}},1S:7(a){2 b={\'2y\':P,\'2z\':P,\'2A\':P};G(2 s M b){a.3.N.9.8[s]=a.F[s]}},1R:7(a){4(!a.F){1g}U{2 b=a.F}G(2 v M a.3){a.3[v].9.8.1U=b.1U}a.S.18=\'\';a.S.19=\'\';2 c=(b.18==\'1V\');2 d=P;4(b.19!=\'y\'||a.O){4(!a.O){a.D=b.19;a.D=a.D.2B(5,a.D.1v(\'")\')-5)}U{a.D=a.1h}2 e=6;4(!e.Z[a.D]){2 f=x.1m(\'1J\');e.Z[a.D]=f;f.2C=e.J+\'1K\';f.S.1Q=\'12:y; Q:1p; 1y:-1r; 1d:-1r; 1q:y;\';f.11(\'2D\',7(){6.1i=6.2E;6.1j=6.2F;e.16(a)});f.1h=a.D;f.1W(\'1i\');f.1W(\'1j\');x.1X.1n(f,x.1X.1b)}a.3.C.I.1h=a.D;d=V}a.3.C.I.1w=!d;a.3.C.I.N=\'y\';a.3.N.9.8.18=b.18;a.S.19=\'y\';a.S.18=\'1V\'},16:7(e){2 f=e.F;2 g={\'W\':e.2G+1,\'H\':e.2H+1,\'w\':6.Z[e.D].1i,\'h\':6.Z[e.D].1j,\'L\':e.2I,\'T\':e.2J,\'1k\':e.2K,\'1z\':e.2L};2 i=(g.L+g.1k==1)?1:0;2 j=7(a,l,t,w,h,o){a.2M=w+\',\'+h;a.2N=o+\',\'+o;a.2O=\'2P,1Y\'+w+\',1Y\'+w+\',\'+h+\'2Q,\'+h+\' 2R\';a.8.1i=w+\'u\';a.8.1j=h+\'u\';a.8.1y=l+\'u\';a.8.1d=t+\'u\'};j(e.3.N.9,(g.L+(e.O?0:g.1k)),(g.T+(e.O?0:g.1z)),(g.W-1),(g.H-1),0);j(e.3.C.9,(g.L+g.1k),(g.T+g.1z),(g.W),(g.H),1);2 k={\'X\':0,\'Y\':0};2 m=7(a,b){2 c=P;2S(b){1a\'1y\':1a\'1d\':k[a]=0;1A;1a\'2T\':k[a]=.5;1A;1a\'2U\':1a\'2V\':k[a]=1;1A;1I:4(b.K(\'%\')!=-1){k[a]=1u(b)*.2W}U{c=V}}2 d=(a==\'X\');k[a]=2X.2Y(c?((g[d?\'W\':\'H\']*k[a])-(g[d?\'w\':\'h\']*k[a])):1u(b));4(k[a]==0){k[a]++}};G(2 b M k){m(b,f[\'2Z\'+b])}e.3.C.I.Q=(k.X/g.W)+\',\'+(k.Y/g.H);2 n=f.30;2 p={\'T\':1,\'R\':g.W+i,\'B\':g.H,\'L\':1+i};2 q={\'X\':{\'1B\':\'L\',\'1C\':\'R\',\'d\':\'W\'},\'Y\':{\'1B\':\'T\',\'1C\':\'B\',\'d\':\'H\'}};4(n!=\'1D\'){2 c={\'T\':(k.Y),\'R\':(k.X+g.w),\'B\':(k.Y+g.h),\'L\':(k.X)};4(n.K(\'1D-\')!=-1){2 v=n.1O(\'1D-\')[1].31();c[q[v].1B]=1;c[q[v].1C]=g[q[v].d]}4(c.B>g.H){c.B=g.H}e.3.C.9.8.1Z=\'20(\'+c.T+\'u \'+(c.R+i)+\'u \'+c.B+\'u \'+(c.L+i)+\'u)\'}U{e.3.C.9.8.1Z=\'20(\'+p.T+\'u \'+p.R+\'u \'+p.B+\'u \'+p.L+\'u)\'}},1P:7(a){a.8.12=\'y\';4(a.17==\'32\'||a.17==\'33\'||a.17==\'34\'){1g}a.O=V;4(a.17==\'35\'){4(a.1h.21().K(/\\.22$/)!=-1){a.O=P;a.8.1L=\'1M\'}U{1g}}U 4(a.F.19.21().K(\'.22\')==-1){1g}2 b=E;a.3={N:{},C:{}};2 c={9:{},I:{}};G(2 r M a.3){G(2 e M c){2 d=b.J+\':\'+e;a.3[r][e]=x.1m(d)}a.3[r].9.36=V;a.3[r].9.37(a.3[r].I);a.38.1n(a.3[r].9,a)}a.3.C.9.39=\'y\';a.3.C.I.3a=\'3b\';a.3.N.I.1w=V;b.1T(a);b.1x(a);b.1x(a.3c);b.1f(a)}};3d{x.3e("3f",V,P)}3g(r){}E.1E();E.1G();',62,203,'||var|vml|if||this|function|style|shape|||||||||||||||||||||px|||document|none||||image|vmlBg|DD_belatedPNG|currentStyle|for||fill|ns|search||in|color|isImg|true|position||runtimeStyle||else|false||||imgSize||attachEvent|behavior|event|filter|handlePseudoHover|vmlOffsets|nodeName|backgroundColor|backgroundImage|case|firstChild|addRule|top|propertyName|applyVML|return|src|width|height|bLW|namespaces|createElement|insertBefore|styleSheet|absolute|border|10000px|display|vmlOpacity|parseInt|lastIndexOf|on|giveLayout|left|bTW|break|b1|b2|repeat|createVmlNameSpace|window|createVmlStyleSheet|documentElement|default|img|_sizeFinder|visibility|hidden|readPropertyChange|split|fixPng|cssText|vmlFill|copyImageBorders|attachHandlers|zIndex|transparent|removeAttribute|body|0l|clip|rect|toLowerCase|png|add|urn|schemas|microsoft|com|onbeforeunload|null|url|VML|index|srcElement|background|block|lpha|substring|100|opacity|setTimeout|fix|length|expression|resize|move|mouseleave|mouseenter|focus|blur|onpropertychange|zoom|static|relative|borderStyle|borderWidth|borderColor|substr|className|onload|offsetWidth|offsetHeight|clientWidth|clientHeight|offsetLeft|offsetTop|clientLeft|clientTop|coordsize|coordorigin|path|m0|l0|xe|switch|center|right|bottom|01|Math|ceil|backgroundPosition|backgroundRepeat|toUpperCase|BODY|TD|TR|IMG|stroked|appendChild|parentNode|fillcolor|type|tile|offsetParent|try|execCommand|BackgroundImageCache|catch'.split('|'),0,{}))

// PNG fix for UI elements
DD_belatedPNG.fix('img, .suf-widget ul li, #sidebar ul li, #sidebar-2 ul li, .sidebar-tab-content ul li, li.suf-mag-catblock-post, input, .searchform .searchsubmit, #right-header-widgets .searchsubmit, #left-header-widgets .searchsubmit, #top-bar-left-widgets .searchsubmit,  #top-bar-right-widgets .searchsubmit, submit, .searchsubmit, .postdata .category, .postdata .comments, .postdata .edit, .previous-entries a, .next-entries a, .post-nav .next a, .post-nav .previous a, .post .date, h3#comments, h3.comments, #h3#respond, h3.respond, blockquote, blockquote div');

// Native code for Suffusion begins here...
$j = jQuery.noConflict();
$j.fn.constrainSizes = function() {
	$j('#wrapper').each(function() {
		var standard_templates = new Array('1l-sidebar-php', '1r-sidebar-php', '1l1r-sidebar-php', '2l-sidebars-php', '2r-sidebars-php', 'no-sidebars-php');
		var parent = $j(this).parent();
		var parent_width = parent.width();
		var template = "";
		if (parent.hasClass('page-template')) {
			var className = parent.attr('class');
			var classes = className.split(' ');
			for (var i=0; i<classes.length; i++) {
				var curr_class = classes[i];
				if (curr_class.indexOf('page-template-') >= 0) {
					var curr_template = curr_class.substr(14);
					if (!$j.inArray(curr_template, standard_templates)) {
						continue;
					}
					curr_class = curr_class.split('-');
					template = '_' + (curr_class.join('_'));
					break;
				}
			}
		}
//		console.log(template);

		var wrapper_width_type = eval('Suffusion_JS.wrapper_width_type' + template);
		if (wrapper_width_type == 'fluid') {
			var wrapper_max_width = eval('Suffusion_JS.wrapper_max_width' + template);
			var wrapper_min_width = eval('Suffusion_JS.wrapper_min_width' + template);
			var wrapper_orig_width = eval('Suffusion_JS.wrapper_orig_width' + template);
			wrapper_max_width = parseInt(wrapper_max_width, 10);
			wrapper_min_width = parseInt(wrapper_min_width, 10);
			wrapper_orig_width = parseInt(wrapper_orig_width, 10);
			var curr_width = $j(this).width();
			if (parent_width < ((100 * wrapper_max_width)/wrapper_orig_width) &&
					parent_width > ((100 * wrapper_min_width)/wrapper_orig_width)) {
				$j(this).css('width', wrapper_orig_width + '%');
			}
			else if (parent_width >= ((100 * wrapper_max_width)/wrapper_orig_width)) {
				$j(this).css('width', wrapper_max_width + 'px');
			}
			else if (parent_width <= ((100 * wrapper_min_width)/wrapper_orig_width)) {
				$j(this).css('width', wrapper_min_width + 'px');
			}
		}
	});

	$j('#main-col, #single-col').each(function() {
		var main_col_width = $j(this).width();

		var sb1_width = 0, sb2_width = 0;
		$j('#sidebar').each(function() {
			sb1_width = $j(this).width();
		});
		$j('#sidebar-2').each(function() {
			sb2_width = $j(this).width();
		});

		var base;
		$j('.postdata .category, .tags').each(function() {
			base = Math.floor(main_col_width/2);
			if ($j(this).width() > base) {
				$j(this).css('width', base + 'px');
			}
		});
		$j('.sidebar-wrap-left, #sidebar-container.sidebar-container-left').each(function() {
			base = main_col_width - 15 + Math.floor((sb1_width + sb2_width)/2);
			$j(this).css('margin-left', base+'px');
		});

		var wrapper_width = $j('#wrapper').width();
		$j('.entry img, .wp-caption').not('.entry .wp-caption img').each(function() {
			if ($j(this).width() > wrapper_width - 60) {
				$j(this).css('width', '96%');
			}
		});

		$j('.entry .wp-caption img').each(function() {
			if ($j(this).width() > wrapper_width - 60) {
				$j(this).css('width', '100%');
			}
		});
	});
};

$j(document).ready(function() {
	$j(window).load(function() {
		$j(this).constrainSizes();
	});
	$j(window).resize(function() {
		$j(this).constrainSizes();
	});
});