<?php
/**
 * Contains a list of all custom action hooks and corresponding functions defined for Suffusion.
 * This file is included in functions.php
 *
 * @package Suffusion
 * @subpackage Functions
 */
function suffusion_document_header() {
	do_action('suffusion_document_header');
}

function suffusion_before_page() {
	do_action('suffusion_before_page');
}

function suffusion_before_begin_wrapper() {
	do_action('suffusion_before_begin_wrapper');
}

function suffusion_after_begin_wrapper() {
	do_action('suffusion_after_begin_wrapper');
}

function suffusion_page_header() {
	do_action('suffusion_page_header');
}

function suffusion_after_begin_container() {
	do_action('suffusion_after_begin_container');
}

function suffusion_before_begin_content() {
	do_action('suffusion_before_begin_content');
}

function suffusion_after_begin_content() {
	do_action('suffusion_after_begin_content');
}

function suffusion_content() {
	do_action('suffusion_content');
}

function suffusion_after_begin_post() {
	do_action('suffusion_after_begin_post');
}

function suffusion_after_content() {
	do_action('suffusion_after_content');
}

function suffusion_before_end_post() {
	do_action('suffusion_before_end_post');
}

function suffusion_before_end_content() {
	do_action('suffusion_before_end_content');
}

function suffusion_before_end_container() {
	do_action('suffusion_before_end_container');
}

function suffusion_after_end_container() {
	do_action('suffusion_after_end_container');
}

function suffusion_page_footer() {
	do_action('suffusion_page_footer');
}

function suffusion_document_footer() {
	do_action('suffusion_document_footer', 'footer');
}

function suffusion_page_navigation() {
	do_action('suffusion_page_navigation');
}

function suffusion_query_posts() {
	do_action('suffusion_query_posts');
}

function suffusion_before_first_sidebar() {
	do_action('suffusion_before_first_sidebar');
}

function suffusion_between_first_sidebars() {
	do_action('suffusion_between_first_sidebars');
}

function suffusion_after_first_sidebar() {
	do_action('suffusion_after_first_sidebar');
}

function suffusion_before_second_sidebar() {
	do_action('suffusion_before_second_sidebar');
}

function suffusion_between_second_sidebars() {
	do_action('suffusion_between_second_sidebars');
}

function suffusion_after_second_sidebar() {
	do_action('suffusion_after_second_sidebar');
}

function suffusion_before_comment() {
	do_action('suffusion_before_comment');
}

function suffusion_after_comment() {
	do_action('suffusion_after_comment');
}

//
// This section defines the individual callback functions
//
function suffusion_include_dbx() {
	if (suffusion_should_include_dbx()) {
		get_template_part('custom/dbx');
	}
}

function suffusion_include_custom_js($location = 'footer') {
	echo "<!-- location $location -->\n";
	$script = "suf_custom_{$location}_js";
	global $$script;
	if (isset($$script) && trim($$script) != "") {?>
<!-- Custom JavaScript for <?php echo $location; ?> defined in options -->
<script type="text/javascript">
/* <![CDATA[ */
<?php
		$strip = stripslashes($$script);
		$strip = wp_specialchars_decode($strip, ENT_QUOTES);
		echo $strip."\n";
?>
/* ]]> */
</script>
<!-- /Custom JavaScript for <?php echo $location; ?> defined in options -->
<?php
	}
}

/**
 * Includes JavaScript to play an audio file. Suffusion is bundled with the standalone version of the Open Source WP Audio Player plugin.
 * See http://wpaudioplayer.com/ for the plugin page.
 *
 * Suffusion is bundled with the JS and the SWF files from the plugin. For the FLA file corresponding to the SWF, see http://tools.assembla.com/1pixelout/browser/audio-player/trunk/source
 *
 * @return void
 */
function suffusion_include_audio_player_script() {
	global $suf_enable_audio_shortcode;
	if (!class_exists('Suffusion_Shortcodes') && !function_exists('audio_shortcode') && !class_exists('AudioPlayer') && isset($suf_enable_audio_shortcode) && $suf_enable_audio_shortcode == 'on') {?>
<!-- Include AudioPlayer via Suffusion -->
<script type="text/javascript">
/* <![CDATA[ */
	if (typeof AudioPlayer != 'undefined') {
		AudioPlayer.setup("<?php echo get_template_directory_uri().'/scripts/player.swf'; ?>", {
			width: 500,
			initialvolume: 100,
			transparentpagebg: "yes",
			left: "000000",
			lefticon: "FFFFFF"
		});
	}
/* ]]> */
</script>
<!-- /AudioPlayer -->
<?php
	}
}

function suffusion_display_header() {
	global $suf_sub_header_vertical_alignment, $suf_header_fg_image_type, $suf_header_fg_image, $suf_header_alignment, $suf_sub_header_alignment;
	$display = apply_filters('suffusion_can_display_header', true);
	if (!$display) {
		return;
	}

	if ($suf_header_alignment == 'right') {
		suffusion_display_widgets_in_header();
	}
	if (!is_singular() || is_page_template('magazine.php')) {
		$header_tag = "h1";
	}
	else {
		$header_tag = "h2";
	}
?>
	<header id="header" class="fix">
	<?php
	$header = ($suf_header_fg_image_type == 'image' && trim($suf_header_fg_image) != '') ? "<img src='$suf_header_fg_image' alt='".esc_attr(get_bloginfo('name'))."'/>" : get_bloginfo('name', 'display');
	$home_link = home_url();
	if (function_exists('icl_get_home_url')) {
		$home_link = icl_get_home_url();
	}
	if ($suf_sub_header_vertical_alignment == "above") {
		?>
		<div class="description <?php echo $suf_sub_header_alignment; ?>"><?php bloginfo('description');?></div>
		<<?php echo $header_tag?> class="blogtitle <?php echo $suf_header_alignment; ?>"><a href="<?php echo $home_link;?>"><?php echo $header;?></a></<?php echo $header_tag?>>
	<?php
	}
	else {
		?>
		<<?php echo $header_tag?> class="blogtitle <?php echo $suf_header_alignment; ?>"><a href="<?php echo $home_link;?>"><?php echo $header;?></a></<?php echo $header_tag?>>
		<div class="description <?php echo $suf_sub_header_alignment; ?>"><?php bloginfo('description');?></div>
<?php
	}
	?>
    </header><!-- /header -->
<?php
	if ($suf_header_alignment != 'right') {
		suffusion_display_widgets_in_header();
	}
}

function suffusion_display_main_navigation() {
	global $suf_nav_contents, $suf_nav_item_type, $suf_nav_dd_pos;
	$display = apply_filters('suffusion_can_display_main_navigation', true);
	if ($display) {
?>
 	<nav id="nav" class="<?php echo $suf_nav_item_type; ?> fix">
		<div class='col-control <?php echo $suf_nav_dd_pos; ?>'>
<?php
	suffusion_display_left_header_widgets();
	suffusion_display_right_header_widgets();
	if ($suf_nav_contents == "pages") {
		suffusion_create_navigation_html(true, 'main', 'suf_nav_pages', 'suf_nav_cats', 'suf_nav_links', 'suf_nav_menus');
	}
?>
		</div><!-- /col-control -->
	</nav><!-- /nav -->
<?php
	}
}

