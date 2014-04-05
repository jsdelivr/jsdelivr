<?php
/**
 * Defines settings for different types of sidebars.
 * This file is included in functions.php
 *
 * @package Suffusion
 * @subpackage Functions
 */

global $suf_sidebar_header, $suf_header_for_widgets_below_header, $suf_header_for_widgets_above_footer, $suf_header_for_trbh;
global $suf_wa_sb1_style, $suf_wa_sb1b_style, $suf_wa_sb2_style, $suf_wa_sb2b_style, $suf_wa_wst_style, $suf_wa_wsb_style, $suf_wa_wabh_style, $suf_wa_waaf_style, $suf_wa_tbrh_style;

function suffusion_print_sidebar($index, $css_id, $name, $sidebar_style, $sidebar_alignment) {
	if ($sidebar_style == 'tabbed') {
		$css_class = "tabbed-sidebar tab-box-$sidebar_alignment $sidebar_alignment fix";
		$tabbed = true;
	}
	else {
		$css_class = "dbx-group $sidebar_alignment $sidebar_style";
		$tabbed = false;
	}
	if (!suffusion_is_sidebar_empty($index)) {
?>
		<!-- #<?php echo $css_id; ?> -->
		<div id="<?php echo $css_id; ?>" class="<?php echo $css_class; ?> warea">
<?php
		if ($tabbed) {
?>
		<ul  class="sidebar-tabs">
<?php
		}
		dynamic_sidebar($name);
		if ($tabbed) {
?>
		</ul>
<?php
		}
?>
		</div>
		<!-- /#<?php echo $css_id; ?> -->
<?php
	}
}

