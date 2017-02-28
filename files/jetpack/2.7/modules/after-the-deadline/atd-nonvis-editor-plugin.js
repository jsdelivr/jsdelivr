var AtD_qtbutton;
/* convienence method to restore the text area from the preview div */
function AtD_restore_text_area()
{
	/* clear the error HTML out of the preview div */
	AtD.remove('content');

	/* swap the preview div for the textarea, notice how I have to restore the appropriate class/id/style attributes */
    var content = jQuery('#content').html();

	if ( navigator.appName == 'Microsoft Internet Explorer' )
		content = content.replace(/<BR.*?class.*?atd_remove_me.*?>/gi, "\n");

	jQuery('#content').replaceWith( AtD.content_canvas );
	jQuery('#content').val( content.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&amp;/g, '&') );
	jQuery('#content').height(AtD.height);

	if ( AtD_qtbutton ) {
		/* change the link text back to its original label */
		jQuery(AtD_qtbutton).val( AtD.getLang('button_proofread', 'proofread') );
		jQuery(AtD_qtbutton).css({ 'color' : '#464646' });

		/* enable the toolbar buttons */
		jQuery( AtD_qtbutton ).siblings('input').andSelf().attr( 'disabled', false );
	}

	/* restore autosave */
	if ( AtD.autosave != undefined )
		autosave = AtD.autosave;
};

// add the AtD button properly to quicktags
if ( typeof(QTags) != 'undefined' && QTags.addButton ) {
	jQuery(document).ready(function($){
		QTags.addButton( 'AtD', AtD_l10n_r0ar.button_proofread, AtD_check );
	});
} else {
	edButtons[edButtons.length] = new edButton('ed_AtD', 'AtD', '', '', '');
	jQuery(document).ready(function($){
		$('#ed_AtD').replaceWith('<input type="button" id="ed_AtD" accesskey="" class="ed_button" onclick="AtD_check(this);" value="' + AtD_l10n_r0ar.button_proofread + '" />');
	});
}

function AtD_restore_if_proofreading() {
	if ( AtD_qtbutton && jQuery(AtD_qtbutton).val() == AtD.getLang('button_edit_text', 'edit text') )
		AtD_restore_text_area();
}

function AtD_unbind_proofreader_listeners() {
	jQuery('#save-post, #post-preview, #publish, #edButtonPreview').unbind('focus', AtD_restore_if_proofreading );
	jQuery('#add_poll, #add_image, #add_video, #add_audio, #add_media').unbind('click', AtD_restore_if_proofreading );
	jQuery('#post').unbind('submit', AtD_restore_if_proofreading );
}

function AtD_bind_proofreader_listeners() {
	jQuery('#save-post, #post-preview, #publish, #edButtonPreview').focus( AtD_restore_if_proofreading );
	jQuery('#add_poll, #add_image, #add_video, #add_audio, #add_media').click( AtD_restore_if_proofreading );
	jQuery('#post').submit( AtD_restore_if_proofreading );
}

/* where the magic happens, checks the spelling or restores the form */
function AtD_check(button) {
	var callback;
	if ( jQuery.isFunction( button ) ) {
		callback = button;

		if ( !AtD_qtbutton ) {
			AtD_qtbutton = jQuery( '#qt_content_AtD, #ed_AtD' ).get( 0 );
		}
	} else {
		if ( !button.id )
			button = button[0];

		AtD_qtbutton = button;
	}

	if ( !jQuery('#content').size() ) {
		if ( 'undefined' !== typeof callback ) {
			callback( 0 );
		}
		AtD_restore_if_proofreading();
		return;
	}

	/* If the text of the link says edit comment, then restore the textarea so the user can edit the text */

	if ( jQuery(AtD_qtbutton).val() == AtD.getLang('button_edit_text', 'edit text') ) {
		AtD_restore_text_area();
	} else {
		/* initialize some of the stuff related to this plugin */
		if ( !AtD.height ) {

			AtD.height = jQuery('#content').height();
			AtD_bind_proofreader_listeners();

			/* make it so clicking the Visual button works when AtD is active */

			jQuery('#edButtonPreview').attr( 'onclick', null ).click( function() {
				AtD_restore_if_proofreading();
				switchEditors.go( 'content', 'tinymce' );
			});

			/* saved the textarea as we need to restore the original one for the toolbar to continue to function properly */
			AtD.content_canvas = jQuery('#content');

			/* store the autosave, we're going to make it empty during spellcheck to prevent auto saved text from being
			   over written with empty text */
			AtD.autosave = autosave;
		}

		/* set the spell check link to a link that lets the user edit the text */
		/* disable the button to prevent a race condition where content is deleted if proofread is clicked with a check
		   in progress. */
		jQuery(AtD_qtbutton).css({ 'color' : 'red' }).val( AtD.getLang('button_edit_text', 'edit text') ).attr('disabled', true);

		/* replace the div */
		var text = jQuery('#content').val().replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');

		if (navigator.appName == 'Microsoft Internet Explorer') {
			text = text.replace(/[\n\r\f]/gm, '<BR class="atd_remove_me">');
			var node = jQuery('<div class="input" id="content" style="height: 170px">' + text + '</div>');
			jQuery('#content').replaceWith(node);
			node.css( { 'overflow' : 'auto', 'background-color' : 'white', 'color' : 'black' } );
		} else {
			jQuery('#content').replaceWith('<div class="input" id="content">' + text + '</div>');
			jQuery('#content').css( { 'overflow' : 'auto', 'background-color' : 'white', 'color' : 'black', 'white-space' : 'pre-wrap' } );
			jQuery('#content').height(AtD.height);
		}

		/* kill autosave... :) */
		autosave = function() { };

		/* disable the toolbar buttons */
		jQuery( AtD_qtbutton ).siblings('input').andSelf().attr( 'disabled', true ); // using .arrt instead of .prop so it's compat with older WP and jQuery

		/* check the writing in the textarea */
		AtD.check('content', {
			success: function(errorCount) {
				if ( errorCount == 0 && typeof callback !== 'function' )
					alert( AtD.getLang('message_no_errors_found', 'No writing errors were found') );
				AtD_restore_if_proofreading();
			},

			ready: function(errorCount) {
				jQuery(AtD_qtbutton).attr('disabled', false);

				if ( typeof callback === 'function' )
					callback( errorCount );
			},

			error: function(reason) {
				jQuery(AtD_qtbutton).attr('disabled', false);

				if ( typeof callback === 'function' )
					callback( -1 );
				else
					alert( AtD.getLang('message_server_error', 'There was a problem communicating with the Proofreading service. Try again in one minute.') );

				AtD_restore_if_proofreading();
			},

			editSelection: function(element) {
				var text = prompt( AtD.getLang('dialog_replace_selection', 'Replace selection with:'), element.text() );

				if ( text != null )
					element.replaceWith( text );
			},

			explain: function(url) {
				var left = (screen.width / 2) - (480 / 2);
				var top = (screen.height / 2) - (380 / 2);
				window.open( url, '', 'width=480,height=380,toolbar=0,status=0,resizable=0,location=0,menuBar=0,left=' + left + ',top=' + top).focus();
			},

			ignore: function(word) {
				jQuery.ajax({
					type : 'GET',
					url : AtD.rpc_ignore + encodeURI( word ).replace( /&/g, '%26'),
					format : 'raw',
					error : function(XHR, status, error) {
						if ( AtD.callback_f != undefined && AtD.callback_f.error != undefined )
							AtD.callback_f.error(status + ": " + error);
					}
				});
			}
		});
	}
}
