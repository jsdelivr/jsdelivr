<?php
/**
 * This file contains functions that are only used by the admin screens (i.e. on the back-end) and not by any front-end screen.
 * By isolating these from the functions.php file we reduce the load on the front-end pages.
 *
 * @package Suffusion
 * @subpackage Functions
 * @since 4.0.0
 */

if (isset($_REQUEST['page']) && 'suffusion-options-manager' == $_REQUEST['page']) {
	add_action('admin_init', 'suffusion_options_init_fn' );
}
add_action('admin_menu', 'suffusion_add_admin_menus');

if (current_theme_supports('suffusion-additional-options')) {
	add_action('admin_menu', 'suffusion_add_post_meta_boxes');
	add_action('admin_enqueue_scripts', 'suffusion_enqueue_admin_scripts');
}
add_action("save_post", "suffusion_save_post_fields");
add_action("publish_post", "suffusion_save_post_fields");

if (current_theme_supports('mega-menus')) {
	add_filter('wp_edit_nav_menu_walker', 'suffusion_edit_mm_walker', 100);
	add_action('wp_update_nav_menu_item', 'suffusion_update_nav_menu_mm_item', 10, 3); //, $menu_id, $menu_item_db_id, $args;
}

add_action('wp_ajax_suffusion_admin_upload_file', 'suffusion_admin_upload_file');

/**
 * Registers the meta boxes for Edit Post and Edit Page screens. The same box creation function is used for both, posts and pages.
 */
function suffusion_add_post_meta_boxes() {
	add_meta_box('suffusion-page-box', 'Additional Options for Suffusion', 'suffusion_meta_fields', 'page', 'normal', 'high', array('type' => 'page'));
	add_meta_box('suffusion-post-box', 'Additional Options for Suffusion', 'suffusion_meta_fields', 'post', 'normal', 'high', array('type' => 'post'));
}

/**
 * Builds the meta box in the Edit Page / Edit Post screens.
 *
 * @param $post
 * @param array $args
 * @return void
 */
