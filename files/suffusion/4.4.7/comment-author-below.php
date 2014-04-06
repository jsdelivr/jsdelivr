<?php
/**
 * Individual Comment Template
 *
 * Displays an individual comment. This overrides WP's default comment template to suit the theme's look and feel.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $post, $comment
?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class('author-below'); ?>>
		<?php suffusion_before_comment(); ?>
		<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
	<?php if ($comment->comment_approved == '0') { ?>
			<p class="moderation"><?php _e('Your comment is awaiting moderation.', 'suffusion') ?></p>
	<?php } ?>

			<?php comment_text($comment->comment_ID); ?>

		</div>
		<span class="arrow">&nbsp;</span>

		<div class="comment-author fix vcard">
		<?php if ($args['avatar_size'] != 0) echo get_avatar($comment, $args['avatar_size'] ); ?>
			<div class="comment-author-details">
				<div class="comment-author-link">
					<cite class="fn"><?php comment_author_link(); ?></cite>
				</div>
				<div class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars(get_comment_link($comment->comment_ID)); ?>">
				<?php
					printf( __('%1$s at %2$s', 'suffusion'), get_comment_date(),  get_comment_time()) ?></a><?php edit_comment_link(__('(Edit)', 'suffusion'),'&nbsp;&nbsp;','' );
					comment_reply_link(array_merge( $args, array('depth' => $depth, 'max_depth' => $args['max_depth'])));
				?>
				</div>
			</div>
		</div>


		<?php suffusion_after_comment(); ?>

	<?php /* No closing </li> is needed.  WordPress will know where to add it. */ ?>