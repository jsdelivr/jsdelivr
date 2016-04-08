var followers_page_count = 1;  
var following_page_count = 1;
var activity_stream_page_count = 2;
var user_activity_page_count = 1;
var selected_tab = '';
var notifications_page = 1;
var social_loading_gif_html = '<span id="loading"><img src="' + TemplateP + '/img/ajax-loading.gif" alt="Loading" align="absmiddel" border="0" width="16" height="16" />  '+ pm_lang.please_wait +'</span>';

$(document).ready(function(){
	
	var notification_is_open = false;
	
	$('#notification_counter').click(function(e){
		if ($('#notification_temporary_display_container').html().length > 0) {
			$('#notification_temporary_display_container').html('').hide();
			notification_is_open = false;
			return false;
		}
		$('#notification_temporary_display_container').fadeIn();
		notifications_page = 1;
		notification_load_more();
		notification_is_open = true;
		
		e.stopPropagation();
		return false;
	});

	$(document).click(function(){
		//if ($('#notification_temporary_display_container').html().length > 0) {
		if (notification_is_open) {
		  $('#notification_temporary_display_container').html('').hide();
		}
	});
	
	$('a[data-toggle="tab"]').on('show', function (e) {		
		$.waypoints().each(function(){
			$(this).waypoint('destroy');
		});
	});
	
	$('a[data-toggle="tab"]').on('shown', function (e) {
	    var target = String(e.target);
		var tabname = target.split('#');

		selected_tab = tabname[1];
		 
		if (tabname[1] == 'pm-pro-followers') {
			if (followers_page_count == 1) {
				follow_load_more('getfollowers');
			} else {
				bind_waypoint('btn_follow_load_more',  {
						offset: "110%",
						triggerOnce: true
					}, function(){
						follow_load_more('getfollowers');
						return false
					});
			}
		}
		if (tabname[1] == 'pm-pro-following') {
			if (following_page_count == 1) {
				follow_load_more('getfollowing');
			} else {
				bind_waypoint('btn_follow_load_more', {
						offset: "110%",
						triggerOnce: true
					}, function(){
						follow_load_more('getfollowing');
						return false
					});
			}
		}
		if (tabname[1] == 'pm-pro-activity-stream') {
			bind_waypoint('btn_activity_stream_load_more', {
					offset: "110%",
					triggerOnce: true
				}, function(){
					activity_stream_load_more();
				});
		}
		if (tabname[1] == 'pm-pro-user-activity') {
			if (user_activity_page_count == 1) {
				user_activity_load_more();
			} else {
				bind_waypoint('btn_follow_load_more', {
						offset: "110%",
						triggerOnce: true
					}, function(){
						user_activity_load_more();
						return false;
					});
			}
		}
	});
	
	bind_follow_actions();
	
	bind_user_activity_actions();
	bind_waypoint('btn_activity_stream_load_more', {
			offset: "110%",
			triggerOnce: true
		}, function(){
			activity_stream_load_more();
		});
	
	$('#hide_who_to_follow').click(function(){
		$.cookie('suggest_profiles', 'no', { expires: 15, path: '/' });
		$('.pm-pro-suggest-follow').fadeOut();
		return false;
	});
});

function notification_load_more()
{
	if (notifications_page == 1) {
		$('#notification_temporary_display_container').append(social_loading_gif_html);
	} else {
		$('#notification_temporary_display_container #btn_notifications_load_more').replaceWith(social_loading_gif_html);
	}
	
	$.ajax({
        type: "GET",
        url: MELODYURL2 + "/ajax.php",
		dataType: "html",
        data: {
			"p": "profile",
			"do": "load-notifications",
			"uid": $('input[name="profile_user_id"]').val(),
			"page": notifications_page
        },
        dataType: "html",
        success: function(data){
			$('#notification_temporary_display_container #loading').remove();
			if (notifications_page == 1) {
				$('#notification_temporary_display_container').html(data);//.fadeIn();
			} else {
				$('#notification_temporary_display_container').append(data);
			}
			notifications_page++;
			
			bind_waypoint('btn_notifications_load_more', {
					context: '#notification_temporary_display_container',
					offset: "110%",
					triggerOnce: true
				}, function(){
					notification_load_more();
					return false;
				});
        }
	});
	return false;
}

