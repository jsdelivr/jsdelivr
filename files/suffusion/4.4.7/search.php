<?php
/**
 * Search results, can be set up to show either excerpts or full contents
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suffusion, $suf_search_excerpt;

get_header();
$suffusion->set_content_layout($suf_search_excerpt);
suffusion_query_posts();
?>
    <div id="main-col">
<?php suffusion_before_begin_content(); ?>
      <div id="content" class="hfeed">
<?php
if ($suf_search_excerpt == 'list') {
	get_template_part('layouts/layout-list');
}
else if ($suf_search_excerpt == 'tiles') {
	suffusion_after_begin_content();
	get_template_part('layouts/layout-tiles');
}
else if ($suf_search_excerpt == 'mosaic') {
	get_template_part('layouts/layout-mosaic');
}
else {
	suffusion_after_begin_content();
	get_template_part('layouts/layout-blog');
}
?>
      </div><!-- content -->
    </div><!-- main col -->
<?php get_footer(); ?>