function suffusion_display_top_navigation() {
	global $suf_navt_contents, $suf_wa_tbrh_style, $suf_wa_tbrh_open_text, $suf_wa_tbrh_close_text, $suf_navt_item_type, $suf_navt_dd_pos;
	if ($suf_navt_contents == "pages" || (has_nav_menu('top'))) {
		if (!suffusion_is_sidebar_empty(7)) {
			if ($suf_wa_tbrh_style == 'sliding-panel' || $suf_wa_tbrh_style == 'spanel-flat' || $suf_wa_tbrh_style == 'spanel-boxed') {
				$display = apply_filters('suffusion_can_display_sliding_panel', true);
				if ($display) {
?>
	<!-- #top-bar-right-spanel -->
	<div id="top-bar-right-spanel" class='custom warea fix'>
		<div class='col-control'>
			<div class='spanel'>
				<div class='spanel-content fix'>
<?php
					dynamic_sidebar('Top Bar Right Widgets');
?>
				</div>
			</div>
		</div>
	</div>
	<!-- #top-bar-right-spanel -->
<?php
				}
			}
		}
		$display = apply_filters('suffusion_can_display_top_navigation', true);
		if ($display) {
?>
	<nav id='nav-top' class='<?php echo $suf_navt_item_type; ?> fix'>
		<div class='col-control <?php echo $suf_navt_dd_pos; ?>'>
<?php
			get_sidebar('nav-top-left');
			if (!suffusion_is_sidebar_empty(7)) {
			if ($suf_wa_tbrh_style == 'sliding-panel' || $suf_wa_tbrh_style == 'spanel-flat' || $suf_wa_tbrh_style == 'spanel-boxed') {
?>
		<div id="top-bar-right-spanel-tab">
			<div class="toggle">
				<a class="open" href="#"><?php echo $suf_wa_tbrh_open_text; ?></a>
				<a class="close" href="#"><?php echo $suf_wa_tbrh_close_text; ?></a>
			</div>
		</div> <!-- /#top-bar-right-spanel-tab -->
<?php
			}
			else {
?>
		<!-- #top-bar-right-widgets -->
		<div id="top-bar-right-widgets" class="warea">
<?php
				dynamic_sidebar('Top Bar Right Widgets');
?>
		</div>
		<!-- /#top-bar-right-widgets -->
<?php
			}
		}
		suffusion_create_navigation_html(true, 'top', 'suf_navt_pages', 'suf_navt_cats', 'suf_navt_links', 'suf_navt_menus');
?>
		</div><!-- /.col-control -->
	</nav><!-- /#nav-top -->
<?php
		}
	}
}

function suffusion_display_left_header_widgets() {
	get_sidebar('nav-main-left');
}

function suffusion_display_right_header_widgets() {
	get_sidebar('nav-main-right');
}

/**
 * Displays the widget area below the header, if it is enabled.
 *
 * @return void
 */
function suffusion_print_widget_area_below_header() {
	get_sidebar('below-header');
}

/**
 * Displays all left sidebars. This shows the following:
 *  1. Static tabbed sidebar, if enabled and either explicitly positioned left or if positioned right but there are no right sidebars.
 *  2. A wide sidebar at the top, if there are 2 left sidebars
 *  3. Sidebar 1 & Sidebar 1 - bottom, if applicable
 *  4. Sidebar 2 & Sidebar 2 - bottom, if applicable
 *  5. A wide sidebar at the bottom, if there are 2 left sidebars.
 *
 * @return
 */
function suffusion_print_left_sidebars() {
	global $suffusion;
	wp_reset_postdata();
	if (!isset($suffusion) || is_null($suffusion)) {
		$suffusion = new Suffusion();
	}
	$context = $suffusion->get_context();

	$left_count = suffusion_get_left_sidebar_count($context);
	if ($left_count == 0) {
		return;
	}

	global $suf_sidebar_alignment, $suf_sbtab_alignment, $suffusion_tabs_alignment, $suf_sbtab_enabled, $suf_wa_sb1b_style, $suf_wa_sb2b_style, $suf_wa_wst_style, $suf_wa_wsb_style;
	$right_count = suffusion_get_right_sidebar_count($context);

	// Show static tabbed sidebar if:
	//  1. It is enabled and positioned on the left
	//  2. Or it is enabled and there is only one sidebar and that is to the left
	//  3. Or it is enabled and there are 2 left sidebars.
	if ($suf_sbtab_enabled == 'enabled' && ($suf_sbtab_alignment == 'left' || ($left_count == 1 && $right_count == 0) || $left_count == 2)) {
		echo "<div id='sidebar-container' class='sidebar-container-left fix'>";
		$suffusion_tabs_alignment = 'left';
		get_sidebar('tabs');
	}

	// Show Wide Sidebar Top if there are 2 left sidebars
	if ($left_count == 2) {
		echo "<div id='sidebar-wrap' class='sidebar-wrap sidebar-wrap-left fix'>";
		if (!suffusion_is_sidebar_empty(18)) {
			suffusion_print_sidebar(18, 'wsidebar-top', 'Wide Sidebar (Top)', $suf_wa_wst_style, 'left');
		}
	}

	// Show Sidebar-1 if:
	//  1. There is only 1 sidebar to be shown and that's on the left
	//  2. Or there are 2 sidebars to be shown, one on the left and one on the right, and sidebar-1 has left alignment
	//  3. Or there are 2 sidebars to be shown, both on the left
	if ((($left_count == 1 && $right_count == 0) || ($left_count == 1 && $right_count == 1 && $suf_sidebar_alignment == 'left') || $left_count == 2)) {
		echo "<div id='sidebar-shell-1' class='sidebar-shell sidebar-shell-left'>\n";
		suffusion_before_first_sidebar();
		get_sidebar();
		suffusion_between_first_sidebars();
		suffusion_print_sidebar(9, 'sidebar-b', 'Sidebar 1 (Bottom)', $suf_wa_sb1b_style, "left");
		suffusion_after_first_sidebar();
		echo "</div>\n";
	}

	// Show Sidebar-2 if:
	//  1. There is 1 sidebar on the left and one on the right, and sidebar-2 has left alignment and sidebar-1 has right alignment
	//  2. Or there are 2 sidebars to be shown, both on the left
	if ((($left_count == 1 && $right_count == 1 && $suf_sidebar_alignment == "right") || $left_count == 2)) {
		echo "<div id='sidebar-shell-2' class='sidebar-shell sidebar-shell-left'>\n";
		suffusion_before_second_sidebar();
		get_sidebar(2);
		suffusion_between_second_sidebars();
		suffusion_print_sidebar(10, 'sidebar-2-b', 'Sidebar 2 (Bottom)', $suf_wa_sb2b_style, "left");
		suffusion_after_second_sidebar();
		echo "</div>\n";
	}

	// Show Wide Sidebar Bottom if there are 2 left sidebars. Consequently close #sidebar-wrap.
	if ($left_count == 2) {
		if (!suffusion_is_sidebar_empty(19)) {
			suffusion_print_sidebar(19, 'wsidebar-bottom', 'Wide Sidebar (Bottom)', $suf_wa_wsb_style, 'left');
		}
		echo "</div><!-- #sidebar-wrap -->\n";
	}

	// Close container, created if there is a static tabbed sidebar.
	if ($suf_sbtab_enabled == 'enabled' && ($suf_sbtab_alignment == 'left' || ($left_count == 1 && $right_count == 0) || $left_count == 2)) {
		echo "</div> <!-- /#sidebar-container -->";
	}
}

/**
 * Displays all right sidebars. This shows the following:
 *  1. Static tabbed sidebar, if enabled and either explicitly positioned right or if positioned left but there are no left sidebars.
 *  2. A wide sidebar at the top, if there are 2 right sidebars
 *  3. Sidebar 1 & Sidebar 1 - bottom, if applicable
 *  4. Sidebar 2 & Sidebar 2 - bottom, if applicable
 *  5. A wide sidebar at the bottom, if there are 2 right sidebars.
 *
 * @return
 */