function bind_waypoint(selector_id, settings, callback)
{
	var found = false;
	$.waypoints().each(function(){
		if ($(this).attr('id') == selector_id) {
			found = true;
		}
	});	
	if ( ! found) {
		$('#'+ selector_id).waypoint(function(){
			if (callback && typeof(callback) === "function") {  
		        callback();  
		    }  
		}, settings);
	}
	
	return false;
}

function bind_user_activity_actions()
{
	// unbind first, to avoid same event firing multiple times
	$('[id^="hide-activity-"]').unbind('click');
	
	$('[id^="hide-activity-"]').click(function(){
		var activity_id = $(this).attr('id').match(/\d+/);

		if ( ! activity_id) {
			return false;
		}
		
		$.ajax({
	        type: "GET",
	        url: MELODYURL2 + "/ajax.php",
	        data: {
				"p": "profile",
				"do": "user-activity-hide",
				"uid": $('input[name="profile_user_id"]').val(),
				"activity_id": activity_id[0]
	        },
	        dataType: "html",
	        success: function(data){
				$('#activity-' + activity_id[0]).fadeOut();
				return false;
	        }
    	});
		return false;
	});
}

function user_activity_load_more()
{
	if (user_activity_page_count == 1) {
		$('#pm-pro-user-activity-content').append(social_loading_gif_html);
	} else {
		$('#pm-pro-user-activity-content #btn_user_activity_load_more').replaceWith(social_loading_gif_html);
	}
	
	$.ajax({
        type: "GET",
        url: MELODYURL2 + "/ajax.php",
        data: {
			"p": "profile",
			"do": "user-activity",
			"uid": $('input[name="profile_user_id"]').val(),
			"page": user_activity_page_count
        },
        dataType: "html",
        success: function(data){
			$('#pm-pro-user-activity-content #loading').remove();
			$("#pm-pro-user-activity-content").append(data);
			user_activity_page_count++;
			//bind_user_activity_waypoint();
			bind_waypoint('btn_user_activity_load_more',{
					offset: "110%",
					triggerOnce: true
				}, function(){
					user_activity_load_more();
					return false;
				});
			
			// bind hide function
			bind_user_activity_actions();
			return false;
        }
    });
    return false;
}

function activity_stream_load_more()
{
	if (activity_stream_page_count == 1) {
		$('#pm-pro-activity-stream-content').append(social_loading_gif_html);
	} else {
		$('#pm-pro-activity-stream-content #btn_activity_stream_load_more').replaceWith(social_loading_gif_html);
	}
	$.ajax({
        type: "GET",
        url: MELODYURL2 + "/ajax.php",
        data: {
			"p": "profile",
			"do": "activity-stream",
			"uid": $('input[name="profile_user_id"]').val(),
			"page": activity_stream_page_count
        },
        dataType: "html",
        success: function(data){
			$('#pm-pro-activity-stream-content #loading').remove();
			$("#pm-pro-activity-stream-content").append(data);
			activity_stream_page_count++;
			bind_waypoint('btn_activity_stream_load_more', {
					offset: "110%",
					triggerOnce: true
				}, function(){
					activity_stream_load_more();
				});
			bind_user_activity_actions();
			return false;
        }
    });
    return false;
}

