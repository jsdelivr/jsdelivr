<?php
/**
 * Threaded comments
 *
 * @package Suffusion
 * @subpackage Templates
 */
?>
<section id="comments">
<?php
if (post_password_required()) { ?>
		<p class="nocomments"><?php _e("This post is password protected. Enter the password to view comments.", "suffusion");?></p>
	<?php
		return;
}
else {
	global $post, $post_id, $user_identity;
	global $suf_comment_label_styles, $suf_comment_label_name, $suf_comment_label_email, $suf_comment_label_uri, $suf_comment_label_your_comment, $suf_comment_label_name_req, $suf_comment_label_email_req, $suf_comments_disabled_all_sel, $suf_comments_disabled, $suf_comments_disabled_msg_for_posts;

	// Begin Comments & Trackbacks
	if ( have_comments() ) { ?>
<h3 class="comments"><span class="icon">&nbsp;</span>
	<?php printf(__('%1$s to &#8220;%2$s&#8221;', "suffusion"), comments_number(__('No Responses', "suffusion"), __('One Response', "suffusion"), __('% Responses', "suffusion")), get_the_title($post->ID));?>
</h3>
<?php
		suffusion_split_comments();
		suffusion_list_comments();
		suffusion_comment_navigation();
		// End Comments
	}
	
	if ('open' == $post->comment_status) {
		$label_style = $suf_comment_label_styles == "plain" ? "suf-comment-label" : "suf-comment-label fancy ";

		if ($suf_comment_label_styles == 'inside') {
			$author_req = $req ? $suf_comment_label_name_req : "";
			$author_field = "
					<p>
						<label for='author'></label>
						<input type='text' name='author' id='author' class='textarea inside'
							onblur='if (this.value == \"\") {this.value = \"".esc_attr($suf_comment_label_name." ".$author_req)."\";}'
							onfocus='if (this.value == \"".esc_attr($suf_comment_label_name." ".$author_req)."\") { this.value = \"\"; }'
							value='".esc_attr($suf_comment_label_name." ".$author_req)."' size='28' tabindex='1' />
					</p>";
			$email_req = $req ? $suf_comment_label_email_req : "";
			$email_field = "
					<p>
						<label for='email'></label>
						<input type='text' name='email' id='email' class='textarea inside'
							onblur='if (this.value == \"\") {this.value = \"".esc_attr($suf_comment_label_email." ".$email_req)."\";}'
							onfocus='if (this.value == \"".esc_attr($suf_comment_label_email." ".$email_req)."\") { this.value = \"\"; }'
							value='".esc_attr($suf_comment_label_email." ".$email_req)."' size='28' tabindex='1' />
					</p>";
			$url_field = "
					<p>
						<label for='url'></label>
						<input type='text' name='url' id='url' class='textarea inside'
							onblur='if (this.value == \"\") {this.value = \"".esc_attr($suf_comment_label_uri)."\";}'
							onfocus='if (this.value == \"".esc_attr($suf_comment_label_uri)."\") { this.value = \"\"; }'
							value='".esc_attr($suf_comment_label_uri)."' size='28' tabindex='1' />
					</p>";
			$comment_field = "
					<p>
						<label for='comment'></label>
						<textarea name='comment' id='comment' cols='60' rows='10' tabindex='4' class='textarea inside'
							onblur='if (this.value == \"\"){this.value = \"".esc_attr($suf_comment_label_your_comment)."\";}'
							onfocus='if (this.value == \"".esc_attr($suf_comment_label_your_comment)."\"){this.value = \"\";}'>".esc_attr($suf_comment_label_your_comment)."</textarea>
					</p>";
		}
		else {
			$author_field = "
					<p>
						<label for='author' class='$label_style'>$suf_comment_label_name</label>
						<input type='text' name='author' id='author' class='textarea' value='".esc_attr($comment_author)."' size='28' tabindex='1' /> ". ($req ? $suf_comment_label_name_req : "")."
					</p>";
			$email_field = "
					<p>
						<label for='email' class='$label_style'>$suf_comment_label_email</label>
						<input type='text' name='email' id='email' value='".esc_attr($comment_author_email)."' size='28' tabindex='2' class='textarea' /> ". ($req ? $suf_comment_label_email_req : ""). "
					</p>";
			$url_field = "
					<p>
						<label for='url' class='$label_style'>$suf_comment_label_uri</label>
						<input type='text' name='url' id='url' value='".esc_attr($comment_author_url)."' size='28' tabindex='3' class='textarea' />
					</p>";
			$comment_field = "
					<p>
						<label for='comment' class='textarea $label_style'>$suf_comment_label_your_comment</label>
						<textarea name='comment' id='comment' cols='60' rows='10' tabindex='4' class='textarea'></textarea>
					</p>";
		}

		comment_form(
			apply_filters('suffusion_comment_form_fields',
				array(
					'fields' => array(
						'author' => $author_field,
						'email' => $email_field,
						'url' => $url_field,
					),
					'comment_field' => $comment_field,
					'logged_in_as' => '<p class="logged-in-as">'.sprintf(__('Logged in as %s. ', 'suffusion'), "<a href='".admin_url('profile.php')."'>".$user_identity."</a>").
							' <a href="'.wp_logout_url(apply_filters('the_permalink', get_permalink($post->ID))).'">'.__('Log out', 'suffusion').'</a>.'.'</p>',
					'must_log_in' => '<p class="must-log-in">'.
							'<a href="'.wp_login_url(apply_filters('the_permalink', get_permalink($post->ID))).'">'.__('You must be logged in to post a comment.', 'suffusion').'</a></p>',
					'title_reply' => '<span class="icon">&nbsp;</span>'.__('Leave a Reply', "suffusion"),
					'title_reply_to' => __('Leave a Reply to %s', "suffusion"),
					'label_submit' => __('Submit Comment', "suffusion"),
					'comment_notes_before' => apply_filters('suffusion_before_comment_form', "<span></span>"),
					'comment_notes_after' => apply_filters('suffusion_after_comment_form', '<p class="form-allowed-tags">'.sprintf(__('You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes: %s', 'suffusion'), '<code>'.allowed_tags().'</code>').'</p>'),
					'cancel_reply_link' => __('Cancel reply', 'suffusion'),
				)
			)
		);
	}
	else { // Comments are closed
		$message_disabled = false;
		if (is_page() && isset($suf_comments_disabled_all_sel) && $suf_comments_disabled_all_sel == 'all') {
			$message_disabled = true;
		}
		else if (is_page() && isset($suf_comments_disabled_all_sel) && $suf_comments_disabled_all_sel != 'all' && isset($suf_comments_disabled)) {
			$disabled_pages = explode(',', $suf_comments_disabled);
			if (is_array($disabled_pages) && count($disabled_pages) > 0 && in_array($post->ID, $disabled_pages)) {
				$message_disabled = true;
			}
		}
		else if (is_singular() && !is_page() && $suf_comments_disabled_msg_for_posts == 'hide'){
			$message_disabled = true;
		}
		
		if (!$message_disabled) {
			echo "<p>";
			_e('Sorry, the comment form is closed at this time.', "suffusion");
			echo "</p>";
		}
	}
}
?>
</section>   <!-- #comments -->