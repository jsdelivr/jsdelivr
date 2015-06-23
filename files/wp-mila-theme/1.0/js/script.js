/*-----------------------------------------------------------------------------------

 	Script - All Custom frontend jQuery scripts & functions
 
-----------------------------------------------------------------------------------*/

jQuery(window).load(function($) {	
	
	// fadeOut loading
	setTimeout("jQuery('#loading').fadeOut(500).css({opacity: '0.9', backgroundColor: 'transparent'})",500);
	
	// Position fixed bugfix for tablets + phones
	jQuery(window).scroll(function() {
		if (jQuery(window).width() <= 768) {
			jQuery('#loading').css({ top: window.pageYOffset+'px' });
		}
	}).trigger('scroll');
	
	// Effects
	$easingType= 'easeInOutQuart';
	
	
	/*---------------------------------------------- 
				  I M A G E   H O V E R
	------------------------------------------------*/
	var hoverFade = 100;	
	jQuery('.imgoverlay').live('mouseenter', function(){
		jQuery(this).find('.overlay').animate({ opacity: 0.8 }, hoverFade);
		jQuery(this).find('.overlaymeta').fadeIn(hoverFade);
	}).live('mouseleave', function () {
	  	jQuery(this).find('.overlay').animate({ opacity: 0 }, hoverFade);
		jQuery(this).find('.overlaymeta').fadeOut(hoverFade);
	});
	
	
	
	/*---------------------------------------------- 
				R E S P ON S I V E   N A V 
	------------------------------------------------*/
	jQuery(".header-right").prepend('<ul id="responsive-nav">'+jQuery("nav#main-nav ul").html()+'</ul>');
	
	

	if( jQuery().isotope ) {
	/*---------------------------------------------- 
				  C A L L   I S O T O P E   
	------------------------------------------------*/		
		$container = jQuery('.masonry');
		
		if (srvars.transforms == "false") { transforms = false; } else { transforms = true; }
		$container.imagesLoaded( function(){
			$container.isotope({
				itemSelector : '.masonry-item',
				transformsEnabled: transforms		// Important for videos
			});	
		});
		
	/*---------------------------------------------- 
				     F I L T E R
	------------------------------------------------*/
		jQuery('.masonryfilter li a').click(function(){
			
			jQuery('.masonryfilter li a').removeClass('active');
			jQuery(this).addClass('active');
			
			var selector = jQuery(this).attr('data-option-value');
			$container.isotope({ filter: selector });
			
			return(false);
		});
			
		
	/*---------------------------------------------- 
				 I S O T O P E : Organize
	------------------------------------------------*/	
		reorganizeIsotope('.masonry');
		
		jQuery(window).resize(function() {
			reorganizeIsotope('.masonry');
		});
		
		
		
	/*---------------------------------------------- 
				 I S O T O P E : Load More
	------------------------------------------------*/	
		var load_more = jQuery('#load-more a'),
						origtext = load_more.text(),
						maxnumpage = jQuery('#load-more a').data('maxnumpage'),
						type = jQuery('#load-more a').data('type'),
						tax = jQuery('#load-more a').data('tax'),
						page = 1;

		load_more.click(function(){
			page++;
			jQuery('#loading').fadeIn(500);
			var filterValue = jQuery('.masonryfilter li a.active').attr('data-option-value');
			
			jQuery.ajax({type:'POST', url:srvars.ajaxurl, data: { action:'sr_load_more', page:page, type:type, tax:tax }, success: function(response) {
				$content = jQuery(response);
				$content.hide();
				
				jQuery($content).imagesLoaded(function() {
					jQuery('.masonry').append( $content );
					initialise('body');
					reorganizeIsotope('.masonry');
					jQuery('#loading').delay(300).fadeOut(500, function () {
						$content.show();
						jQuery('.masonry').isotope( 'appended', $content, function() {
							//$container.isotope({ filter: filterValue });
							initialise('body');
							reorganizeIsotope('.masonry');
							if(page >= maxnumpage) jQuery('#load-more').slideUp(500);
						});							  
					});
				});
	
			}});
			return false;
		});


		
	} /* END if isotope */
	
		
	
	/*---------------------------------------------- 
				   B A C K   T O P   T O P
	------------------------------------------------*/
	jQuery('#totop').click(function(){
		jQuery('html, body').animate({scrollTop: 0}, 600, $easingType);
		return false;						   
	});
	
	jQuery(window).scroll(function() {
		var position = jQuery(window).scrollTop();
		if ( position > 300 )  {
			jQuery( '#totop' ).fadeIn( 350 );
		} else { 
			jQuery( '#totop' ).fadeOut( 350 );
		}
	});

	
		
	/*---------------------------------------------- 
				 L I K E S   C O U N T S
	------------------------------------------------*/
	jQuery('.meta_likes a').live('click', function(){
		var id = jQuery(this).data('id');
		thislink = jQuery(this).attr('href');
		var values = "countlikes=1";
		
		jQuery.ajax({type:'POST', url:srvars.ajaxurl, data: { action:'sr_like', id:id }, success: function(response) { 
				if (response !== 'cookieset') {
					jQuery('.post-'+id).find('.meta_likes a .amount').html(response);
					jQuery('.post-'+id).find('.meta_likes a').addClass('likesactive');
				}
			}
		});
		
		return false;
	});
	
	
	
	
	/*---------------------------------------------- 
			 D R O P   D O W N   N A  V I
	------------------------------------------------*/
	// MAiN
	jQuery('nav li > ul').append('<span></span>');
	jQuery('nav li').hover(function() {
			jQuery(this).children('ul').fadeIn(200);
	}, function() {
			jQuery(this).children('ul').fadeOut(200);
	});
	
	// RESPONSIVE NAV
	jQuery('#dropdown-menu').click(function() {
		if (jQuery(this).siblings('#responsive-nav').css('display') == 'none') {							
			jQuery(this).siblings('#responsive-nav').fadeIn(200);
			jQuery(this).siblings('#responsive-nav').find('ul ul').show();
		} else {
			jQuery(this).siblings('#responsive-nav').fadeOut(200);
			jQuery(this).siblings('#responsive-nav').find('ul ul').hide();
		}
		return false;
	});
	
	
	// RESPONSIVE NAV
	jQuery('.filter .openfilter').click(function() {
		if (jQuery(this).siblings('ul').css('display') == 'none') {							
			jQuery(this).siblings('ul').fadeIn(200);
		} else {
			jQuery(this).siblings('ul').fadeOut(200);
		}
		return false;
	});
	
	// FILTER
	jQuery('.filter').hover(function() {
		if (jQuery(window).width() > 1024) { jQuery(this).children('ul').fadeIn(200); }
	}, function() {
		if (jQuery(window).width() > 1024) { jQuery(this).children('ul').fadeOut(200); }
	});
	
	
	
	/*---------------------------------------------- 
				   F A N C Y B O X
	------------------------------------------------*/
	jQuery('.openfancybox').fancybox();
	jQuery('dl.gallery-item a').fancybox();
	
	
		
	
	/*---------------------------------------------- 
				      T O G G L E  &  A C C O R D I O N
	------------------------------------------------*/		
	jQuery(".toggle_title a").live('click', function() { 
		
		var parentdiv = jQuery(this).parent('div').parent('div').parent('div');
		var active = jQuery(this).parent('div').parent('div').find('.toggle_inner').css('display');
		if (jQuery(parentdiv).attr('class') == 'accordion') {
			if (active !== 'none' ) { 
				jQuery(parentdiv).find('.toggle .toggle_inner').slideUp(300);
				jQuery(this).toggleClass('active');
			} else {
				jQuery(parentdiv).find('.toggle .toggle_inner').slideUp(300);
				jQuery(parentdiv).find('.toggle .toggle_title a').removeClass('active');
				
				jQuery(this).toggleClass('active');
				jQuery(this).parent().siblings('.toggle_inner').slideToggle(300);
			}
		} else {
			jQuery(this).toggleClass('active');
			jQuery(this).parent().siblings('.toggle_inner').slideToggle(300);
		}
		
		var status = jQuery(this).find('span').html();
		if (status == '+') { jQuery(this).find('span').html('-'); } else { jQuery(this).find('span').html('+'); }
		
		return(false);
	});
	
	
	
	
	/*---------------------------------------------- 
				        T A B S 
	------------------------------------------------*/	
	jQuery(".tab_nav a").live('click', function() { 
		
		var parentdiv = jQuery(this).parent('li').parent('ul').parent('div');
		var rel = jQuery(this).attr('href');
		
		jQuery(parentdiv).find(".tab_nav a").removeClass("active");
		jQuery(this).addClass("active");
		
		jQuery(parentdiv).find(".tab_container .tab_content").hide().removeClass('active');
		jQuery(parentdiv).find(".tab_container ."+rel).fadeIn(500).addClass('active');
		
		return(false);
		
	});
	
		
	
	// functions
	initialise('body'); 			// call initialise functions
	resize_jplayer();		// call resize jplayer functions
	responsive('start');			// manage element sizes
	
	jQuery(window).resize(function() {
		resize_jplayer();		// call resize jplayer functions
		responsive('resize');			// manage element sizes
	});
	
});  // END jQuery(window).load(function($) {




