function quotescollection_timer(instance, current, show_author, show_source, filter_tags, char_limit, auto_refresh, random_refresh)
{
	var time_interval = auto_refresh * 1000;
	if( (QCAjax.auto_refresh_max == 0) || (QCAjax.auto_refresh_count < QCAjax.auto_refresh_max) ) {
		setTimeout("quotescollection_refresh("+instance+", "+current+", "+show_author+", "+show_source+", '"+filter_tags+"', "+char_limit+", "+auto_refresh+", "+random_refresh+")", time_interval);
		QCAjax.auto_refresh_count += 1;
	}
}



function quotescollection_refresh(instance, current, show_author, show_source, filter_tags, char_limit, auto_refresh, random_refresh)
{
	jQuery("#quotescollection_nextquote-"+instance).html(QCAjax.loading);
	jQuery.ajax({
		type: "POST",
		url: QCAjax.ajaxurl,
		data: "action=quotescollection&_ajax_nonce="+QCAjax.nonce+"&refresh="+instance+"&current="+current+"&show_author="+show_author+"&show_source="+show_source+"&char_limit="+char_limit+"&tags="+filter_tags+"&auto_refresh="+auto_refresh+"&random_refresh="+random_refresh,
		success: function(response) {
			if(response == '-1') {
				if(auto_refresh == 0)
					jQuery("#quotescollection_nextquote-"+instance).html('<a class=\"quotescollection_refresh\" style=\"cursor:pointer\" onclick=\"quotescollection_refresh(\''+instance+'\', \''+current+'\', \''+show_author+'\', \''+show_source+'\', \''+filter_tags+'\', \''+char_limit+'\', \'0\', \''+random_refresh+'\');\">'+QCAjax.nextquote+'</a>');
				else
					quotescollection_timer(instance, current, show_author, show_source, filter_tags, char_limit, auto_refresh, random_refresh);
			}
			else {
				jQuery("#quotescollection_randomquote-"+instance).hide();
				jQuery("#quotescollection_randomquote-"+instance).html( response );
				jQuery("#quotescollection_randomquote-"+instance).fadeIn("slow");	
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			console.log(textStatus+' '+xhr.status+': '+errorThrown);
			if(auto_refresh == 0)
				jQuery("#quotescollection_nextquote-"+instance).html('<a class=\"quotescollection_refresh\" style=\"cursor:pointer\" onclick=\"quotescollection_refresh(\''+instance+'\', \''+current+'\', \''+show_author+'\', \''+show_source+'\', \''+filter_tags+'\', \''+char_limit+'\', \'0\', \''+random_refresh+'\');\">'+QCAjax.nextquote+'</a>');
		}	
	});
}