global $suf_widget_area_below_header_columns, $suf_widget_area_above_footer_columns, $suf_wa_tbrh_columns;
$sidebar_definitions = array(
	'sidebar-1' => array(
		'boxed' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="dbx-box suf-widget %2$s"><div class="dbx-content">',
			'after_widget' => '</div></aside><!--widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_sidebar_header) ? $suf_sidebar_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="suf-flat-widget %2$s">',
			'after_widget' => '</aside><!--widget end -->',
			'before_title' => "<h3>",
			'after_title' => "</h3>"),
		'tabbed' => array(
			'before_widget' => '<!--widget start --><li id="%1$s" class="sidebar-tab %2$s"><a class="sidebar-tab">',
			'after_widget' => '</div></li><!--widget end -->',
			'before_title' => '',
			'after_title' => '</a><div class="sidebar-tab-content">'),
	),
	'sidebar-2' => array(
		'boxed' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="dbx-box suf-widget %2$s"><div class="dbx-content">',
			'after_widget' => '</div></aside><!--widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_sidebar_header) ? $suf_sidebar_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="suf-flat-widget %2$s">',
			'after_widget' => '</aside><!--widget end -->',
			'before_title' => "<h3>",
			'after_title' => "</h3>"),
		'tabbed' => array(
			'before_widget' => '<!--widget start --><li id="%1$s" class="sidebar-tab %2$s"><a class="sidebar-tab">',
			'after_widget' => '</div></li><!--widget end -->',
			'before_title' => '',
			'after_title' => '</a><div class="sidebar-tab-content">'),
	),
	'right-header-widgets' => array(
		'default' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s">',
			"after_widget" => '</div><!-- widget end -->',
			"before_title" => ' ',
			"after_title" => ' '),
		'flattened' => array(
			'before_widget' => '',
			'after_widget' => '',
			'before_title' => '',
			'after_title' => '')),
	'left-header-widgets' => array(
		'default' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s">',
			"after_widget" => '</div><!-- widget end -->',
			"before_title" => ' ',
			"after_title" => ' '),
		'flattened' => array(
			'before_widget' => '',
			'after_widget' => '',
			'before_title' => '',
			'after_title' => '')),
	'widget-area-below-header' => array(
		'boxed' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-widget suf-horizontal-widget suf-widget-'.$suf_widget_area_below_header_columns.'c %2$s"><div class="dbx-content">',
			"after_widget" => '</div></aside><!-- widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_header_for_widgets_below_header) ? $suf_header_for_widgets_below_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-flat-widget suf-horizontal-widget suf-widget-'.$suf_widget_area_below_header_columns.'c %2$s">',
			"after_widget" => '</aside><!-- widget end -->',
			'before_title' => '<h3>',
			'after_title' => '</h3>')),
	'widget-area-above-footer' => array(
		'boxed' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-widget suf-horizontal-widget suf-widget-'.$suf_widget_area_above_footer_columns.'c %2$s "><div class="dbx-content">',
			"after_widget" => '</div></aside><!-- widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_header_for_widgets_above_footer) ? $suf_header_for_widgets_above_footer : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-flat-widget suf-horizontal-widget suf-widget-'.$suf_widget_area_above_footer_columns.'c %2$s">',
			"after_widget" => '</aside><!-- widget end -->',
			'before_title' => '<h3>',
			'after_title' => '</h3>')),
	'widget-area-above-content' => array(
		'boxed' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="suf-widget %2$s"><div class="dbx-content">',
			"after_widget" => '</div></div><!-- widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_header_for_widgets_below_header) ? $suf_header_for_widgets_below_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="suf-flat-widget suf-horizontal-widget %2$s">',
			"after_widget" => '</div><!-- widget end -->',
			'before_title' => '<h3>',
			'after_title' => '</h3>')),
	'widget-area-below-content' => array(
		'boxed' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="suf-widget %2$s "><div class="dbx-content">',
			"after_widget" => '</div></div><!-- widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_header_for_widgets_above_footer) ? $suf_header_for_widgets_above_footer : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="suf-flat-widget suf-horizontal-widget %2$s">',
			"after_widget" => '</div><!-- widget end -->',
			'before_title' => '<h3>',
			'after_title' => '</h3>')),
	'top-bar-left-widgets' => array(
		'default' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s">',
			"after_widget" => '</div><!-- widget end -->',
			"before_title" => ' ',
			"after_title" => ' '),
	),
	'top-bar-right-widgets' => array(
		'tiny' => array(
			"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s">',
			"after_widget" => '</div><!-- widget end -->',
			"before_title" => ' ',
			"after_title" => ' '),
		'sliding-panel' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-panel-widget suf-widget-'.$suf_wa_tbrh_columns.'c %2$s">',
			"after_widget" => '</aside><!-- widget end -->',
			"before_title" => '<h3>',
			"after_title" => '</h3>'),
		'spanel-boxed' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-widget suf-widget-'.$suf_wa_tbrh_columns.'c %2$s"><div class="dbx-content">',
			"after_widget" => '</div></aside><!-- widget end -->',
			"before_title" => '<h3 class="dbx-handle '.(isset($suf_header_for_trbh) ? $suf_header_for_trbh : '').'">',
			"after_title" => '</h3>'),
		'spanel-flat' => array(
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="suf-flat-widget suf-widget-'.$suf_wa_tbrh_columns.'c %2$s">',
			"after_widget" => '</aside><!-- widget end -->',
			"before_title" => '<h3>',
			"after_title" => '</h3>'),
	),
	'wsidebar-top' => array(
		'boxed' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="dbx-box suf-widget %2$s"><div class="dbx-content">',
			'after_widget' => '</div></aside><!--widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_sidebar_header) ? $suf_sidebar_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="suf-flat-widget %2$s">',
			'after_widget' => '</aside><!--widget end -->',
			'before_title' => "<h3>",
			'after_title' => "</h3>"),
		'tabbed' => array(
			'before_widget' => '<!--widget start --><li id="%1$s" class="sidebar-tab %2$s"><a class="sidebar-tab">',
			'after_widget' => '</div></li><!--widget end -->',
			'before_title' => '',
			'after_title' => '</a><div class="sidebar-tab-content">'),
	),
	'wsidebar-bottom' => array(
		'boxed' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="dbx-box suf-widget %2$s"><div class="dbx-content">',
			'after_widget' => '</div></aside><!--widget end -->',
			'before_title' => '<h3 class="dbx-handle '.(isset($suf_sidebar_header) ? $suf_sidebar_header : '').'">',
			'after_title' => '</h3>'),
		'flattened' => array(
			'before_widget' => '<!--widget start --><aside id="%1$s" class="suf-flat-widget %2$s">',
			'after_widget' => '</aside><!--widget end -->',
			'before_title' => "<h3>",
			'after_title' => "</h3>"),
		'tabbed' => array(
			'before_widget' => '<!--widget start --><li id="%1$s" class="sidebar-tab %2$s"><a class="sidebar-tab">',
			'after_widget' => '</div></li><!--widget end -->',
			'before_title' => '',
			'after_title' => '</a><div class="sidebar-tab-content">'),
	),
);

