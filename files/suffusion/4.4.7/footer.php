<?php
/**
 * Footer template, invoked when get_footer() is called
 *
 * @package Suffusion
 * @subpackage Templates
 */

global $suf_footer_layout_style;

// Invoke hook - this creates the bottom widget area, the right sidebars etc.
suffusion_before_end_container();
?>
	</div><!-- /container -->

<?php
suffusion_after_end_container();
if ($suf_footer_layout_style == 'in-align') {
	suffusion_page_footer();
}
?>
</div><!--/wrapper -->
<?php
if ($suf_footer_layout_style != 'in-align') {
	suffusion_page_footer();
}
suffusion_document_footer();
wp_footer(); ?>

</body>
</html>
