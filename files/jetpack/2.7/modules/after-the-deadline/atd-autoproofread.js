/* the AtD/jQuery and AtD/TinyMCE plugins check if this variable exists and increment it when a proofread check happens */
var AtD_proofread_click_count = 0;

/* This is function called when the publish/update button is pressed */
function AtD_submit_check( e ) {
	/* User has already checked their document... no need to hold up their submit */
	if (AtD_proofread_click_count > 0)
		return;

	/* Let's not submit the form, shall we? */
	e.stopImmediatePropagation();
	e.preventDefault();

	/* We'll call the AtD function based on which editor is currently active */
	if ( typeof(tinyMCE) != 'undefined' && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden() ) {
		/* Woo! We're running tinyMCE! */
		tinyMCE.activeEditor.execCommand('mceWritingImprovementTool', AtD_submit_check_callback);
	} else {
		/* Go Go HTML editor! */
		AtD_restore_if_proofreading();
		AtD_check( AtD_submit_check_callback );
	}
}

/* This is the callback function that runs after the publish/update button is pressed */
function AtD_submit_check_callback(count) {
	count = count || 0;
	AtD_unbind_proofreader_listeners();

	if ( 0 == count || 1 < AtD_proofread_click_count ) {
		/* if no errors were found, submit form */
		AtD_update_post();
	} else if ( -1 == count ) {
		/* If there was an error, alert the user and submit form */
		alert( AtD.getLang('message_server_error', 'There was a problem communicating with the Proofreading service. Try again in one minute.') );
		AtD_update_post();
	} else {
		var original_post_status = jQuery('#original_post_status').val()

		/* Okay, the user has tried to publish/update already but there are still errors. Ask them what to do */
		var message;
		if ( original_post_status == 'publish' )
			message = AtD.getLang('dialog_confirm_post_publish', 'The proofreader has suggestions for this post. Are you sure you want to publish it?\n\nPress OK to publish your post, or Cancel to view the suggestions and edit your post.');
		else
			message = AtD.getLang('dialog_confirm_post_update', 'The proofreader has suggestions for this post. Are you sure you want to update it?\n\nPress OK to update your post, or Cancel to view the suggestions and edit your post.');

		if ( confirm( message ) ) {
			AtD_update_post();
		} else {
			AtD_bind_proofreader_listeners();
			AtD_kill_autoproofread();
		}

		/* Let's do some interface clean-up */
		jQuery('#publish').removeClass('button-primary-disabled');
		jQuery('#ajax-loading').hide();
	}
}

/* Stop the proofreader from doing its auto proofread thing (activated when the proofread button is clicked) */
function AtD_kill_autoproofread() {
	jQuery('#publish').unbind('click.AtD_submit_check');
}

/* a function to force the post to be submitted */
function AtD_update_post() {

	if ( typeof(tinyMCE) == 'undefined' || !tinyMCE.activeEditor || tinyMCE.activeEditor.isHidden() )
		AtD_restore_if_proofreading();

	jQuery('#publish').unbind('click.AtD_submit_check').click();
}

/* init the autoproofread options */
jQuery( document ).ready( function($){
	var orig_status = $('#original_post_status').val();

	/* check if auto-check is enabled && if #content exists */
	if ( typeof AtD_check_when != 'undefined' && $('#content').length
		&& ( ( orig_status != 'publish' && AtD_check_when.onpublish )
		|| ( ( orig_status == 'publish' || orig_status == 'schedule' ) && AtD_check_when.onupdate ) ) )
			$('#publish').bind( 'click.AtD_submit_check', AtD_submit_check );
});

