/**
 * Plugin: kk Star Ratings
 *
 * Description: js for the wordpress plugin kk Star Ratings.
 *
 * @package kk Star Ratings
 * @subpackage WordPress Plugin
 * @author Kamal Khan
 * @plugin_uri http://wakeusup.com/2011/05/kk-star-ratings/
 */

(function($, window, document, undefined){

	$.fn.kkstarratings = function(options)
	{
		$.fn.kkstarratings.options = $.extend({
			ajaxurl   : null,
			nonce     : null,
			func      : null,
			grs       : false,
			msg       : 'Rate this post',
			fuelspeed : 400,
			thankyou  : 'Thank you for rating.',
			error_msg : 'An error occured.',
			tooltip   : true,
			tooltips  : {
				0 : {
					tip   : "Poor",
					color : "red"
				},
				1 : {
					tip   : "Fair",
					color : "brown"
				},
				2 : {
					tip   : "Average",
					color : "orange"
				},
				3 : {
					tip   : "Good",
					color : "blue"
				},
				4 : {
					tip   : "Excellent",
					color : "green"
				}
			}
		}, $.fn.kkstarratings.options, options ? options : {});

		var Objs = [];
		this.each(function(){
			Objs.push($(this));
		});

		$.fn.kkstarratings.fetch(Objs, 0, '0%', $.fn.kkstarratings.options.msg, true);

		return this.each(function(){});

    };

	$.fn.kkstarratings.animate = function(obj)
	{
		if(!obj.hasClass('disabled'))
		{
			var legend = $('.kksr-legend', obj).html(),
				fuel = $('.kksr-fuel', obj).css('width');
			$('.kksr-stars a', obj).hover( function(){
				var stars = $(this).attr('href').split('#')[1];
				if($.fn.kkstarratings.options.tooltip!=0)
				{
					if($.fn.kkstarratings.options.tooltips[stars-1]!=null)
					{
						$('.kksr-legend', obj).html('<span style="color:'+$.fn.kkstarratings.options.tooltips[stars-1].color+'">'+$.fn.kkstarratings.options.tooltips[stars-1].tip+'</span>');
					}
					else
					{
						$('.kksr-legend', obj).html(legend);
					}
				}
				$('.kksr-fuel', obj).stop(true,true).css('width', '0%');
				$('.kksr-stars a', obj).each(function(index, element) {
					var a = $(this),
						s = a.attr('href').split('#')[1];
					if(parseInt(s)<=parseInt(stars))
					{
						$('.kksr-stars a', obj).stop(true, true);
						a.hide().addClass('kksr-star').addClass('orange').fadeIn('fast');
					}
				});
			}, function(){
				$('.kksr-stars a', obj).removeClass('kksr-star').removeClass('orange');
				if($.fn.kkstarratings.options.tooltip!=0) $('.kksr-legend', obj).html(legend);
				$('.kksr-fuel', obj).stop(true,true).animate({'width':fuel}, $.fn.kkstarratings.options.fuelspeed);
			}).unbind('click').click( function(){
				return $.fn.kkstarratings.click(obj, $(this).attr('href').split('#')[1]);
			});
		}
		else
		{
			$('.kksr-stars a', obj).unbind('click').click( function(){ return false; });
		}
	};

	$.fn.kkstarratings.update = function(obj, per, legend, disable, is_fetch)
	{
		if(disable=='true')
		{
			$('.kksr-fuel', obj).removeClass('yellow').addClass('orange');
		}
		$('.kksr-fuel', obj).stop(true, true).animate({'width':per}, $.fn.kkstarratings.options.fuelspeed, 'linear', function(){
			if(disable=='true')
			{
				obj.addClass('disabled');
				$('.kksr-stars a', obj).unbind('hover');
			}
			if(!$.fn.kkstarratings.options.grs || !is_fetch)
			{
				$('.kksr-legend', obj).stop(true,true).hide().html(legend?legend:$.fn.kkstarratings.options.msg).fadeIn('slow', function(){
					$.fn.kkstarratings.animate(obj);
				});
			}
			else
			{
				$.fn.kkstarratings.animate(obj);
			}
		});
	};

	$.fn.kkstarratings.click = function(obj, stars)
	{
		$('.kksr-stars a', obj).unbind('hover').unbind('click').removeClass('kksr-star').removeClass('orange').click( function(){ return false; });
		
		var legend = $('.kksr-legend', obj).html(),
			fuel = $('.kksr-fuel', obj).css('width');
		
		$.fn.kkstarratings.fetch(obj, stars, fuel, legend, false);
		
		return false;
	};

	$.fn.kkstarratings.fetch = function(obj, stars, fallback_fuel, fallback_legend, is_fetch)
	{
		var postids = [];
		$.each(obj, function(){
			postids.push($(this).attr('data-id'));
		});
		$.ajax({
			url: $.fn.kkstarratings.options.ajaxurl,
			data: 'action='+$.fn.kkstarratings.options.func+'&id='+postids+'&stars='+stars+'&_wpnonce='+$.fn.kkstarratings.options.nonce,
			type: "post",
			dataType: "json",
			beforeSend: function(){
				$('.kksr-fuel', obj).animate({'width':'0%'}, $.fn.kkstarratings.options.fuelspeed);
				if(stars)
				{
					$('.kksr-legend', obj).fadeOut('fast', function(){
						$('.kksr-legend', obj).html('<span style="color: green">'+$.fn.kkstarratings.options.thankyou+'</span>');
					}).fadeIn('slow');
				}
			},
			success: function(response){
				$.each(obj, function(){
					var current = $(this),
						current_id = current.attr('data-id');
					if(response[current_id].success)
					{
						$.fn.kkstarratings.update(current, response[current_id].fuel+'%', response[current_id].legend, response[current_id].disable, is_fetch);
					}
					else
					{
						$.fn.kkstarratings.update(current, fallback_fuel, fallback_legend, false, is_fetch);
					}
				});
			},
			complete: function(){
				
			},
			error: function(e){
				$('.kksr-legend', obj).fadeOut('fast', function(){
					$('.kksr-legend', obj).html('<span style="color: red">'+$.fn.kkstarratings.options.error_msg+'</span>');
				}).fadeIn('slow', function(){
					$.fn.kkstarratings.update(obj, fallback_fuel, fallback_legend, false, is_fetch);
				});
			}
		});
	};

	$.fn.kkstarratings.options = {
		ajaxurl   : bhittani_plugin_kksr_js.ajaxurl,
		func      : bhittani_plugin_kksr_js.func,
		nonce     : bhittani_plugin_kksr_js.nonce,
		grs       : bhittani_plugin_kksr_js.grs,
		tooltip   : bhittani_plugin_kksr_js.tooltip,
		tooltips  : bhittani_plugin_kksr_js.tooltips,
		msg       : bhittani_plugin_kksr_js.msg,
		fuelspeed : bhittani_plugin_kksr_js.fuelspeed,
		thankyou  : bhittani_plugin_kksr_js.thankyou,
		error_msg : bhittani_plugin_kksr_js.error_msg
	};
   
})(jQuery, window, document);

jQuery(document).ready( function($){
	$('.kk-star-ratings').kkstarratings();
});