function bind_follow_actions() {
	
	// unbind first, to avoid same event firing multiple times
	$('*[id^="btn_follow_"]').unbind('click');
	$('*[id^="btn_unfollow_"]').unbind('click');
	
	$('*[id^="btn_follow_"]').click(function(){
		var id = $(this).attr('id');
		 
		var user_id = id.match(/\d+/);
		if ( ! user_id) { 
			return false;
		}
		
		$(this).attr("disabled", "disabled").addClass("disabled");

		follow_send_request('follow', user_id[0]);
		
		return false;
	});
	
	$('*[id^="btn_unfollow_"]').click(function(){
		var id = $(this).attr('id');
		 
		var user_id = id.match(/\d+/);
		if ( ! user_id) { 
			return false;
		}
		
		$(this).attr("disabled", "disabled").addClass("disabled");
		
		follow_send_request('unfollow', user_id[0]);
		return false;
	});
}


function follow_load_more(follow_type) {
	
	if ( ! follow_type) {
		return false;
	}
	
	if (follow_type == "getfollowers") {
		var page_count = followers_page_count;
		if (page_count == 1) {
			$('#pm-pro-followers-content').append(social_loading_gif_html);
		} else {
			$('#btn_follow_load_more').replaceWith(social_loading_gif_html);
		}
	} else {
		var page_count = following_page_count;
		if (page_count == 1) {
			$('#pm-pro-following-content').append(social_loading_gif_html);
		} else {
			$('#btn_follow_load_more').replaceWith(social_loading_gif_html);
		}
	}
	
	$.ajax({
        type: "GET",
        url: MELODYURL2 + "/ajax.php",
        data: {
			"p": "profile",
			"do": follow_type,
			"uid": $('input[name="profile_user_id"]').val(),
			"page": page_count
        },
        dataType: "html",
        success: function(data){

			if (follow_type == "getfollowers") {
				$('#pm-pro-followers-content #loading').remove();
				$("#pm-pro-followers-content").append(data);
				
				followers_page_count++;
			} else {
				$('#pm-pro-following-content #loading').remove();
				$("#pm-pro-following-content").append(data);
				
				following_page_count++;
			}
			
			bind_follow_actions();
			
			bind_waypoint('btn_follow_load_more',  {
					offset: "110%",
					triggerOnce: true
				}, function(){
					follow_load_more(follow_type);
					return false
				});
			return false;
        }
    });
    return false
}

function follow_send_request(follow_type, user_id){
	
	if ( ! follow_type || ! user_id) {
		return false;
	}
	
    $.ajax({
        type: "POST",
        url: MELODYURL2 + "/ajax.php",
        data: {
			"p": "profile",
			"do": follow_type,
			"uid": user_id
        },
        dataType: "json",
        success: function(a){
            if (a.success == false) {
                alert(a.msg);
				$('#btn_follow_' + user_id).removeAttr("disabled").removeClass("disabled");
				return false
            }
			
			if (follow_type == "follow") {
				$('#btn_follow_' + user_id).replaceWith(a.html);
				bind_follow_actions();
			} else {
				$('#btn_unfollow_' + user_id).replaceWith(a.html);
				bind_follow_actions();
			}
            return false
        }
    });
    return false
}

function update_status() // onsubmit 
{
	var form = $('form[name="user-update-status"]');
	
	var txt = form.find('textarea').val();
	var parent_el = '#pm-pro-activity-stream-content';
	
	if (txt != form.find('textarea').attr('placeholder')) {
		
		form.find('button').attr("disabled", "disabled");
		
		if (selected_tab == 'pm-pro-user-activity') {
			parent_el = '#pm-pro-user-activity-content';
		}
		
		$(parent_el + ' #preview_status').html(social_loading_gif_html);//.remove();
		
		$.ajax({
	        type: "POST",
	        url: MELODYURL2 + "/ajax.php",
	        data: {
				"p": "profile",
				"do": "update-status",
				"uid": $('input[name="profile_user_id"]').val(),
				"txt": txt
	        },
	        dataType: "json",
	        success: function(data){
	            
				if (data.success == false) {
	                alert(data.msg); 
					$('#preview_status').html('');
	                return false;
	            }
				
				$(parent_el + ' #preview_status').replaceWith(data.html);

				bind_user_activity_actions();
				
				form.find('textarea').val('');
				form.find('button').removeAttr("disabled");
	        }
		});
	}
	
	return false;
}