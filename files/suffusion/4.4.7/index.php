<?php
/**
 * Core file required with every WP theme. We have files for everything else.
 * So this is essentially the landing page if nothing else is set.
 * This is also the file used for archives.
 *
 * @package Suffusion
 * @subpackage Templates
 */
global $suf_index_excerpt, $suffusion, $suffusion_cpt_layouts;
get_header();
$suffusion->set_content_layout($suf_index_excerpt);
suffusion_query_posts();
$layout = $suffusion->get_content_layout();
?>
	<div id="main-col">
<?php suffusion_before_begin_content(); ?>
		<div id="content" class="hfeed">
<?php
if ($layout == 'list') {
	get_template_part('layouts/layout-list');
}
else if ($layout == 'tiles') {
	suffusion_after_begin_content();
	get_template_part('layouts/layout-tiles');
}
else if ($layout == 'mosaic') {
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
get_footer();
?>