function suffusion_print_right_sidebars() {
	global $suffusion;
	wp_reset_postdata();
	if (!isset($suffusion) || is_null($suffusion)) {
		$suffusion = new Suffusion();
	}
	$context = $suffusion->get_context();

	$right_count = suffusion_get_right_sidebar_count($context);

	if ($right_count == 0) {
		return;
	}

	global $suf_sidebar_alignment, $suf_sbtab_alignment, $suffusion_tabs_alignment, $suf_sbtab_enabled, $suf_wa_sb1b_style, $suf_wa_sb2b_style, $suf_wa_wst_style, $suf_wa_wsb_style;
	$left_count = suffusion_get_left_sidebar_count($context);

	// Show static tabbed sidebar if it is enabled:
	//  1. And positioned on the right
	//  2. Or there is only one sidebar and that is to the right
	//  3. Or there are 2 right sidebars.
	if ($suf_sbtab_enabled == 'enabled' && ($suf_sbtab_alignment == 'right' || ($right_count == 1 && $left_count == 0) || $right_count == 2)) {
		echo "<div id='sidebar-container' class='sidebar-container-right fix'>";
		$suffusion_tabs_alignment = 'right';
		get_sidebar('tabs');
	}

	// Show Wide Sidebar Top if there are 2 right sidebars
	if ($right_count == 2) {
		echo "<div id='sidebar-wrap' class='sidebar-wrap sidebar-wrap-right fix'>";
		if (!suffusion_is_sidebar_empty(18)) {
			suffusion_print_sidebar(18, 'wsidebar-top', 'Wide Sidebar (Top)', $suf_wa_wst_style, 'right');
		}
	}

	// Show Sidebar-1 if:
	//  1. There is only 1 sidebar to be shown and that's on the right
	//  2. Or there are 2 sidebars to be shown, one on the left and one on the right, and sidebar-1 has right alignment
	//  3. Or there are 2 sidebars to be shown, both on the right
	if ((($right_count == 1 && $left_count == 0) || ($right_count == 1 && $left_count == 1 && $suf_sidebar_alignment == 'right') || $right_count == 2)) {
		echo "<div id='sidebar-shell-1' class='sidebar-shell sidebar-shell-right'>\n";
		suffusion_before_first_sidebar();
		get_sidebar();
		suffusion_between_first_sidebars();
		suffusion_print_sidebar(9, 'sidebar-b', 'Sidebar 1 (Bottom)', $suf_wa_sb1b_style, "right");
		suffusion_after_first_sidebar();
		echo "</div>\n";
	}

	// Show Sidebar-2 if:
	//  1. There is 1 sidebar on the left and one on the right, and sidebar-2 has right alignment
	//  2. Or there are 2 sidebars to be shown, both on the right
	if ((($right_count == 1 && $left_count == 1 && $suf_sidebar_alignment == "left") || $right_count == 2)) {
		echo "<div id='sidebar-shell-2' class='sidebar-shell sidebar-shell-right'>\n";
		suffusion_before_second_sidebar();
		get_sidebar(2);
		suffusion_between_second_sidebars();
		suffusion_print_sidebar(10, 'sidebar-2-b', 'Sidebar 2 (Bottom)', $suf_wa_sb2b_style, "right");
		suffusion_after_second_sidebar();
		echo "</div>\n";
	}

	// Show Wide Sidebar Bottom if there are 2 right sidebars. Consequently close #sidebar-wrap.
	if ($right_count == 2) {
		if (!suffusion_is_sidebar_empty(19)) {
			suffusion_print_sidebar(19, 'wsidebar-bottom', 'Wide Sidebar (Bottom)', $suf_wa_wsb_style, 'right');
		}
		echo "</div>";
	}

	// Close container, created if there is a static tabbed sidebar.
	if ($suf_sbtab_enabled == 'enabled' && ($suf_sbtab_alignment == 'right' || ($right_count == 1 && $left_count == 0) || $right_count == 2)) {
		echo "</div> <!-- /#sidebar-container -->";
	}
}

/**
 * Computes and returns the number of sidebars to show on the left. The result is passed through the filter "suffusion_left_sidebar_count".
 *
 * @param array $context
 * @return int|mixed|void
 */
function suffusion_get_left_sidebar_count($context = array()) {
	global $suf_sidebar_count, $suf_sidebar_alignment, $suf_sidebar_2_alignment;
	$display = apply_filters('suffusion_can_display_left_sidebars', true); // Custom templates can use this hook to avoid sidebars
	if (!$display) {
		return 0;
	}

	if (is_page_template('no-sidebars.php') || is_page_template('1r-sidebar.php') || is_page_template('2r-sidebars.php')) {// These templates have 0 left sidebars
		$ret = 0;
	}
	else if (is_page_template('1l-sidebar.php') || is_page_template('1l1r-sidebar.php')) {// These templates have 1 left sidebar
		$ret = 1;
	}
	else if (is_page_template('2l-sidebars.php')) {// This template has 2 left sidebars
		$ret = 2;
	}
	else if ($suf_sidebar_count == 0 || ($suf_sidebar_count == 1 && $suf_sidebar_alignment == 'right') ||
			($suf_sidebar_count == 2 && $suf_sidebar_alignment == 'right' && $suf_sidebar_2_alignment == 'right')) {// These non-template layouts have 0 left sidebars
		$ret = 0;
	}
	else if (($suf_sidebar_count == 1 && $suf_sidebar_alignment == 'left') ||
			($suf_sidebar_count == 2 && (($suf_sidebar_alignment == 'left' && $suf_sidebar_2_alignment == 'right') ||
					($suf_sidebar_alignment == 'right' && $suf_sidebar_2_alignment == 'left')))) {// These non-template layouts have 1 left sidebar
		$ret = 1;
	}
	else if ($suf_sidebar_count == 2 && $suf_sidebar_alignment == 'left' && $suf_sidebar_2_alignment == 'left') {// These non-template layouts have 2 left sidebars
		$ret = 2;
	}
	return apply_filters('suffusion_left_sidebar_count', $ret, 'left', $context);
}

/**
 * Computes and returns the number of sidebars to show on the right. The result is passed through the filter "suffusion_right_sidebar_count".
 *
 * @return mixed|void
 */
function suffusion_get_right_sidebar_count($context = array()) {
	global $suf_sidebar_count, $suf_sidebar_alignment, $suf_sidebar_2_alignment, $post;
	$display = apply_filters('suffusion_can_display_right_sidebars', true); // Custom templates can use this hook to avoid sidebars
	if (!$display) {
		return 0;
	}
//	$page_layout = suffusion_get_post_meta($post->ID, 'suf_pseudo_template', true);

	if (is_page_template('no-sidebars.php') || is_page_template('1l-sidebar.php') || is_page_template('2l-sidebars.php')) {
		$ret = 0;
	}
	else if (is_page_template('1r-sidebar.php') || is_page_template('1l1r-sidebar.php')) {
		$ret = 1;
	}
	else if (is_page_template('2r-sidebars.php')) {
		$ret = 2;
	}
	else if ($suf_sidebar_count == 0 || ($suf_sidebar_count == 1 && $suf_sidebar_alignment == 'left') ||
			($suf_sidebar_count == 2 && $suf_sidebar_alignment == 'left' && $suf_sidebar_2_alignment == 'left')) {
		$ret = 0;
	}
	else if (($suf_sidebar_count == 1 && $suf_sidebar_alignment == 'right') ||
			($suf_sidebar_count == 2 && (($suf_sidebar_alignment == 'left' && $suf_sidebar_2_alignment == 'right') || ($suf_sidebar_alignment == 'right' && $suf_sidebar_2_alignment == 'left')))) {
		$ret = 1;
	}
	else if ($suf_sidebar_count == 2 && $suf_sidebar_alignment == 'right' && $suf_sidebar_2_alignment == 'right') {
		$ret = 2;
	}
	return apply_filters('suffusion_right_sidebar_count', $ret, 'right', $context);
}

