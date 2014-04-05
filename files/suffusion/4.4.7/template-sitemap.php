<?php
/**
 * Template Name: Sitemap
 *
 * Displays an HTML-based sitemap for your site.
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
global $post;
if (have_posts()) {
	while ( have_posts() ) {
		the_post();
		$original_post = $post;
		do_action('suffusion_before_post', $post->ID, 'blog', 1);
?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<?php suffusion_after_begin_post(); ?>
			<div class="entry-container fix">
				<div class="entry fix">
					<?php
						suffusion_content();
						global $suf_sitemap_contents, $suf_sitemap_entity_order, $suffusion_sitemap_entities;
						$show = explode(',',$suf_sitemap_contents);
						if (is_array($show) && count($show) > 0) {
							if (is_array($suf_sitemap_entity_order)) {
								$entity_order = array();
								foreach ($suf_sitemap_entity_order as $key => $value) {
									$entity_order[] = $key;
								}
							}
							else {
								$entity_order = explode(',', $suf_sitemap_entity_order);
							}
							foreach ($entity_order as $entity) {
								if (in_array($entity, $show)) {
									$title_opt = 'suf_sitemap_label'.$suffusion_sitemap_entities[$entity]['opt'];
									$title = $$title_opt;
					?>
						<h3><?php echo $title; ?></h3>
						<ul class='xoxo <?php echo $entity; ?>'>
								<?php
									switch ($entity) {
								        case 'pages':
								            wp_list_pages(array('title_li' => false));
								            continue;
								        case 'categories':
								            wp_list_categories(array('show_count' => true, 'use_desc_for_title' => false, 'title_li' => false));
								            continue;
								        case 'authors':
								            wp_list_authors(array('exclude_admin' => false, 'optioncount' => true, 'title_li' => false));
								            continue;
								        case 'years':
								            wp_get_archives(array('type' => 'yearly', 'show_post_count' => true));
								            continue;
								        case 'months':
									        wp_get_archives(array('type' => 'monthly', 'show_post_count' => true));
									        continue;
								        case 'weeks':
									        wp_get_archives(array('type' => 'weekly', 'show_post_count' => true));
									        continue;
								        case 'days':
									        wp_get_archives(array('type' => 'daily', 'show_post_count' => true));
									        continue;
								        case 'tag-cloud':
								            wp_tag_cloud(array('number' => 0));
								            continue;
								        case 'posts':
									        wp_get_archives(array('type' => 'postbypost'));
									        continue;
									}

								?>
						</ul><!-- /<?php echo $entity; ?> -->
					<?php
								}
							}
						}
					?>
				</div><!-- .entry -->
			</div><!-- .entry-container -->
			<?php
			// Due to the inclusion of Ad Hoc Widgets the global variable $post might have got changed. We will reset it to the original value.
			$post = $original_post;
			suffusion_before_end_post();
			comments_template();
			?>
		</article><!-- .post -->
<?php
		do_action('suffusion_after_post', $post->ID, 'blog', 1);
	}
}
?>
	</div><!-- content -->
</div><!-- main col -->
<?php get_footer(); ?>