$sidebar_style = 'default';
if (isset($suf_wa_sb1_style) && isset($sidebar_definitions['sidebar-1'][$suf_wa_sb1_style])) {
	$sb_style = $suf_wa_sb1_style;
}
else {
	$sb_style = 'boxed';
}

register_sidebar(array(
	'name' => 'Sidebar 1',
	'id' => 'sidebar-1',
	"description" => "This is the default sidebar. If only one sidebar is selected in the theme options, this is the one displayed.
                    It can be placed on the left or right side. In case two sidebars are selected and both are on the same side, this is the outer sidebar.
                    If you are seeing no widgets here and your site is still showing widgets, go to Appearance &rarr; Suffusion Options &rarr; Sidebars &rarr; Sidebar 1 &rarr; Default widgets for first sidebar, and hide the widgets from there.",
	'before_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-1'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-1'][$sb_style]['after_title'],
));

if (isset($suf_wa_sb1b_style) && isset($sidebar_definitions['sidebar-1'][$suf_wa_sb1b_style])) {
	$sb_style = $suf_wa_sb1b_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array(
	'name' => 'Sidebar 1 (Bottom)',
	'id' => 'sidebar-9',
	"description" => "This sits below Sidebar 1 and is positioned on the same side as Sidebar 1",
	'before_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-1'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-1'][$sb_style]['after_title'],
));