/**
 * For a given page this returns the number of sidebars to display on a particular side. In Version 3.7.4 this supports just the blog page,
 * but will subsequently be extended to other views.
 *
 * @param  $count
 * @param string $position
 * @param array $context
 * @return
 */
function suffusion_get_sidebar_count_for_view($count, $position = 'right', $context = array()) {
	global $suffusion_sidebar_context_presets, $post;
	foreach ($suffusion_sidebar_context_presets as $preset) {
		if (in_array($preset, $context)) {
			$count_option = "suf_{$preset}_sidebar_count";
			global $$count_option;
			if (isset($$count_option)) {
				$special_template = $$count_option;
			}
		}
	}

	// The current view is not any preset ('search', 'date', 'author', 'tag', 'category', 'blog', 'magazine'). Check if this is a single post.
	if (!isset($count_option)) {
		if (is_singular() && !is_page()) {
			$post_template = suffusion_get_post_meta($post->ID, 'suf_pseudo_template', true);
			$special_template = ($post_template == '' || $post_template === 0 || $post_template == "0") ? 'default' : $post_template;
		}
		else if (is_page()) {
			$post_template = suffusion_get_post_meta($post->ID, 'suf_pseudo_template', true);
			if ($post_template != '' && $post_template !== 0 && $post_template != "0" &&
				!(is_page_template('no-sidebars.php') || is_page_template('1l-sidebar.php') || is_page_template('1r-sidebar.php') ||
				  is_page_template('2l-sidebars.php') || is_page_template('2r-sidebars.php') || is_page_template('1l1r-sidebar.php'))) {
				$special_template = $post_template;
			}
		}
	}

	if (!isset($special_template)) {
		return $count;
	}
	
	$inherit = $special_template;

	$position_count = array('default' => $count, '0' => 0, 'no' => 0,
		'1l' => array('left' => 1, 'right' => 0), '1r' => array('left' => 0, 'right' => 1), '1l1r' => array('left' => 1, 'right' => 1),
		'2l' => array('left' => 2, 'right' => 0), '2r' => array('left' => 0, 'right' => 2), );
	if (!isset($position_count[$inherit])) {
		return $position_count['default'];
	}
	$new_count = $position_count[$inherit];
	if (is_array($new_count)) {
		return $new_count[$position];
	}
	return $new_count;
}

/**
 * Returns the class corresponding to the template that a particular page is supposed to mimic. In case of single posts this gets the value
 * of the meta field 'suf_pseudo_template' for that post, and returns the template corresponding to that.
 * 
 * @return array
 */
function suffusion_get_pseudo_template_class() {
	global $suffusion, $suffusion_sidebar_context_presets, $post;
	if (!isset($suffusion) || is_null($suffusion)) {
		$suffusion = new Suffusion();
	}
	$context = $suffusion->get_context();

	foreach ($suffusion_sidebar_context_presets as $preset) {
		if (in_array($preset, $context)) {
			$count_option = "suf_{$preset}_sidebar_count";
			global $$count_option;
			if (isset($$count_option)) {
				$special_template = $$count_option;
			}
		}
	}

	// The current view is not any preset ('search', 'date', 'author', 'tag', 'category', 'blog'). Check if this is a single post.
	if (!isset($count_option)) {
		$post_template = suffusion_get_post_meta($post->ID, 'suf_pseudo_template', true);
		if (is_singular() && !is_page()) {
			$special_template = ($post_template == '' || $post_template === 0 || $post_template == "0") ? 'default' : $post_template;
		}
		else if (is_page()) {
			if ($post_template != '' && $post_template !== 0 && $post_template != "0" &&
				!(is_page_template('no-sidebars.php') || is_page_template('1l-sidebar.php') || is_page_template('1r-sidebar.php') ||
				  is_page_template('2l-sidebars.php') || is_page_template('2r-sidebars.php') || is_page_template('1l1r-sidebar.php'))) {
				$special_template = $post_template;
			}
		}
	}

	if (!isset($special_template)) {
		return array();
	}

	switch ($special_template) {
		case 'default':
			$template = '';
			break;
		case '0':
		case 'no':
			$template = 'no-sidebars.php';
			break;
		case '1l':
			$template = '1l-sidebar.php';
			break;
		case '1r':
			$template = '1r-sidebar.php';
			break;
		case '1l1r':
			$template = '1l1r-sidebar.php';
			break;
		case '2l':
			$template = '2l-sidebars.php';
			break;
		case '2r':
			$template = '2r-sidebars.php';
			break;
		default:
			$template = '';
			break;
	}

	if ($template != '') {
		$template = 'page-template-'.str_replace('.', '-', $template);
		$suffusion->set_body_layout($template);
		$template = array($template);
	}
	else {
		$template = array();
	}

	return apply_filters('suffusion_pseudo_template_class', $template);
}

/*
 * Displays the widget area above the footer, if it is enabled.
 */
function suffusion_print_widget_area_above_footer() {
	get_sidebar('above-footer');
}

function suffusion_display_footer() {
	get_template_part('custom/site-footer');
}

function suffusion_get_siblings_in_nav($ancestors, $index, $exclusion_list, $exclude, $echo = 1) {
	if (count($ancestors) <= $index || $index < 0) {
		return '';
	}
	$exclusion_query = $exclude == "hide" ? "&exclude=".$exclusion_list : "";
	$children = wp_list_pages("title_li=&child_of=".$ancestors[$index]."&echo=".$echo.$exclusion_query);
	return $children;
}

function suffusion_excerpt_or_content() {
	global $suf_category_excerpt, $suf_tag_excerpt, $suf_archive_excerpt, $suf_index_excerpt, $suf_search_excerpt, $suf_author_excerpt, $suf_show_excerpt_thumbnail, $suffusion_current_post_index, $suffusion_full_post_count_for_view, $suf_pop_excerpt, $page_of_posts;
	global $suffusion_cpt_post_id;

	if (isset($suffusion_cpt_post_id)) {
		$cpt_excerpt = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_post_type_layout', true);
		$cpt_image = suffusion_get_post_meta($suffusion_cpt_post_id, 'suf_cpt_show_excerpt_thumb', true);
	}
	else {
		$cpt_excerpt = false;
	}

	if (($suffusion_current_post_index > $suffusion_full_post_count_for_view) && ($cpt_excerpt ||
		(is_category() && $suf_category_excerpt == "excerpt") ||
		(is_tag() && $suf_tag_excerpt == "excerpt") ||
		(is_search() && $suf_search_excerpt == "excerpt") ||
		(is_author() && $suf_author_excerpt == "excerpt") ||
		((is_date() || is_year() || is_month() || is_day() || is_time())&& $suf_archive_excerpt == "excerpt") ||
		(isset($page_of_posts) && $page_of_posts && $suf_pop_excerpt == "excerpt") ||
		(!(is_singular() || is_category() || is_tag() || is_search() || is_author() || is_date() || is_year() || is_month() || is_day() || is_time()) && $suf_index_excerpt == "excerpt"))) {
		$show_image = isset($cpt_image) ? $cpt_image : ($suf_show_excerpt_thumbnail == "show" ? true : false);
		suffusion_excerpt($show_image);
	}
	else {
		get_template_part('post-formats/content', suffusion_get_post_format());
	}
}

