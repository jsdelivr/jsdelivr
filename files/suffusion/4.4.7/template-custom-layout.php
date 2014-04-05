<?php
/**
 * Template Name: Custom Layout
 *
 * A custom layout template with widget areas for your content. You can use this template for things like product landing pages.
 * For each widget area you can configure the number of columns, then add widgets to it. This is very effective with a plugin like Widget Logic.
 *
 * This template doesn't display any post content or comments. It only displays the different widget areas.
 *
 * @package Suffusion
 * @subpackage Template
 */

get_header();
?>
<div id="main-col">
<?php suffusion_before_begin_content(); ?>
	<div id="content" class='hfeed content'>
		<?php
		if (have_posts()) {
			while (have_posts()) {
				the_post();
				global $post;
				$hide_title = suffusion_get_post_meta($post->ID, "suf_hide_page_title", true);
				if (!$hide_title) {
					the_title("<h1 class='cl-title'>", "</h1>");
				}
				for ($i = 1; $i <= 5; $i++) {
					do_action('suffusion_before_custom_layout_widgets', $post, $i);
					if (!suffusion_is_sidebar_empty('sidebar-cl-'.$i)) {
						$default_cols = "suf_clt_wa{$i}_cols";
						$default_height = "suf_clt_wa{$i}_widget_height";
						$default_skinning = "suf_clt_wa{$i}_skin_setting";
						global $$default_cols, $$default_height, $$default_skinning;
						$cols = suffusion_get_post_meta($post->ID, "suf_cpt_wa{$i}_cols", true);
						if ($cols == '') {
							$cols = $$default_cols;
						}
						$widget_height = suffusion_get_post_meta($post->ID, "suf_cpt_wa{$i}_widget_height", true);
						if ($widget_height == '') {
							$widget_height = $$default_height;
						}
						$custom = '';
						if ($$default_skinning) {
							$custom = 'custom-skin';
						}
						echo "\n<section id='cl-warea-id-$i' class='cl-warea cl-warea-$cols cl-warea-id-$i cl-warea-$widget_height $custom fix'>";
						dynamic_sidebar('sidebar-cl-'.$i);
						echo "</section><!-- widget area #cl-warea-id-$i -->\n";
						wp_reset_postdata();
					}
					do_action('suffusion_after_custom_layout_widgets', $post, $i);
				}
			}
		}
		?>
	</div><!-- content -->
</div><!-- main col -->
<?php get_footer(); ?>