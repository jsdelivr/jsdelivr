<?php
/**
 * Template Name: Page of Posts
 *
 * Creates a page with posts, akin to the default index.php. Using this template you can create as many pages of posts as you want.
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $wp_query, $page_of_posts, $suf_pop_excerpt, $suffusion;
$page_of_posts = true;

get_header();
$suffusion->set_content_layout($suf_pop_excerpt);
$paged = get_query_var('paged');
if (!isset($paged) || empty($paged)) {
	$paged = 1;
}
//$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$args = array(
	'orderby' => 'date',
	'order' => 'DESC',
	'paged' => $paged,
);
$temp = $wp_query;  // assign original query to temp variable for later use
//$wp_query = null; // Resetting this to null was causing a PHP Notice to pop up
$wp_query = new WP_Query($args);

suffusion_query_posts();
?>
	<div id="main-col" class='pop'>
<?php suffusion_before_begin_content(); ?>
		<div id="content" class="hfeed">
<?php
if ($suf_pop_excerpt == 'list') {
	get_template_part('layouts/layout-list');
}
else if ($suf_pop_excerpt == 'tiles') {
	suffusion_after_begin_content();
	get_template_part('layouts/layout-tiles');
}
else if ($suf_pop_excerpt == 'mosaic') {
	get_template_part('layouts/layout-mosaic');
}
else {
	suffusion_after_begin_content();
	get_template_part('layouts/layout-blog');
}
?>
      </div><!-- content -->
    </div><!-- main col -->
<?php
$wp_query = $temp;
get_footer();
?>