// Wrapping this to account for future plugin development
if (!function_exists('suffusion_excerpt')) {
	/**
	 * Generates an excerpt with additional parameters
	 *
	 * @param bool $show_image 			Shows a thumbnail if set to true
	 * @param bool $echo 				Echoes the output
	 * @param bool $filter_length		Whether a filter should be applied to restrict the length of the excerpt
	 * @param string $length_callback	Function to call for controlling the excerpt length. Default is <code>suffusion_excerpt_length</code>
	 * @return mixed|string|void
	 */
	function suffusion_excerpt($show_image = false, $echo = true, $filter_length = true, $length_callback = 'suffusion_excerpt_length') {
		$ret = "";
		if ($show_image) {
			$ret = suffusion_get_image(array());
		}
		if ($filter_length) {
			if (function_exists($length_callback)) {
				add_filter('excerpt_length', $length_callback);
			}
			else {
				add_filter('excerpt_length', 'suffusion_excerpt_length');
			}
		}

		// If this is a YAPB post, disable this filter, otherwise the YAPB thumbnail is shown in excerpts...
		if (function_exists('yapb_is_photoblog_post') && yapb_is_photoblog_post()) {
			global $yapb;
			remove_filter('the_content', array(&$yapb, '_filter_the_content'));
		}

		$excerpt = get_the_excerpt();
		$excerpt = apply_filters('the_excerpt', $excerpt);
		$ret .= $excerpt;
		if ($echo) {
			echo $ret;
		}

		// If this is a YAPB post, re-add this filter for full content posts
		if (function_exists('yapb_is_photoblog_post') && yapb_is_photoblog_post()) {
			global $yapb;
			add_filter('the_content', array(&$yapb, '_filter_the_content'));
		}

		return $ret;
	}
}

/**
 * Returns an author byline. The format is determined by a setting, which can let the user pick between various options, like "Posted by x",
 * or "Posted by x at <time>" or "Posted by x at <time> on <date>" or "Posted by x on <date> at <time>". Each format is translatable.
 *
 * @param bool $echo
 * @param bool $show_icon
 * @return string
 */
function suffusion_print_author_byline($echo = true, $show_icon = true) {
	global $suf_page_posted_by_format, $suf_post_posted_by_format;
	$ret = '<span class="author">';
	if ($show_icon) {
		$ret .= '<span class="icon">&nbsp;</span>';
	}
	if (is_page()) {
		$format = $suf_page_posted_by_format;
	}
	else {
		$format = $suf_post_posted_by_format;
	}
	switch ($format) {
		case 'by':
			$ret .= sprintf(__('Posted by %1$s', 'suffusion'), '<span class="vcard"><a href="'.get_author_posts_url(get_the_author_meta('ID')).'" class="url fn" rel="author">'.get_the_author().'</a></span>');
			break;
		case 'by-at':
			$ret .= sprintf(__('Posted by %1$s at %2$s', 'suffusion'), '<span class="vcard"><a href="'.get_author_posts_url(get_the_author_meta('ID')).'" class="url fn" rel="author">'.get_the_author().'</a></span>', get_the_time(get_option('time_format')));
			break;
		case 'by-on':
			$ret .= sprintf(__('Posted by %1$s on %2$s', 'suffusion'), '<span class="vcard"><a href="'.get_author_posts_url(get_the_author_meta('ID')).'" class="url fn" rel="author">'.get_the_author().'</a></span>', get_the_time(get_option('date_format')));
			break;
		case 'by-on-at':
			$ret .= sprintf(__('Posted by %1$s on %2$s at %3$s', 'suffusion'), '<span class="vcard"><a href="'.get_author_posts_url(get_the_author_meta('ID')).'" class="url fn" rel="author">'.get_the_author().'</a></span>', get_the_time(get_option('date_format')), get_the_time(get_option('time_format')));
			break;
		case 'by-at-on':
			$ret .= sprintf(__('Posted by %1$s at %2$s on %3$s', 'suffusion'), '<span class="vcard"><a href="'.get_author_posts_url(get_the_author_meta('ID')).'" class="url fn" rel="author">'.get_the_author().'</a></span>', get_the_time(get_option('time_format')), get_the_time(get_option('date_format')));
			break;
	}
	$ret .= "</span>";
	if ($echo) {
		echo $ret;
	}
	return $ret;
}

function suffusion_post_footer() {
	get_template_part('custom/post-footer', get_post_type());
}

function suffusion_disable_plugin_styles() {
	wp_deregister_style('wp-pagenavi');
}

function suffusion_pagination() {
	get_template_part('custom/pagination', 'posts');
}

function suffusion_featured_posts() {
	if (is_singular() && !is_page()) {
		return;
	}
	global $suf_featured_category_view, $suf_featured_tag_view, $suf_featured_search_view, $suf_featured_author_view, $suf_featured_time_view, $suf_featured_index_view;
	global $suf_mag_featured_enabled, $suf_featured_pages_with_fc, $post, $suf_featured_view_first_only;
    $pages_with_fc = explode(',', $suf_featured_pages_with_fc);
	if ((is_category() && $suf_featured_category_view == "enabled") || (is_tag() && $suf_featured_tag_view == "enabled") ||
		(is_search() && $suf_featured_search_view == "enabled") || (is_author() && $suf_featured_author_view == "enabled") ||
		(is_page_template('magazine.php') && $suf_mag_featured_enabled == 'enabled') ||
        (is_page() && isset($pages_with_fc) && is_array($pages_with_fc) && isset($post) && isset($post->ID) && in_array($post->ID, $pages_with_fc)) ||
		((is_date() || is_year() || is_month() || is_day() || is_time()) && $suf_featured_time_view == "enabled") ||
		(!(is_category() || is_tag() || is_search() || is_author() || is_date() || is_year() || is_month() || is_day() || is_time() || is_page_template('magazine.php') || is_page())
			&& $suf_featured_index_view == "enabled")) {
		if (!is_page() && $suf_featured_view_first_only == 'first' && is_paged()) {
			return;
		}
		locate_template(array("featured-posts.php"), true);
		suffusion_display_featured_posts();
	}
}

function suffusion_include_featured_js() {
	global $suf_featured_category_view, $suf_featured_tag_view, $suf_featured_search_view;
	global $suf_featured_author_view, $suf_featured_time_view, $suf_featured_index_view, $suf_mag_featured_enabled, $suf_featured_pages_with_fc;
	if ((is_category() && $suf_featured_category_view == "enabled") || (is_tag() && $suf_featured_tag_view == "enabled") ||
		(is_search() && $suf_featured_search_view == "enabled") || (is_author() && $suf_featured_author_view == "enabled") ||
		(is_page_template('magazine.php') && $suf_mag_featured_enabled == 'enabled') ||
        (is_page() && $suf_featured_pages_with_fc != '') ||
		(!is_admin() && (is_active_widget('Suffusion_Featured_Posts', false, 'suf-featured-posts', true))) ||
		((is_date() || is_year() || is_month() || is_day() || is_time()) && $suf_featured_time_view == "enabled") ||
		(!(is_category() || is_tag() || is_search() || is_author() || is_date() || is_year() || is_month() || is_day() || is_time() || is_page_template('magazine.php') || is_page()) && $suf_featured_index_view == "enabled")) {
		// Photonic is a plugin by me, so I know that it loads JQuery Cycle always. If Photonic is active there is no need to load JQuery Cycle via Suffusion.
		if (!class_exists('Photonic')) {
			wp_enqueue_script('suffusion-jquery-cycle');
		}
	}
}

