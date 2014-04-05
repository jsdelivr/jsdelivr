<?php
/**
 * This is shown if your current view has no posts. This file is not to be loaded directly, but is instead loaded from different templates.
 *
 * @package Suffusion
 * @subpackage Templates
 */

if (is_search()) {
?>
	<article class="post fix">
		<header class="post-header">
			<h2 class='posttitle'><?php _e('Nothing Found', 'suffusion');?></h2>
		</header>
		<div class='entry'>
			<p><?php _e('Please try another search.', 'suffusion');?></p>
			<?php get_search_form(); ?>
		</div>
	</article><!--post -->
<?php
}
else {
?>
	<article class="post fix">
		<header class="post-header">
			<h2 class='posttitle'><?php _e("Not Found", "suffusion"); ?></h2>
		</header>
		<div class='entry'>
			<p><?php _e("Sorry, but you are looking for something that isn't here", "suffusion"); ?></p>
		</div>
	</article><!--post -->
<?php
}
?>