function suffusion_meta_fields($post, $args = array()) {
	$additional_args = $args['args'];
	if (isset($additional_args['type'])) {
		$type = $additional_args['type'];
	}
	else {
		$type = 'post';
	}

	$post_layouts = array(
			"" => __("Default - Inherit default sidebar layout for your blog", "suffusion"),
			"no" => __("0 (Zero) - Will inherit settings of the \"No Sidebars\" layout", "suffusion"),
			"1l" => __("1 Left - Will inherit settings of the \"1 Left Sidebar\" layout", "suffusion"),
			"1r" => __("1 Right - Will inherit settings of the \"1 Right Sidebar\" layout", "suffusion"),
			"1l1r" => __("1 Left, 1 Right - Will inherit settings of the \"1 Left and 1 Right Sidebar\" layout", "suffusion"),
			"2l" => __("2 Left - Will inherit settings of the \"2 Left Sidebars\" layout", "suffusion"),
			"2r" => __("2 Right - Will inherit settings of the \"2 Right Sidebars\" layout", "suffusion"),
		);
	$current_layout = get_post_meta($post->ID, "suf_pseudo_template", true);
	$current_layout = $current_layout == '' ? 'default' : $current_layout;
?>
	<div id='suf-meta-fields-tabs' class="fix">
		<ul>
<?php
	if ($type == 'page') {
		echo "<li><a href='#suf-meta-tabs-title-settings'>".__('General Settings', 'suffusion')."</a></li>";
	}
	if ($type == 'post') {
		echo "<li><a href='#suf-meta-tabs-mag-settings'>".__('Magazine Settings', 'suffusion')."</a></li>";
	}
	echo "<li><a href='#suf-meta-tabs-layout'>".__('Layout', 'suffusion')."</a></li>";
	echo "<li><a href='#suf-meta-tabs-images'>".__('Images', 'suffusion')."</a></li>";
	echo "<li><a href='#suf-meta-tabs-seo'>".__('SEO', 'suffusion')."</a></li>";
	if ($type == 'page' && isset($post->page_template) && 'template-custom-layout.php' == $post->page_template) {
		echo "<li><a href='#suf-meta-tabs-custom-template'>".__('Custom Template', 'suffusion')."</a></li>";
	}
	if ($type == 'page' && isset($post->page_template) && 'template-custom-post-type-archive.php' == $post->page_template) {
		echo "<li><a href='#suf-meta-tabs-cpt-archive'>".__('Custom Post Type Archive', 'suffusion')."</a></li>";
	}
?>
		</ul>
<?php
	if ($type == 'page') {
?>
	<div id='suf-meta-tabs-title-settings' class="suf-meta-tabs">
		<h3><?php _e('General Settings', 'suffusion'); ?></h3>
		<p>
			<label for="suf_alt_page_title"><?php _e("Page Title in Dropdown Menu", "suffusion"); ?></label><br />
			<input type="text" id="suf_alt_page_title" name="suf_alt_page_title" value="<?php echo get_post_meta($post->ID, "suf_alt_page_title", true); ?>" />
			<br/><em><?php _e("This text will be shown in the drop-down menus in the navigation bar. If left blank, the title of the page is used.", 'suffusion'); ?></em>
		</p>
		<p>
			<label for="suf_nav_unlinked">
			<input type="checkbox" id="suf_nav_unlinked" name="suf_nav_unlinked" <?php checked(get_post_meta($post->ID, 'suf_nav_unlinked', true), 'on'); ?> />
				<?php _e("Do not link to this page in the navigation bars", "suffusion"); ?><br/>
				<em><?php _e('If this box is checked, clicking on this page in the navigation bar will not take you anywhere.', 'suffusion'); ?></em>
			</label>
		</p>
		<p>
			<input type="checkbox" id="suf_hide_page_title" name="suf_hide_page_title" <?php checked(get_post_meta($post->ID, 'suf_hide_page_title', true), 'on'); ?> />
			<label for="suf_hide_page_title"><?php _e("Do not display the page title", "suffusion"); ?></label>
		</p>
		<p>
			<input type="checkbox" id="suf_toggle_breadcrumb" name="suf_toggle_breadcrumb" <?php checked(get_post_meta($post->ID, 'suf_toggle_breadcrumb', true), 'on'); ?> />
			<label for="suf_toggle_breadcrumb"><?php _e("Toggle the breadcrumb display", "suffusion"); ?></label>
		</p>
		<p>
			<input type="checkbox" id="suf_hide_top_navigation" name="suf_hide_top_navigation" <?php checked(get_post_meta($post->ID, 'suf_hide_top_navigation', true), 'on'); ?> />
			<label for="suf_hide_top_navigation"><?php _e("Hide Navigation Bar Above Header, if applicable", "suffusion"); ?></label>
		</p>
		<p>
			<input type="checkbox" id="suf_hide_header" name="suf_hide_header" <?php checked(get_post_meta($post->ID, 'suf_hide_header', true), 'on'); ?> />
			<label for="suf_hide_header"><?php _e("Hide site header for this page", "suffusion"); ?></label>
		</p>
		<p>
			<input type="checkbox" id="suf_hide_main_navigation" name="suf_hide_main_navigation" <?php checked(get_post_meta($post->ID, 'suf_hide_main_navigation', true), 'on'); ?> />
			<label for="suf_hide_main_navigation"><?php _e("Hide Navigation Bar Below Header, if applicable", "suffusion"); ?></label>
		</p>
		<p>
			<input type="checkbox" id="suf_hide_footer" name="suf_hide_footer" <?php checked(get_post_meta($post->ID, 'suf_hide_footer', true), 'on'); ?> />
			<label for="suf_hide_footer"><?php _e("Hide site footer for this page", "suffusion"); ?></label>
		</p>
	</div>
<?php
	}
	if ($type == 'post') {
?>
	<div id='suf-meta-tabs-mag-settings' class="suf-meta-tabs">
		<h3><?php _e('Magazine Settings', 'suffusion'); ?></h3>
		<p>
			<label for="suf_magazine_headline"><?php _e("Make this post a headline", "suffusion"); ?></label><br />
			<input type="checkbox" id="suf_magazine_headline" name="suf_magazine_headline" <?php checked(get_post_meta($post->ID, 'suf_magazine_headline', true), 'on'); ?> />
				<?php _e('If this box is checked, this post will show up as a headline in the magazine template.', 'suffusion'); ?>
		</p>
		<p>
			<label for="suf_magazine_excerpt"><?php _e("Make this post an excerpt in the magazine layout", "suffusion"); ?></label><br />
			<input type="checkbox" id="suf_magazine_excerpt" name="suf_magazine_excerpt" <?php checked(get_post_meta($post->ID, 'suf_magazine_excerpt', true), 'on'); ?> />
				<?php _e('If this box is checked, this post will show up as an excerpt in the magazine template.', 'suffusion'); ?>
		</p>
	</div>
<?php
	}
?>
	<div id='suf-meta-tabs-layout' class="suf-meta-tabs">
		<h3><?php _e('Layout', 'suffusion'); ?></h3>
		<p>
			<label for="suf_pseudo_template"><?php _e("Select the sidebar layout to apply to this post", "suffusion"); ?></label><br />
			<select id="suf_pseudo_template" name="suf_pseudo_template">
		<?php
		foreach ($post_layouts as $layout => $layout_description) {
		?>
				<option <?php selected($current_layout, $layout); ?> value='<?php echo $layout;?>'><?php echo $layout_description; ?></option>
		<?php
		}
		?>
			</select>
			<br/>
			<em><?php _e("Leave the selection to \"Default\" if you are not sure what this is. You can control individual sidebar widths from <strong>Suffusion Options &rarr; Layouts</strong>.", "suffusion"); ?></em>
			<br/>
			<em><?php _e("If you have a conflicting selection for \"Template\", that will override this selection.", 'suffusion');?></em>
		</p>
	</div>

	<?php
	// Older releases didn't prefix meta_description and meta_keywords with suf. That is being addressed in version 4.2.1
	// Note that while the theme fully supports featured images, this functionality predates the featured images by over a year,
	// and is hence required for backwards compatibility.
	$thumbnail = get_post_meta($post->ID, "suf_thumbnail", true);
	if (!$thumbnail) {
		$thumbnail = get_post_meta($post->ID, "thumbnail", true);
	}
	$featured_image = get_post_meta($post->ID, "suf_featured_image", true);
	if (!$featured_image) {
		$featured_image = get_post_meta($post->ID, "featured_image", true);
	}
	?>
	<div id='suf-meta-tabs-images' class="suf-meta-tabs">
		<h3><?php _e('Images', 'suffusion'); ?></h3>
		<table>
			<tr>
				<td><label for="suf_thumbnail"><?php _e("Thumbnail", "suffusion"); ?></label></td>
				<td>
					<input type="text" id="suf_thumbnail" name="suf_thumbnail" value="<?php echo $thumbnail; ?>" />
					<br/><em><?php _e("Enter the full URL of the thumbnail image that you would like to use, including http://", "suffusion"); ?></em>
				</td>
			</tr>

			<tr>
				<td><label for="suf_featured_image"><?php _e("Featured Image", "suffusion"); ?></label></td>
				<td>
					<input type="text" id="suf_featured_image" name="suf_featured_image" value="<?php echo $featured_image; ?>" />
					<br/><em><?php _e("Enter the full URL of the featured image that you would like to use, including http://", "suffusion"); ?></em>
				</td>
			</tr>
		</table>
		<p>
			<br />
		</p>
	</div>

	<div id='suf-meta-tabs-seo' class="suf-meta-tabs">
		<?php
		// Older releases didn't prefix meta_description and meta_keywords with suf. That is being addressed in version 4.2.1
		$description = get_post_meta($post->ID, "suf_meta_description", true);
		if (!$description) {
			$description = get_post_meta($post->ID, "meta_description", true);
		}
		$keywords = get_post_meta($post->ID, "suf_meta_keywords", true);
		if (!$keywords) {
			$keywords = get_post_meta($post->ID, "meta_keywords", true);
		}
		?>
		<h3><?php _e('SEO', 'suffusion'); ?></h3>
		<p>
			<label for="suf_meta_description"><?php _e("Meta Description", "suffusion"); ?></label><br />
			<textarea id="suf_meta_description" name="suf_meta_description" cols='80' rows='5'><?php echo $description; ?></textarea>
		</p>
		<p>
			<label for="suf_meta_keywords"><?php _e("Meta Keywords", "suffusion"); ?></label><br />
			<input type="text" id="suf_meta_keywords" name="suf_meta_keywords" value="<?php echo $keywords; ?>" />
			<br/><em><?php _e("Enter a comma-separated list of keywords for this post. This list will be included in the meta tags for this post.", "suffusion"); ?></em>
		</p>
	</div>

<?php
	if ($type == 'page' && isset($post->page_template) && 'template-custom-layout.php' == $post->page_template) {
?>
	<div id='suf-meta-tabs-custom-template' class="suf-meta-tabs">
<?php
		for ($i = 1; $i <= 5; $i++) {
?>
		<h3><?php printf(__('Custom Layout Widget Area %1$s', 'suffusion'), $i); ?></h3>
		<table>
			<tr>
				<td><label for="suf_cpt_wa<?php echo $i;?>_cols"><?php _e('Number of columns', 'suffusion'); ?></label></td>
				<td>
					<select id="suf_cpt_wa<?php echo $i;?>_cols" name="suf_cpt_wa<?php echo $i;?>_cols">
						<option value="" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_cols", true), ''); ?>><?php _e("Default", 'suffusion'); ?></option>
					<?php for ($j = 1; $j <= 5; $j++) { ?>
						<option value="<?php echo $j; ?>" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_cols", true), $j); ?>><?php echo $j; ?></option>
					<?php } ?>
					</select>
				</td>
			</tr>

			<tr>
				<td><label for="suf_cpt_wa<?php echo $i;?>_widget_height"><?php _e('Height adjustment for widgets', 'suffusion'); ?></label></td>
				<td>
					<select id="suf_cpt_wa<?php echo $i;?>_widget_height" name="suf_cpt_wa<?php echo $i;?>_widget_height">
						<option value="" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true), ''); ?>><?php _e("Default", 'suffusion'); ?></option>
						<option value="all" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true), 'all'); ?>><?php _e("All same height", 'suffusion'); ?></option>
						<option value="all-row" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true), 'all-row'); ?>><?php _e("All same height if in the same row", 'suffusion'); ?></option>
						<option value="original" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true), 'original'); ?>><?php _e("All original height", 'suffusion'); ?></option>
						<option value="masonry" <?php selected(get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true), 'masonry'); ?>><?php _e("All original height, but auto-arranged", 'suffusion'); ?></option>
					</select>
				</td>
			</tr>
		</table>