function suffusion_template_specific_header() {
	global $suf_cat_info_enabled, $suf_author_info_enabled, $suf_tag_info_enabled, $suf_search_info_enabled, $suffusion_mosaic_layout;
	if (is_category() && ($suf_cat_info_enabled == 'enabled') && apply_filters('suffusion_can_display_category_information', true)) { ?>
		<section class="info-category post fix">
			<header class="post-header">
				<h2 class="category-title"><?php single_cat_title(); ?></h2>
			</header>
<?php echo suffusion_get_category_information(); ?>
		</section><!-- .info-category -->
<?php
	}
	else if (is_author() && ($suf_author_info_enabled == 'enabled') && apply_filters('suffusion_can_display_author_information', true)) {
		$author_id = get_query_var('author'); ?>
		<section id="author-profile-<?php the_author_meta('user_nicename', $author_id); ?>" class="author-profile author-even post fix">
			<header class="post-header">
				<h2 class="author-title"><?php the_author_meta('display_name', $author_id); ?></h2>
			</header>
			<?php echo suffusion_get_author_information();?>
		</section><!-- /.author-profile -->
<?php
	}
	else if (is_tag() && ($suf_tag_info_enabled == 'enabled') && apply_filters('suffusion_can_display_tag_information', true)) { ?>
		<section class="info-tag post fix">
			<header class="post-header">
				<h2 class="tag-title"><?php single_tag_title(); ?></h2>
			</header>
		<?php echo tag_description(get_query_var('tag_id')); ?>
		</section><!-- .info-tag -->
<?php
	}
	else if (is_search() && $suf_search_info_enabled == 'enabled' && apply_filters('suffusion_can_display_search_information', true)) {
		if (have_posts()) {	?>
		<section class='post fix'>
			<header class='post-header'>
				<h2 class='posttitle'><?php $title = wp_title(':', false); $title = trim($title); if (substr($title, 0, 1) == ':') { $title = substr($title, 1);} echo $title; ?></h2>
			</header>
			<form method="get" action="<?php echo home_url(); ?>/" class='search-info' id='search-info'>
				<input class="search-hl checkbox" name="search-hl" id="search-hl" type="checkbox"/>
				<label class='search-hl' for='search-hl'><?php _e('Highlight matching results below', 'suffusion');?></label>
				<input type='hidden' name='search-term' id='search-term' value="<?php $search_term = get_search_query(); echo esc_attr($search_term);?>"/>
			</form>
			<?php get_search_form(); ?>
		</section>
<?php
		}
	}
}

function suffusion_get_category_information() {
	$ret = "<div class=\"category-description\">\n";
	if (function_exists('get_cat_icon')) {
		$cat = get_queried_object_id();
		$ret .= get_cat_icon('echo=false&cat='.$cat);
	}
	$ret .= category_description()."\n";
	$ret .= "</div><!-- .category-description -->\n";
	$ret = apply_filters('suffusion_category_information', $ret);
	return $ret;
}

function suffusion_get_author_information() {
	$author_id = get_query_var('author');
	$ret = "<div class=\"author-description\">\n";
	$ret .= get_avatar(get_the_author_meta('user_email', $author_id), '96')."\n";
	$ret .= "<p class=\"author-bio fix\">\n";
	$ret .= get_the_author_meta('description', $author_id)."\n";
	$ret .= "</p><!-- /.author-bio -->\n";
	if (is_author()) {
		$ret .= suffusion_get_author_profile_links($author_id);
	}
	$ret .= "</div><!-- /.author-description -->\n";
	$ret = apply_filters('suffusion_author_information', $ret);
	return $ret;
}

function suffusion_print_post_page_title() {
	get_template_part('custom/post-header', get_post_type());
}

function suffusion_include_custom_js_files() {
	for ($i = 1; $i <= 3; $i++) {
		$script = "suf_custom_js_file_$i";
		global $$script;
		if ($$script) {
			wp_enqueue_script("suffusion-js-$i", $$script, array(), null);
		}
	}
}

function suffusion_include_jqfix_js() {
	global $suffusion, $suffusion_is_ie6, $suf_fix_aspect_ratio, $suf_enable_audio_shortcode;
	global $suf_nav_delay, $suf_nav_effect, $suf_navt_delay, $suf_navt_effect, $suf_featured_interval, $suf_featured_fx, $suf_featured_transition_speed, $suf_featured_sync, $suf_jq_masonry_enabled;
	global $suf_featured_pager_style, $suf_mosaic_zoom_library;

	if (!function_exists('audio_shortcode') && !class_exists('AudioPlayer') && isset($suf_enable_audio_shortcode) && $suf_enable_audio_shortcode == 'on') {
		wp_enqueue_script('suffusion-audioplayer', get_template_directory_uri() . '/scripts/audio-player.js', array('jquery'), SUFFUSION_THEME_VERSION);
	}
	
	wp_enqueue_script('suffusion', get_template_directory_uri() . '/scripts/suffusion.js', array('jquery'), SUFFUSION_THEME_VERSION);
	if ($suffusion_is_ie6) {
		wp_enqueue_script('suffusion-ie6', get_template_directory_uri() . '/scripts/ie-fix.js', array('suffusion'), SUFFUSION_THEME_VERSION);
	}

	if ($suffusion->get_content_layout() == 'mosaic') {
		if ($suf_mosaic_zoom_library == 'fancybox') {
			wp_enqueue_script('suffusion-slideshow', get_template_directory_uri().'/scripts/jquery.fancybox-1.3.4.pack.js', array('jquery'), SUFFUSION_THEME_VERSION);
		}
		else if ($suf_mosaic_zoom_library == 'colorbox') {
			wp_enqueue_script('suffusion-slideshow', get_template_directory_uri().'/scripts/jquery.colorbox-min.js', array('jquery'), SUFFUSION_THEME_VERSION);
		}
	}

	if (!is_admin() && is_active_widget('Suffusion_Google_Translator', false, 'suf-google-translator', true)) {
		// For some reason the translation widget fails if we load the JS in the header. Hence we are overriding the header/footer JS setting
		wp_enqueue_script('suffusion-google-translate', 'http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit', array(), null, true);
	}

	$template_widths = suffusion_get_template_prefixes();
	$template_widths[''] = '';
	$template_widths['no-sidebars.php'] = '';

	$base_array = array();
	$widths_array = array();
	foreach ($template_widths as $template => $prefix) {
		$template_class = $template == "" ? "" : "_page_template_".str_replace('.', '_', str_replace('-', '_', $template));
		$width_var = 'suf'.$prefix.'_wrapper_width_type';
		$max_var = 'suf'.$prefix.'_wrapper_width_flex_max';
		$min_var = 'suf'.$prefix.'_wrapper_width_flex_min';
		$orig_var = 'suf'.$prefix.'_wrapper_width_flex';
		global $$width_var, $$max_var, $$min_var, $$orig_var;
		$widths_array['wrapper_width_type'.$template_class] = "{$$width_var}";
		$widths_array['wrapper_max_width'.$template_class] = "{$$max_var}";
		$widths_array['wrapper_min_width'.$template_class] = "{$$min_var}";
		$widths_array['wrapper_orig_width'.$template_class] = "{$$orig_var}";
	}

	foreach ($widths_array as $var => $value) {
		$base_array[$var] = $value;
	}

	$base_array['suf_featured_interval'] = $suf_featured_interval;
	$base_array['suf_featured_transition_speed'] = $suf_featured_transition_speed;
	$base_array['suf_featured_fx'] = $suf_featured_fx;
	$base_array['suf_featured_pause'] = __('Pause', 'suffusion');
	$base_array['suf_featured_resume'] = __('Resume', 'suffusion');
	$base_array['suf_featured_sync'] = $suf_featured_sync;
	$base_array['suf_featured_pager_style'] = $suf_featured_pager_style;

	if ($suf_nav_delay == '') {
		$delay = "0";
	}
	else {
		$delay = $suf_nav_delay;
	}

	if ($suf_navt_delay == '') {
		$delay_top = "0";
	}
	else {
		$delay_top = $suf_navt_delay;
	}

	$base_array['suf_nav_delay'] = $delay;
	$base_array['suf_nav_effect'] = $suf_nav_effect;
	$base_array['suf_navt_delay'] = $delay_top;
	$base_array['suf_navt_effect'] = $suf_navt_effect;
	$base_array['suf_jq_masonry_enabled'] = $suf_jq_masonry_enabled;
	$base_array['suf_fix_aspect_ratio'] = $suf_fix_aspect_ratio;

	$drop_caps = array();
	global $suf_drop_cap_post_views, $suf_drop_cap_post_formats;
	$post_views = explode(',', $suf_drop_cap_post_views);
	$post_formats = explode(',', $suf_drop_cap_post_formats);
	if (is_array($post_views) && count($post_views) > 0) {
		foreach ($post_views as $view) {
			if ($view == 'page') {
				$drop_caps[] = ".$view p.first-para";
			}
			else if ($view == 'full-content' || $view == 'excerpt') {
				if (is_array($post_formats) && count($post_formats) > 0) {
					foreach ($post_formats as $format) {
						$drop_caps[] = ".$view.format-$format p.first-para";
					}
				}
			}
			else if ($view != '') {
				$drop_caps[] = ".$view p:first-child";
			}
		}
	}
	$drop_cap = implode(', ', $drop_caps);

	$base_array['suf_show_drop_caps'] = $drop_cap;

	wp_localize_script('suffusion', 'Suffusion_JS', $base_array);
}