/*---------------------------------------------- 
		R E O R G A N I Z E   I S O T O P E
------------------------------------------------*/
function reorganizeIsotope(container) {
	$container = jQuery(container);
	var maxitemwidth = srvars.width;
	var containerwidth = $container.width();
	var containerwidth = (containerwidth / 110) * 100;
	var containerrightmargin = parseInt($container.children('div').css('marginRight'));
	var containerleftpadding = parseInt($container.css('paddingLeft'));
	var containerrightpadding = parseInt($container.css('paddingRight'));
	var totalwidth = containerwidth - containerleftpadding - containerrightpadding;
	var rows = Math.ceil(totalwidth/maxitemwidth);
	var marginperrow = (rows-1)*containerrightmargin;
	var newitemmargin = marginperrow / rows;
	var itemwidth = Math.floor((totalwidth/rows)-newitemmargin+1);
	$container.children('div').css({ 'width': itemwidth+'px' });
	$container.isotope( 'reLayout' );
}



/*---------------------------------------------- 
				R E S P O N S I V E
------------------------------------------------*/
function responsive(type) {
	
	/* --  Main Sizes/Height  -- */
	var headerHeight = jQuery('header').height();
	var footerHeight = jQuery('footer').height();
	var windowHeight = jQuery(window).height();
	var windowwidth = jQuery(window).width();
	var mainHeight = parseInt(windowHeight - headerHeight - footerHeight);
	var footerposition = jQuery('footer').css('position');
	var headerposition = jQuery('header').css('position');
	
	
	
	if (footerposition == 'fixed') { jQuery('#main').css({ 'paddingBottom': footerHeight+'px'}); } else { jQuery('#main').css({ 'paddingBottom': '0px'}); }
	if (headerposition == 'fixed') { jQuery('#main').css({ 'paddingTop': headerHeight+'px'}); } else { jQuery('#main').css({ 'paddingTop': '0px'}); }
	jQuery('#main-inner').css({ 'minHeight': mainHeight+'px'});
	
	
	/* --  Fullscreen BG  -- */
	if ( jQuery('#fullscreen-bg').length > 0) {
		
		if ( windowwidth > 768) {
			jQuery('#fullscreen-bg').css({ 'height': windowHeight+'px'});
		} else {
			jQuery('#fullscreen-bg').css({ 'height': '300px', 'top' : 'inherit'});
		}
		
		var imgwidth = jQuery('#fullscreen-bg img').width();
		var imgheight = jQuery('#fullscreen-bg img').height();
		var imgratio = imgwidth / imgheight;
		
		var containerwidth = jQuery('#fullscreen-bg').width();
		var containerheight = jQuery('#fullscreen-bg').height();
		var containerratio = containerwidth / containerheight;
				
		if (imgratio > containerratio) {
			jQuery('#fullscreen-bg img').css({ 'height': '100%', 'width': 'auto', 'maxWidth': 'inherit'});
			var margin =  Math.ceil(parseInt(jQuery('#fullscreen-bg img').width() - jQuery('#fullscreen-bg ').width()) / 2);
			jQuery('#fullscreen-bg img').css({ 'marginLeft': '-'+margin+'px', 'marginTop': '0'});
		} else {
			jQuery('#fullscreen-bg img').css({ 'width': '100%', 'height': 'auto', 'maxHeight': 'inherit'});
			var margin =  Math.ceil(parseInt(jQuery('#fullscreen-bg img').height() - jQuery('#fullscreen-bg ').height()) / 2);
			jQuery('#fullscreen-bg img').css({ 'marginTop': '-'+margin+'px', 'marginLeft': '0'});
		}
		
	}
	
	
	if ( windowwidth <= 768) {
		jQuery('.page-template-template-portfolio-php .mainside').css({'width':'100%'});
		jQuery('.page-template-template-portfolio-php .maincontent').css({'width':'100%'});
		jQuery('.page-template-template-portfolio-php .mainside-bg').css({'width':'100%'});
		
		jQuery('.blog .mainside').css({'width':'100%'});
		jQuery('.blog .maincontent').css({'width':'100%'});
		jQuery('.blog .mainside-bg').css({'width':'100%'});
		
		jQuery('.single .mainside').css({'width':'100%'});
		jQuery('.single .maincontent').css({'width':'100%'});
		jQuery('.single .mainside-bg').css({'width':'100%'});
	} else {
		jQuery('#loading').css({'top':'0'});
		
		if (jQuery('.maincontent .content-inner').text().trim().length > 0 && jQuery('.maincontent').height() > 0 ) {
			jQuery('.page-template-template-portfolio-php .mainside').css({'width':srvars.asidewidth+'%'});
			jQuery('.page-template-template-portfolio-php .maincontent').css({'width':srvars.contentwidth+'%'});
			jQuery('.page-template-template-portfolio-php .mainside-bg').css({'width':srvars.asidewidth+'%'});
			
			jQuery('.blog .mainside').css({'width':srvars.asidewidth+'%'});
			jQuery('.blog .maincontent').css({'width':srvars.contentwidth+'%'});
			jQuery('.blog .mainside-bg').css({'width':srvars.asidewidth+'%'});
			
			jQuery('.single .mainside').css({'width':srvars.asidewidth+'%'});
			jQuery('.single .maincontent').css({'width':srvars.contentwidth+'%'});
			jQuery('.single .mainside-bg').css({'width':srvars.asidewidth+'%'});
		} else {
			jQuery('.page-template-template-portfolio-php .mainside').css({'width':'100%'});
			jQuery('.page-template-template-portfolio-php .maincontent').css({'width':'0'});
			jQuery('.page-template-template-portfolio-php .mainside-bg').css({'width':'100%'});
			
			jQuery('.blog .mainside').css({'width':'100%'});
			jQuery('.blog .maincontent').css({'width':'0'});
			jQuery('.blog .mainside-bg').css({'width':'100%'});
			
			jQuery('.single .mainside').css({'width':'100%'});
			jQuery('.single .maincontent').css({'width':'0'});
			jQuery('.single .mainside-bg').css({'width':'100%'});
		}
	}
	
}