<?php
		}
?>
	</div>
<?php
	}

	if ($type == 'page' && isset($post->page_template) && 'template-custom-post-type-archive.php' == $post->page_template) {
?>
	<div id='suf-meta-tabs-cpt-archive' class="suf-meta-tabs">
		<h3><?php _e('Custom Post Type Archive', 'suffusion'); ?></h3>
		<table>
			<tr>
				<td valign='top'><label for="suf_cpt_post_type"><?php _e('Post type', 'suffusion'); ?></label></td>
				<td valign='top'>
					<select id='suf_cpt_post_type' name='suf_cpt_post_type'>
<?php
		$post_types = suffusion_get_custom_post_types(true);
		foreach ($post_types as $post_type => $display) {
			echo "<option value='$post_type' ".selected(get_post_meta($post->ID, "suf_cpt_post_type", true), $post_type).">$display</option>";
		}
?>
					</select>
				</td>
			</tr>
			
			<tr>
				<td valign='top'><label for="suf_cpt_total_posts"><?php _e('Total posts per page', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_total_posts" name="suf_cpt_total_posts" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_total_posts", true)); ?>"/><br/>
					<em><?php _e('Leave blank or 0 for default value from Settings &rarr; Reading, -1 for all matching posts, any other positive number otherwise', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_post_type_layout"><?php _e('Layout', 'suffusion'); ?></label></td>
				<td valign='top'>
					<select id='suf_cpt_post_type_layout' name='suf_cpt_post_type_layout'>
<?php
		$display_types = array(
			'full-post' => 'Full posts',
			'excerpt' => 'Excerpts',
			'tiles' => 'Tiles',
			'list' => 'List',
			'mosaic' => 'Mosaic',
		);
		foreach ($display_types as $display_type => $display) {
			echo "<option value='$display_type' ".selected(get_post_meta($post->ID, "suf_cpt_post_type_layout", true), $display_type).">$display</option>";
		}
?>
					</select>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_full_posts"><?php _e('Number of posts to display in full (Only if Layout is not "Full Posts")', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_full_posts" name="suf_cpt_full_posts" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_full_posts", true)); ?>"/><br/>
					<em><?php _e('Leave blank or 0 to show no full posts', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_full_posts_fp_only"><?php _e('Full posts on first page or all pages', 'suffusion');?></label></td>
				<td valign='top'>
					<label><input type="checkbox" id="suf_cpt_full_posts_fp_only" name="suf_cpt_full_posts_fp_only" <?php checked(get_post_meta($post->ID, "suf_cpt_full_posts_fp_only", true), 'on'); ?> /> <?php _e('Show the above number of full posts on all pages, not just the first page', 'suffusion'); ?></label>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_full_post_classes"><?php _e('Additional CSS classes to apply to each full post', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_full_post_classes" name="suf_cpt_full_post_classes" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_full_post_classes", true)); ?>"/><br/>
					<em><?php _e('Specify a comma-separated list of classes. E.g. <code>post,cpt</code>', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_non_full_post_classes"><?php _e('Additional CSS classes to apply to each excerpt', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_non_full_post_classes" name="suf_cpt_excerpt_classes" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_non_full_post_classes", true)); ?>"/><br/>
					<em><?php _e('Specify a comma-separated list of classes. E.g. <code>post,cpt</code>', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_posts_per_row"><?php _e('Posts per row', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_posts_per_row" name="suf_cpt_posts_per_row" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_posts_per_row", true)); ?>"/><br/>
					<em><?php _e('Tiles and Mosaic layouts only', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_byline_type"><?php _e('Layout', 'suffusion'); ?></label></td>
				<td valign='top'>
					<select id='suf_cpt_byline_type' name='suf_cpt_byline_type'>
<?php
		$byline_types = array(
			'none' => __('No bylines', 'suffusion'),
			'line-top' => __('Single line below post title', 'suffusion'),
			'line-bottom' => __('Single line below post', 'suffusion'),
			'left-pullout' => __('Pullout on the left', 'suffusion'),
			'right-pullout' => __('Pullout on the right', 'suffusion'),
			'left-outer-pullout' => __('Pullout on the left outside post', 'suffusion'),
			'right-outer-pullout' => __('Pullout on the right outside post', 'suffusion'),
		);
		foreach ($byline_types as $byline_type => $display) {
			echo "<option value='$byline_type' ".selected(get_post_meta($post->ID, "suf_cpt_byline_type", true), $byline_type).">$display</option>";
		}
?>
					</select>
				</td>
			</tr>

			<tr>
				<td valign='top'><?php _e('Byline Control', 'suffusion');?></td>
				<td valign='top'>
					<label><input type="checkbox" id="suf_cpt_bylines_post_date" name="suf_cpt_bylines_post_date" <?php checked(get_post_meta($post->ID, "suf_cpt_bylines_post_date", true), 'on'); ?> /> <?php _e('Show date', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_bylines_posted_by" name="suf_cpt_bylines_posted_by" <?php checked(get_post_meta($post->ID, "suf_cpt_bylines_posted_by", true), 'on'); ?> /> <?php _e('Show author', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_bylines_comments" name="suf_cpt_bylines_comments" <?php checked(get_post_meta($post->ID, "suf_cpt_bylines_comments", true), 'on'); ?> /> <?php _e('Show comment link', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_bylines_permalinks" name="suf_cpt_bylines_permalinks" <?php checked(get_post_meta($post->ID, "suf_cpt_bylines_permalinks", true), 'on'); ?> /> <?php _e('Show permalink', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_show_tile_byline" name="suf_cpt_show_tile_byline" <?php checked(get_post_meta($post->ID, "suf_cpt_show_tile_byline", true), 'on'); ?> /> <?php _e('Show bylines in tiles', 'suffusion'); ?></label><br/>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_byline_taxonomies"><?php _e('Taxonomies in byline', 'suffusion');?></label></td>
				<td valign='top'>
					<input type="text" id="suf_cpt_byline_taxonomies" name="suf_cpt_byline_taxonomies" value="<?php echo esc_attr(get_post_meta($post->ID, "suf_cpt_byline_taxonomies", true)); ?>" /><br/>
					<em><?php _e('Comma-separated list of taxonomy types', 'suffusion'); ?></em>
				</td>
			</tr>

			<tr>
				<td valign='top'><?php _e('Thumbnails', 'suffusion');?></td>
				<td valign='top'>
					<label><input type="checkbox" id="suf_cpt_show_full_thumb" name="suf_cpt_show_full_thumb" <?php checked(get_post_meta($post->ID, "suf_cpt_show_full_thumb", true), 'on'); ?> /> <?php _e('Show thumbnails for full posts in the archive', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_show_excerpt_thumb" name="suf_cpt_show_excerpt_thumb" <?php checked(get_post_meta($post->ID, "suf_cpt_show_excerpt_thumb", true), 'on'); ?> /> <?php _e('Show thumbnails for excerpts', 'suffusion'); ?></label><br/>
					<label><input type="checkbox" id="suf_cpt_show_tile_thumb" name="suf_cpt_show_tile_thumb" <?php checked(get_post_meta($post->ID, "suf_cpt_show_tile_thumb", true), 'on'); ?> /> <?php _e('Show thumbnails for tiles', 'suffusion'); ?></label><br/>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_order_by"><?php _e('Order by:', 'suffusion'); ?></label></td>
				<td valign='top'>
					<select id='suf_cpt_order_by' name='suf_cpt_order_by'>
<?php
		$order_bys = array(
			'date' => __('Creation date', 'suffusion'),
			'ID' => __('Post id', 'suffusion'),
			'author' => __('Post author', 'suffusion'),
			'title' => __('Post title', 'suffusion'),
			'modified' => __('Modification date', 'suffusion'),
			'comment_count' => __('Popularity (comment count)', 'suffusion'),
			'rand' => __('Random', 'suffusion'),
			'none' => __('No order', 'suffusion'),
			'parent' => __('Parent id', 'suffusion'),
			'menu_order' => __('Menu order', 'suffusion'),
		);
		foreach ($order_bys as $order_by => $display) {
			echo "<option value='$order_by' ".selected(get_post_meta($post->ID, "suf_cpt_order_by", true), $order_by).">$display</option>";
		}
?>
					</select>
				</td>
			</tr>

			<tr>
				<td valign='top'><label for="suf_cpt_order"><?php _e('Order:', 'suffusion'); ?></label></td>
				<td valign='top'>
				<select id="suf_cpt_order" name="suf_cpt_order">
	<?php
		$orders = array(
			'DESC' => __('Descending', 'suffusion'),
			'ASC' => __('Ascending', 'suffusion'),
		);
		foreach ($orders as $order => $display) {
			echo "<option value='$order' ".selected(get_post_meta($post->ID, "suf_cpt_order", true), $order).">$display</option>";
		}
	?>
				</select>
				</td>
			</tr>

		</table>
	</div>
<?php
	}
?>

	<input type='hidden' id='suffusion_post_meta' name='suffusion_post_meta' value='suffusion_post_meta'/>
	</div>
	<script type="text/javascript">
		$j = jQuery.noConflict();
		$j(document).ready(function() {
			$j('#suf-meta-fields-tabs').tabs();
		});
	</script>
<?php
}

/**
 * Saves all the fields in the additional menus for Suffusion section. There is a whitelist at the top of this function, where every
 * custom-defined field for Suffusion is added.
 *
 * @param $post_id
 */
function suffusion_save_post_fields($post_id) {
	$suffusion_post_fields = array('suf_thumbnail', 'suf_featured_image', 'suf_magazine_headline', 'suf_magazine_excerpt', 'suf_alt_page_title',
		'suf_meta_description', 'suf_meta_keywords', 'suf_nav_unlinked', 'suf_pseudo_template', 'suf_hide_page_title', 'suf_toggle_breadcrumb',
		'suf_hide_top_navigation', 'suf_hide_header', 'suf_hide_main_navigation', 'suf_hide_footer', 'suf_cpt_post_type', 'suf_cpt_total_posts',
		'suf_cpt_post_type_layout', 'suf_cpt_full_posts', 'suf_cpt_full_posts_fp_only', 'suf_cpt_byline_type', 'suf_cpt_bylines_post_date',
		'suf_cpt_posts_per_row', 'suf_cpt_bylines_posted_by', 'suf_cpt_bylines_comments', 'suf_cpt_bylines_permalinks', 'suf_cpt_byline_taxonomies',
		'suf_cpt_show_tile_byline', 'suf_cpt_show_full_thumb', 'suf_cpt_show_excerpt_thumb', 'suf_cpt_show_tile_thumb', 'suf_cpt_order',
		'suf_cpt_order_by', 'suf_cpt_full_post_classes', 'suf_cpt_excerpt_classes'
	);
	for ($i = 1; $i <= 5; $i++) {
		$suffusion_post_fields[] = "suf_cpt_wa{$i}_cols";
		$suffusion_post_fields[] = "suf_cpt_wa{$i}_widget_height";
	}
    if (isset($_POST['suffusion_post_meta'])) {
        foreach ($suffusion_post_fields as $post_field) {
	        if (isset($_POST[$post_field])) {
		        $data = stripslashes($_POST[$post_field]);
	        }
	        else {
		        $data = '';
	        }
            if (get_post_meta($post_id, $post_field) == '') {
                add_post_meta($post_id, $post_field, $data, true);
            }
            else if ($data != get_post_meta($post_id, $post_field, true)) {
                update_post_meta($post_id, $post_field, $data);
            }
            else if ($data == '') {
                delete_post_meta($post_id, $post_field, get_post_meta($post_id, $post_field, true));
            }
        }
    }
}

/**
 * Create the options menu.
 * @return void
 */
function suffusion_add_admin_menus() {
	$suffusion_options_manager = add_theme_page('Suffusion Options', 'Suffusion Options', 'edit_theme_options', 'suffusion-options-manager', 'suffusion_render_options');
	add_action("admin_print_scripts-$suffusion_options_manager", 'suffusion_admin_script_loader');
	add_action("admin_print_styles-$suffusion_options_manager", 'suffusion_admin_style_loader');
	add_action("load-$suffusion_options_manager", 'suffusion_admin_help_pages');
}

/**
 * Adds scripts for use in the admin screens for Suffusion.
 *
 * @param $hook
 */
function suffusion_enqueue_admin_scripts($hook) {
	if ($hook == 'post.php' || $hook == 'post-new.php') {
		wp_enqueue_script('jquery-ui-tabs');
		wp_enqueue_style('suffusion-admin-jq', get_template_directory_uri().'/admin/js/jquery-ui/css/jquery-ui-trim.css', array(), SUFFUSION_THEME_VERSION);
		wp_enqueue_style('suffusion-admin', get_template_directory_uri().'/admin/admin-post.css', array('suffusion-admin-jq'), SUFFUSION_THEME_VERSION);
	}
	else if ($hook == 'widgets.php') {
		wp_enqueue_style('suffusion-admin-widgets', get_template_directory_uri().'/admin/admin-widgets.css', array(), SUFFUSION_THEME_VERSION);
	}
}

/**
 * Handles the saving of the mega-menus in the backend.
 *
 * @param $menu_id
 * @param $menu_item_db_id
 * @param $args
 */
function suffusion_update_nav_menu_mm_item($menu_id, $menu_item_db_id, $args) {
	if (isset($_POST['menu-item-warea']) && isset($_POST['menu-item-warea'][$menu_item_db_id])) {
		$warea = $_POST['menu-item-warea'][$menu_item_db_id];
		update_post_meta($menu_item_db_id, 'suf_mm_warea', $warea);
	}

	if (isset($_POST['suffusion-mm-cols']) && isset($_POST['suffusion-mm-cols'][$menu_item_db_id])) {
		update_post_meta($menu_item_db_id, 'suf_mm_cols', $_POST['suffusion-mm-cols'][$menu_item_db_id]);
	}

	if (isset($_POST['suffusion-mm-widget-height']) && isset($_POST['suffusion-mm-widget-height'][$menu_item_db_id])) {
		update_post_meta($menu_item_db_id, 'suf_mm_widget_height', $_POST['suffusion-mm-widget-height'][$menu_item_db_id]);
	}
}

/**
 * Method to return the class name for editing the Mega Menu walker.
 *
 * @param $class_name
 * @return string
 */
function suffusion_edit_mm_walker($class_name) {
	return "Suffusion_MM_Walker_Edit";
}

/**
 * Called when you upload a file for option type "upload". This is an AJAX call
 * @return void
 */
function suffusion_admin_upload_file() {
	global $suffusion_options_renderer;
	$save_type = $_POST['type'];
	if ($save_type == 'upload') {
		$data = $_POST['data']; // Acts as the name
		$filename = $_FILES[$data];
		$filename['name'] = preg_replace('/[^a-zA-Z0-9._\-]/', '', $filename['name']);

		$override['test_form'] = false;
		$override['action'] = 'wp_handle_upload';
		$uploaded_file = wp_handle_upload($filename, $override);

		$image_id = substr($data, 7);

		if (!empty($uploaded_file['error'])) {
			echo 'Upload Error: ' . $uploaded_file['error'];
		}
		else {
			if (isset($suffusion_options_renderer) && isset($suffusion_options_renderer->options)) {
				$suffusion_options_renderer->options[$image_id] = $uploaded_file['url'];
			}
			echo $uploaded_file['url'];
		}
	}
	elseif ($save_type == 'image_reset') {
		$data = $_POST['data'];
		$image_id = substr($data, 6);
		if (isset($suffusion_options_renderer) && isset($suffusion_options_renderer->options)) {
			if (isset($suffusion_options_renderer->options[$image_id])) unset($this->options[$image_id]);
		}
	}
	die();
}