function suffusion_set_title() {
	global $suf_seo_enabled;
	if ($suf_seo_enabled != 'enabled') {
		if (is_home() || is_front_page()) {
			echo "\t<title>".wp_title('', false)."</title>\n";
		}
		else {
			echo "\t<title>".wp_title('&raquo;', false)."</title>\n";
		}
		return;
	}

	echo "\t<title>".wp_title('', false)."</title>\n";
}

function suffusion_include_meta() {
	get_template_part('custom/seo');
}

function suffusion_include_ie7_compatibility_mode() {
	global $suf_ie7_compatibility;
	if ($suf_ie7_compatibility == 'force') {
		echo "\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=EmulateIE7\" />\n";
	}
}

function suffusion_include_default_feed() {
	global $suf_custom_default_rss_enabled, $wp_version;
	if ($suf_custom_default_rss_enabled == 'enabled') {
		if ($wp_version < 3) {
			echo "\t".'<link rel="alternate" type="application/rss+xml" title="'.esc_attr(get_bloginfo('name')).' RSS Feed" href="'.get_feed_link('rss2').'" />'."\n";
		}
	}
}

function suffusion_author_information() {
    global $suf_uprof_post_info_enabled, $suf_uprof_post_info_header, $suf_uprof_post_info_content, $suf_uprof_post_info_gravatar;
    global $suf_uprof_post_info_gravatar_size;
	if (is_singular()) {
		$ret = "";
		if ($suf_uprof_post_info_enabled == 'bottom' || (is_page() && $suf_uprof_post_info_enabled == 'pages') || (!is_page() && $suf_uprof_post_info_enabled == 'posts')) {
			$ret = "<div class='author-info fix'>\n";
			if (trim($suf_uprof_post_info_header) != '') {
				$header = stripslashes($suf_uprof_post_info_header);
				$header = wp_specialchars_decode($header, ENT_QUOTES);
				$header = do_shortcode($header);
				$ret .= "<h4>".$header."</h4>\n";
			}
			if ($suf_uprof_post_info_gravatar == 'show') {
				$ret .= get_avatar(get_the_author_meta('user_email'), "$suf_uprof_post_info_gravatar_size");
			}
			if (trim($suf_uprof_post_info_content) != '') {
				$body = stripslashes($suf_uprof_post_info_content);
				$body = wp_specialchars_decode($body, ENT_QUOTES);
				$body = do_shortcode($body);
				$ret .= $body;
			}
			$ret .= "</div>\n";
		}
		echo $ret;
	}
}

function suffusion_include_favicon() {
	global $suf_favicon_path;
	if (trim($suf_favicon_path) != '') {
		echo "<link rel='shortcut icon' href='$suf_favicon_path' />\n";
	}
}

function suffusion_display_open_header() {
	global $suf_header_layout_style;
	$display = apply_filters('suffusion_can_display_open_header', true);
	if (!$display) {
		return;
	}
	if ($suf_header_layout_style != 'in-align') {
		if ($suf_header_layout_style  == 'out-hcalign' || $suf_header_layout_style  == 'out-cfull-halign') {
			suffusion_display_top_navigation();
			suffusion_display_widgets_above_header();
		}
?>
		<div id="header-container" class="custom-header fix">
			<div class='col-control fix'>
<?php
		if ($suf_header_layout_style  == 'out-hcfull') {
			suffusion_display_top_navigation();
			suffusion_display_widgets_above_header();
		}
		suffusion_display_header();
		if ($suf_header_layout_style  == 'out-hcfull') {
			suffusion_display_main_navigation();
		}
	?>
			</div>
		</div><!-- //#header-container -->
<?php
		if ($suf_header_layout_style  == 'out-hcalign' || $suf_header_layout_style  == 'out-cfull-halign') {
			suffusion_display_main_navigation();
		}
	}
	else {
		suffusion_display_top_navigation();
		suffusion_display_widgets_above_header();
	}
}

function suffusion_display_closed_header() {
	global $suf_header_layout_style;
	$display = apply_filters('suffusion_can_display_closed_header', true);
	if (!$display) {
		return;
	}
	if ($suf_header_layout_style == 'in-align') {
?>
			<div id="header-container" class="custom-header fix">
				<?php
					suffusion_page_header();
				?>
			</div><!-- //#header-container -->
<?php
	}
}

function suffusion_display_widgets_above_header() {
	get_sidebar('above-header');
}

function suffusion_display_widgets_in_header() {
	get_sidebar('in-header');
}

function suffusion_should_include_dbx() {
	global $suffusion, $suf_sidebar_1_dnd, $suf_sidebar_2_dnd;
	if (!isset($suffusion) || is_null($suffusion)) {
		$suffusion = new Suffusion();
	}
	$context = $suffusion->get_context();

	$left_count = suffusion_get_left_sidebar_count($context);
	$right_count = suffusion_get_right_sidebar_count($context);

	$total_count = $left_count + $right_count;
	if ($total_count == 0 || ($total_count == 1 && $suf_sidebar_1_dnd != "enabled") || ($total_count == 2 && $suf_sidebar_1_dnd != "enabled" && $suf_sidebar_2_dnd != "enabled")) {
		return false;
	}
	else {
		return true;
	}
}