/*---------------------------------------------- 
			I N I T I A L I S E
------------------------------------------------*/
function initialise(content) { 
		
	/*---------------------------------------------- 
				   I M G   H O V E R
	------------------------------------------------*/
		
	// check if .overlay already exists or not
	jQuery('.imgoverlay a').each(function(index){
		if(jQuery(this).find('.overlay').length == 0) { 
			jQuery(this).prepend('<div class="overlay"></div>');
		}
		if(jQuery(this).find('.overlaymeta').length !== 0) { 
			var margintop = Math.round(jQuery(this).find('.overlaymeta').height() / 2);
			jQuery(this).find('.overlaymeta').css({ marginTop: '-'+margintop+'px' });
		}
		jQuery(this).find('.overlay').show();
		jQuery(this).find('.overlay').css({ opacity: 0 });
	});
	
	
	/*---------------------------------------------- 
				   C H E C K   F O R M
	------------------------------------------------*/
	// create the checkfalse div's
	jQuery(content+' #commentform').addClass('checkform');  // apply the class to the comment form function
	jQuery(content+' .checkform .req').each(function(){
		if (jQuery(this).siblings('div').find('.ckeckfalse').length) {
			//jQuery(this).siblings('div').append('<span class="checkfalse"><span class="falseicon"></span></span>');
		} else {
			jQuery(this).siblings('div').append('<span class="checkfalse"><span class="falseicon"></span></span>');
		}
	});
	jQuery(content+' .checkfalse').hide();
	
	
	
	/*---------------------------------------------- 
				   F L E X S L I D E R
	------------------------------------------------*/
	jQuery(content+' .slider').each(function(index){
		var thisid = jQuery(this).attr('id');	
			jQuery("#"+thisid+" .flexslider").flexslider({
			controlsContainer: "#"+thisid,
			animation: "fade",
			slideshowSpeed: 7000,
			animationDuration: 600,
			slideshow: false,
			directionNav: true,
			controlNav: false,
			smoothHeight: false,
			touch: true,
			video: true,
			randomize: false
		}); //end flexslider
	});
	
		
} // END function initialise()




/*---------------------------------------------- 
		R E S P O N S I V E   J P L A Y E R
------------------------------------------------*/
function resize_jplayer() {
	if(jQuery().jPlayer && jQuery('.jp-interface').length){
		jQuery('.jp-interface').each(function(){ 
			var playerwidth = jQuery(this).width();	
			var newwidth = playerwidth - 145;
			jQuery(this).find('.jp-progress-container').css({ width: newwidth+'px' });
		});
		
	}
}