if (isset($suf_wa_sb2_style) && isset($sidebar_definitions['sidebar-2'][$suf_wa_sb2_style])) {
	$sb_style = $suf_wa_sb2_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array(
	'name' => 'Sidebar 2',
	'id' => 'sidebar-2',
	"description" => "This is the second sidebar. If only one sidebar is selected in the theme options, this is ignored.
                    It can be placed on the left or right side. In case two sidebars are selected and both are on the same side, this is the inner sidebar.",
	'before_widget' => $sidebar_definitions['sidebar-2'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-2'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-2'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-2'][$sb_style]['after_title'],
));

if (isset($suf_wa_sb2b_style) && isset($sidebar_definitions['sidebar-2'][$suf_wa_sb2b_style])) {
	$sb_style = $suf_wa_sb2b_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array(
	'name' => 'Sidebar 2 (Bottom)',
	'id' => 'sidebar-10',
	"description" => "This sits below Sidebar 2 and is positioned on the same side as Sidebar 2",
	'before_widget' => $sidebar_definitions['sidebar-2'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-2'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-2'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-2'][$sb_style]['after_title'],
));

if (isset($suf_wa_wst_style) && isset($sidebar_definitions['sidebar-1'][$suf_wa_wst_style])) {
	$sb_style = $suf_wa_wst_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array(
	'name' => 'Wide Sidebar (Top)',
	'id' => 'sidebar-18',
	"description" => "This is a wide sidebar displayed if both your first and second sidebars are on the same side.
		    This is displayed above the two sidebars and is as wide as both of them combined.",
	'before_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-1'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-1'][$sb_style]['after_title'],
));

if (isset($suf_wa_wsb_style) && isset($sidebar_definitions['sidebar-1'][$suf_wa_wsb_style])) {
	$sb_style = $suf_wa_wsb_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array(
	'name' => 'Wide Sidebar (Bottom)',
	'id' => 'sidebar-19',
	"description" => "This is a wide sidebar displayed if both your first and second sidebars are on the same side.
		    This is displayed below the two sidebars and is as wide as both of them combined.",
	'before_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['sidebar-1'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['sidebar-1'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['sidebar-1'][$sb_style]['after_title'],
));

global $suf_wah_columns, $suf_wih_columns;
register_sidebar(array(
	"name" => "Widgets Above Header",
	'id' => 'sidebar-11',
	"description" => "This appears at the top, below your Top Navigation Bar, but above the header. This is ideal for advertisements.",
	"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s suf-widget suf-widget-'.$suf_wah_columns.'c">',
	"after_widget" => '</div><!-- widget end -->',
	"before_title" => '<h3>',
	"after_title" => '</h3>'
));

register_sidebar(array(
	"name" => "Header Widgets",
	'id' => 'sidebar-12',
	"description" => "This appears in the header container and is ideal for small ads or prominent links like subscription links.",
	"before_widget" => '<!-- widget start --><div id="%1$s" class="%2$s suf-widget suf-widget-'.$suf_wih_columns.'c">',
	"after_widget" => '</div><!-- widget end -->',
	"before_title" => '<h3>',
	"after_title" => '</h3>'
));

register_sidebar(array (
	"name" => "Right Header Widgets",
	'id' => 'sidebar-3',
	"description" => "Widget area to the right of the navigation bar. This is a tiny widget area, so please don't try to put in large widgets here!",
	'before_widget' => $sidebar_definitions['right-header-widgets'][$sidebar_style]['before_widget'],
	'after_widget' => $sidebar_definitions['right-header-widgets'][$sidebar_style]['after_widget'],
	'before_title' => $sidebar_definitions['right-header-widgets'][$sidebar_style]['before_title'],
	'after_title' => $sidebar_definitions['right-header-widgets'][$sidebar_style]['after_title'],
));

if (isset($suf_wa_wabh_style) && isset($sidebar_definitions['widget-area-below-header'][$suf_wa_wabh_style])) {
	$sb_style = $suf_wa_wabh_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array (
	"name" => "Widget Area Below Header",
	'id' => 'sidebar-4',
	"description" => "This appears above the content, just below the header and navigation bar. It is as wide as the page.",
	'before_widget' => $sidebar_definitions['widget-area-below-header'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['widget-area-below-header'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['widget-area-below-header'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['widget-area-below-header'][$sb_style]['after_title'],
));

if (isset($suf_wa_waaf_style) && isset($sidebar_definitions['widget-area-above-footer'][$suf_wa_waaf_style])) {
	$sb_style = $suf_wa_waaf_style;
}
else {
	$sb_style = 'boxed';
}
register_sidebar(array (
	"name" => "Widget Area Above Footer",
	'id' => 'sidebar-5',
	"description" => "This appears below the content, just above the footer. It is as wide as the page.",
	'before_widget' => $sidebar_definitions['widget-area-above-footer'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['widget-area-above-footer'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['widget-area-above-footer'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['widget-area-above-footer'][$sb_style]['after_title'],
));

register_sidebar(array (
	"name" => "Top Bar Left Widgets",
	'id' => 'sidebar-6',
	"description" => "This appears on the left side of the top navigation bar. This is tiny in height, so don't put large widgets here.",
	'before_widget' => $sidebar_definitions['top-bar-left-widgets'][$sidebar_style]['before_widget'],
	'after_widget' => $sidebar_definitions['top-bar-left-widgets'][$sidebar_style]['after_widget'],
	'before_title' => $sidebar_definitions['top-bar-left-widgets'][$sidebar_style]['before_title'],
	'after_title' => $sidebar_definitions['top-bar-left-widgets'][$sidebar_style]['after_title'],
));

if (isset($suf_wa_tbrh_style) && isset($sidebar_definitions['top-bar-right-widgets'][$suf_wa_tbrh_style])) {
	$sb_style = $suf_wa_tbrh_style;
}
else {
	$sb_style = 'tiny';
}
register_sidebar(array (
	"name" => "Top Bar Right Widgets",
	'id' => 'sidebar-7',
	"description" => "This appears on the right side of the top navigation bar. This is tiny in height, so don't put large widgets here.",
	'before_widget' => $sidebar_definitions['top-bar-right-widgets'][$sb_style]['before_widget'],
	'after_widget' => $sidebar_definitions['top-bar-right-widgets'][$sb_style]['after_widget'],
	'before_title' => $sidebar_definitions['top-bar-right-widgets'][$sb_style]['before_title'],
	'after_title' => $sidebar_definitions['top-bar-right-widgets'][$sb_style]['after_title'],
));
register_sidebar(array (
	"name" => "Left Header Widgets",
	'id' => 'sidebar-8',
	"description" => "This appears on the left side of the main navigation bar. This is tiny in height, so don't put large widgets here.",
	'before_widget' => $sidebar_definitions['left-header-widgets'][$sidebar_style]['before_widget'],
	'after_widget' => $sidebar_definitions['left-header-widgets'][$sidebar_style]['after_widget'],
	'before_title' => $sidebar_definitions['left-header-widgets'][$sidebar_style]['before_title'],
	'after_title' => $sidebar_definitions['left-header-widgets'][$sidebar_style]['after_title'],
));

if (!class_exists('Suffusion_Shortcodes')) {
	$adhoc_count = apply_filters('suffusion_adhoc_count', 5);
	for ($i = 1; $i <= $adhoc_count; $i++) {
		$adhoc_columns = "suf_adhoc{$i}_columns";
		global $$adhoc_columns;
		register_sidebar(array(
			"name" => "Ad Hoc Widgets $i",
			'id' => 'sidebar-'.(12 + $i),
			"description" => "This is an ad-hoc widget area that can be invoked with the short code [suffusion-widgets id='$i'].",
			"before_widget" => '<!-- widget start --><aside id="%1$s" class="%2$s suf-widget suf-widget-'.$$adhoc_columns.'c">',
			"after_widget" => '</aside><!-- widget end -->',
			"before_title" => '<h3>',
			"after_title" => '</h3>'
		));
	}
}

for ($i = 1; $i <= 5; $i++) {
	register_sidebar(
		array(
			'name' => 'Custom Layout Widget Area '.$i,
			'id' => 'sidebar-cl-'.$i,
			'description' => "The contents of this widget area displayed if you use a custom layout template. Use a plugin such as Widget Logic to control what widget shows up in which page.",
			'before_widget' => "\n".'<!-- widget start --><section id="%1$s" class="%2$s cl-widget"><div class="cl-content">',
			"after_widget" => '</div></section><!-- widget end -->',
			"before_title" => '<h3>',
			"after_title" => '</h3>'
		)
	);
}

if (current_theme_supports('mega-menus')) {
	global $suffusion_mm_sidebar_count;
	for ($i = 1; $i <= $suffusion_mm_sidebar_count; $i++) {
		register_sidebar(
			array(
				'name' => 'Mega Menu Widget Area '.$i,
				'id' => 'sidebar-mm-'.$i,
				'description' => "The contents of this widget area are included as a mega-menu if this widget area is selected for a tab under Appearance &rarr; Menus",
				'before_widget' => '<!-- widget start --><div id="%1$s" class="%2$s mm-widget"><div class="mm-content">',
				"after_widget" => '</div></div><!-- widget end -->',
				"before_title" => '<h3>',
				"after_title" => '</h3>'
			)
		);
	}
}
?>