function suffusion_include_bp_js() {
	if (!is_admin() && function_exists('bp_is_group')) {
		wp_enqueue_script('suffusion-bp-ajax-js', WP_PLUGIN_URL . '/buddypress/bp-themes/bp-default/_inc/global.js', array('jquery'), null);
	}
}

function suffusion_meta_pullout() {
	global $post, $suf_page_meta_position;

	if ((!is_singular() && $post->post_type != 'page') || (is_singular() && !is_page())) {
		$original_format = suffusion_get_post_format();
		if ($original_format == 'standard') {
			$format = '';
		}
		else {
			$format = $original_format . '_';
		}
		$meta_position = 'suf_post_' . $format . 'meta_position';
		global $$meta_position;
		$post_meta_position = apply_filters('suffusion_byline_position', $$meta_position);

		if ($post_meta_position == 'left-pullout' || $post_meta_position == 'right-pullout') {
			get_template_part('custom/pullout', $original_format);
		}
	}

	if (($suf_page_meta_position == 'left-pullout' || $suf_page_meta_position == 'right-pullout') && (is_page() || (!is_singular() && $post->post_type == 'page'))) {
		get_template_part('custom/pullout', suffusion_get_page_template());
	}
}

function suffusion_print_outer_pullout($id = 0, $display = 'blog', $index = 0) {
	if ($display != 'blog') {
		return;
	}
	global $post, $suf_page_meta_position;
	if ($id === 0) {
		$id = $post->ID;
	}

	if ((!is_singular() && $post->post_type != 'page') || (is_singular() && !is_page())) {
		$original_format = suffusion_get_post_format();
		if ($original_format == 'standard') {
			$format = '';
		}
		else {
			$format = $original_format . '_';
		}
		$meta_position = 'suf_post_' . $format . 'meta_position';
		global $$meta_position;
		$post_meta_position = apply_filters('suffusion_byline_position', $$meta_position);

		if ($post_meta_position == 'left-outer-pullout' || $post_meta_position == 'right-outer-pullout') {
			get_template_part('custom/pullout', $original_format);
		}
	}

	if (($suf_page_meta_position == 'left-outer-pullout' || $suf_page_meta_position == 'right-outer-pullout') && (is_page() || (!is_singular() && $post->post_type == 'page'))) {
		get_template_part('custom/pullout', suffusion_get_page_template());
	}
}

function suffusion_start_outer_pullout_div($id = 0, $display = 'blog', $index = 0) {
	if ($display != 'blog') {
		return;
	}
	global $post, $suf_page_meta_position;
	if ($id === 0) {
		$id = $post->ID;
	}

	if ((!is_singular() && $post->post_type != 'page') || (is_singular() && !is_page())) {
		$original_format = suffusion_get_post_format();
		if ($original_format == 'standard') {
			$format = '';
		}
		else {
			$format = $original_format . '_';
		}
		$meta_position = 'suf_post_' . $format . 'meta_position';
		global $$meta_position;
		$post_meta_position = apply_filters('suffusion_byline_position', $$meta_position);

		if ($post_meta_position == 'left-outer-pullout' || $post_meta_position == 'right-outer-pullout') {
			echo "<div class='outer-pullout-container container-$post_meta_position fix'>";
		}
	}

	if (($suf_page_meta_position == 'left-outer-pullout' || $suf_page_meta_position == 'right-outer-pullout') && (is_page() || (!is_singular() && $post->post_type == 'page'))) {
		echo "<div class='outer-pullout-container container-$suf_page_meta_position fix'>";
	}
}

function suffusion_close_outer_pullout_div($id = 0, $display = 'blog', $index = 0) {
	if ($display != 'blog') {
		return;
	}
	global $post, $suf_page_meta_position;
	if ($id === 0) {
		$id = $post->ID;
	}

	if ((!is_singular() && $post->post_type != 'page') || (is_singular() && !is_page())) {
		$original_format = suffusion_get_post_format();
		if ($original_format == 'standard') {
			$format = '';
		}
		else {
			$format = $original_format . '_';
		}
		$meta_position = 'suf_post_' . $format . 'meta_position';
		global $$meta_position;
		$post_meta_position = apply_filters('suffusion_byline_position', $$meta_position);

		if ($post_meta_position == 'left-outer-pullout' || $post_meta_position == 'right-outer-pullout') {
			echo "</div>";
		}
	}

	if (($suf_page_meta_position == 'left-outer-pullout' || $suf_page_meta_position == 'right-outer-pullout') && (is_page() || (!is_singular() && $post->post_type == 'page'))) {
		echo "</div>";
	}
}

/**
 * Creates a "Previous Page" / "Next Page" for photo-blog style displays
 *
 * @return void
 */
function suffusion_mosaic_pagination() {
	get_template_part('custom/pagination', 'mosaic');
}

/**
 * Builds a breadcrumb for different views in the site. Yoast Breadcrumbs and Breadcrumb Trail are supported. If not available, Suffusion's breadcrumbs will be used.
 *
 * @return void
 */
function suffusion_build_breadcrumb() {
	if (function_exists('yoast_breadcrumb_output')) {
		yoast_breadcrumb_output();
	}
	else if (function_exists('breadcrumb_trail')) {
		breadcrumb_trail();
	}
	else {
		if (!is_page()) {
			get_template_part('custom/breadcrumb');
		}
		else {
			get_template_part('custom/breadcrumb', 'page');
		}
	}
}

/**
 * Prints a span for a post format icon.
 * 
 * @return void
 */
function suffusion_print_post_format_icon() {
	echo "<span class='post-format-icon'>&nbsp;</span>";
}

function suffusion_print_line_byline_top() {
	suffusion_print_line_byline('line-top');
}

function suffusion_print_line_byline_bottom() {
	suffusion_print_line_byline('line-bottom');
}

function suffusion_print_line_byline($position) {
	global $post, $suf_page_meta_position;

	if ((!is_singular() && $post->post_type != 'page') || (is_singular() && !is_page())) {
		$original_format = suffusion_get_post_format();
		if ($original_format == 'standard') {
			$format = '';
		}
		else {
			$format = $original_format . '_';
		}
		$meta_position = 'suf_post_' . $format . 'meta_position';

		global $$meta_position;
		$post_meta_position = apply_filters('suffusion_byline_position', $$meta_position);

		if ($post_meta_position == $position) {
			get_template_part('custom/byline-line', $original_format);
		}
	}

	if ($suf_page_meta_position == $position && (is_page() || (!is_singular() && $post->post_type == 'page'))) {
		get_template_part('custom/byline-line-page', suffusion_get_page_template());
	}
}

/**
 * Prints an "updated" tag for Microformat support.
 *
 * @since 4.0.1
 */
function suffusion_print_post_updated_information() {
	echo "<span class='updated' title='".get_the_time('c')."'></span>";
}

/**
 * Prints the meta tag required for responsive layouts
 */
function suffusion_include_responsive_meta() {
	global $suf_enable_responsive;
	if (isset($suf_enable_responsive) && $suf_enable_responsive == 'on') {
		global $suf_responsive_prevent_user_scaling;
		if (isset($suf_responsive_prevent_user_scaling) && $suf_responsive_prevent_user_scaling == 'on') {
			$user_scalable = ', minimum-scale=1.0, maximum-scale=1.0, user-scalable=no';
		}
		else {
			$user_scalable = '';
		}
		//user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0
		echo '<meta name="viewport" content="width=device-width,initial-scale=1.0'.$user_scalable.'">'."\n";
	}
}