<?php
class Suffusion_CSS_Generator {
	var $creation_date;
	var $helper; 
	function __construct($date = null) {
		if (is_null($date)) {
			$this->creation_date = date(get_option('date_format'));
		}
		else {
			$this->creation_date = $date;
		}
		$this->helper = new Suffusion_CSS_Helper();
	}

	function get_creation_date() {
		return $this->creation_date;
	}

	function get_bg_information($option) {
		return $this->helper->get_bg_information($option);
	}

	function get_font_information($option) {
		return $this->helper->get_font_information($option);
	}

	function get_border_information($option) {
		return $this->helper->get_border_information($option);
	}

	function strip_color_hash($color) {
		if (substr($color, 0, 1) == '#') {
			$temp_color = substr($color, 1, strlen($color) - 1);
		}
		else {
			$temp_color = $color;
		}
		return $temp_color;
	}

	function get_automatic_widths($cust_wrapper_width, $sidebar_count, $prefix) {
		return $this->helper->get_automatic_widths($cust_wrapper_width, $sidebar_count, $prefix);
	}

	function get_widths_from_components($component_widths, $sidebar_count, $prefix) {
		return $this->helper->get_widths_from_components($component_widths, $sidebar_count, $prefix);
	}

	function get_fluid_widths($component_widths, $sidebar_count, $prefix) {
		return $this->helper->get_fluid_widths($component_widths, $sidebar_count, $prefix);
	}

	function get_widths_for_template($prefix, $sb_count, $template = null) {
		return $this->helper->get_widths_for_template($prefix, $sb_count, $template);
	}

	function set_widths_for_no_sidebars($widths) {
		return $this->helper->set_widths_for_no_sidebars($widths);
	}

	function set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width) {
		return $this->helper->set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width);
	}

	function set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width) {
		return $this->helper->set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width);
	}

	function set_widths_for_single_left_single_right_sidebar_layout($widths, $lwidth, $rwidth, $left, $right) {
		return $this->helper->set_widths_for_single_left_single_right_sidebar_layout($widths, $lwidth, $rwidth, $left, $right);
	}

	function get_wrapper_width_css($widths, $main_element, $control_element = "") {
		$wrapper_width = suffusion_admin_check_integer($widths['wrapper']) ? $widths['wrapper'].'px' : $widths['wrapper'];
		$ret = "
$main_element { width: $wrapper_width;";
		if (isset($widths['wrapper-max'])) {
			$ret .= " max-width: {$widths['wrapper-max']}px; min-width: {$widths['wrapper-min']}px;";
		}
		else {
			$ret .= " max-width: $wrapper_width; min-width: $wrapper_width;";
		}
		$ret .= " }\n";
		if (trim($control_element) != "") {
			$ret .=
"$control_element { width: ".(suffusion_admin_check_integer($widths['wrapper']) ? $widths['wrapper'].'px' : '100%')." }";
		}
		return $ret;
	}

	function get_template_specific_container_classes($template_class, $widths) {
		$ret = "";
		$ret .= $this->get_wrapper_width_css($widths, "$template_class #wrapper");
		$ret .= "
$template_class #container {";
		if (isset($widths['cleft'])) {
			$ret .= " padding-left: {$widths['cleft']}px; padding-right: {$widths['cright']}px;";
		} else {
			$ret .= " padding-left: 0; padding-right: 0;";
		}
		$ret .= " }
$template_class #main-col {	width: ".(suffusion_admin_check_integer($widths['main-col']) ? $widths['main-col'].'px' : $widths['main-col'])."; }
#ie6 $template_class #main-col { width: ".(suffusion_admin_check_integer($widths['main-col']) ? ($widths['main-col'] - 30).'px' : $widths['main-col'])." }";
		return $ret;
	}

	function get_template_specific_header_footer_nav_classes($template_class, $widths) {
		global $suf_navt_bar_style, $suf_wah_layout_style, $suf_header_layout_style, $suf_footer_layout_style, $suf_nav_bar_style;
		$ret = "";
		// Top Navigation Bar
		if ($suf_navt_bar_style == 'full-align') {
			$ret .= $this->get_wrapper_width_css($widths, "$template_class #nav-top .col-control, $template_class #top-bar-right-spanel .col-control");
		}
		else if ($suf_navt_bar_style == 'align') {
			$ret .= $this->get_wrapper_width_css($widths, "$template_class #nav-top, $template_class #top-bar-right-spanel", "$template_class #nav-top .col-control, $template_class #top-bar-right-spanel .col-control");
		}

		// Widgets above header
		if ($suf_wah_layout_style == 'full-align') {
			$ret .= $this->get_wrapper_width_css($widths, "$template_class #widgets-above-header .col-control");
		}
		else if ($suf_wah_layout_style == 'align') {
			$ret .= $this->get_wrapper_width_css($widths, "$template_class #widgets-above-header", "$template_class  #widgets-above-header .col-control");
		}

		// Header and Main Navigation Bar
		if ($suf_header_layout_style != 'in-align') {
			// Header
			if ($suf_header_layout_style == 'out-cfull-halign') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #header-container .col-control");
			}
			else if ($suf_header_layout_style == 'out-hcalign') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #header-container", "$template_class #header-container .col-control");
			}

			// Main Navigation Bar
			if ($suf_nav_bar_style == 'full-align') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #nav .col-control");
			}
			else if ($suf_nav_bar_style == 'align') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #nav", "$template_class #nav .col-control");
			}
		}
		else {
			$ret .= "$template_class #nav .col-control { width: ".(suffusion_admin_check_integer($widths['wrapper']) ? $widths['wrapper'].'px' : '100%')." }\n";
		}

		//Footer
		if ($suf_footer_layout_style != 'in-align') {
			if ($suf_footer_layout_style == 'out-cfull-halign') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #page-footer .col-control");
			}
			else if ($suf_footer_layout_style == 'out-hcalign') {
				$ret .= $this->get_wrapper_width_css($widths, "$template_class #page-footer");
			}
		}

		return $ret;
	}

	function get_template_specific_other_elements($template_class, $widths) {
		$ret = "
$template_class .postdata .category {
	max-width: ".(suffusion_admin_check_integer($widths['category']) ? $widths['category'].'px' : $widths['category']).";
}
$template_class .tags {
	max-width: ".(suffusion_admin_check_integer($widths['tags']) ? $widths['tags'].'px' : $widths['tags']).";
}
$template_class #sidebar, $template_class #sidebar-b, $template_class #sidebar-shell-1 {
	width: ".$widths['sidebar-1']."px;
}";
		if ($widths['sidebar-1'] > 0) {
			$ret .= "
$template_class #sidebar.flattened, $template_class #sidebar-b.flattened {
	width: ".($widths['sidebar-1'] - 2)."px;
}";
		}
		$ret .= "
$template_class #sidebar-shell-1 {
	margin-left: ".(suffusion_admin_check_integer($widths['s1-lmargin']) ? $widths['s1-lmargin'].'px' : $widths['s1-lmargin']).";
	margin-right: ".(suffusion_admin_check_integer($widths['s1-rmargin']) ? $widths['s1-rmargin'].'px' : $widths['s1-rmargin']).";
	left: ".(suffusion_admin_check_integer($widths['s1-l']) ? $widths['s1-l'].'px' : $widths['s1-l']).";
	right: ".(suffusion_admin_check_integer($widths['s1-r']) ? $widths['s1-r'].'px' : $widths['s1-r']).";
}";
		if ($widths['sidebar-2'] > 0) {
			$ret .= "
$template_class #sidebar-2, $template_class #sidebar-2-b, $template_class #sidebar-shell-2 {
	width: ".$widths['sidebar-2']."px;
	}
$template_class #sidebar-2.flattened, $template_class #sidebar-2-b.flattened {
	width: ".($widths['sidebar-2'] - 2)."px;
}
$template_class #sidebar-shell-2 {
	margin-left: ".(suffusion_admin_check_integer($widths['s2-lmargin']) ? $widths['s2-lmargin'].'px' : $widths['s2-lmargin']).";
	margin-right: ".(suffusion_admin_check_integer($widths['s2-rmargin']) ? $widths['s2-rmargin'].'px' : $widths['s2-rmargin']).";
	left: ".(suffusion_admin_check_integer($widths['s2-l']) ? $widths['s2-l'].'px' : $widths['s2-l']).";
	right: ".(suffusion_admin_check_integer($widths['s2-r']) ? $widths['s2-r'].'px' : $widths['s2-r']).";
}
";
		}
		$ret .= "
$template_class #sidebar-container { width: ".$widths['sidebar-container']."px; }
$template_class .sidebar-container-left { right: ".$widths['sidebar-container']."px; }
$template_class .sidebar-container-right { margin-right: -".$widths['sidebar-container']."px; }
$template_class .sidebar-container-left #sidebar-wrap { right: auto; }
$template_class #wsidebar-top, $template_class #wsidebar-bottom { width: ".$widths['wsidebar']."px; }
$template_class #sidebar-wrap {
	width: ".($widths['wsidebar'] + 17)."px;";
		if (isset($widths['sw-l'])) { $ret .= "
	left: ".(suffusion_admin_check_integer($widths['sw-l']) ? $widths['sw-l'].'px' : $widths['sw-l']).";
	right: ".(suffusion_admin_check_integer($widths['sw-r']) ? $widths['sw-r'].'px' : $widths['sw-r']).";";
		} else { $ret .= "
	left: auto;
	right: auto;";
		}
		$ret .= "
}
#ie6 $template_class #sidebar-wrap {";
		if (isset($widths['sw-l-ie6'])) { $ret .= "
	left: ".(suffusion_admin_check_integer($widths['sw-l-ie6']) ? $widths['sw-l-ie6'].'px' : $widths['sw-l-ie6']).";
	right: ".(suffusion_admin_check_integer($widths['sw-r-ie6']) ? $widths['sw-r-ie6'].'px' : $widths['sw-r-ie6']).";";
		} else { $ret .= "
	left: auto;
	right: auto;";
		}
		$ret .= "
}
$template_class .sidebar-wrap-left {
	margin-left: -100%;
}
$template_class .sidebar-wrap-right {
	margin-right: -".($widths['wsidebar'] + 17)."px;
}";
		if ($widths['sidebar-1'] > 0) {
			$ret .= "
#ie6 $template_class #sidebar, #ie6 $template_class #sidebar-b, #ie6 $template_class #sidebar-shell-1 {
	width: ".($widths['sidebar-1'] - 8)."px;
}";
		}
		$ret .= "
#ie6 $template_class #sidebar-shell-1 {";
		if (isset($widths['s1-l-ie6'])) { $ret .= "
	left: ".$widths['s1-l-ie6']."px;";
		}
		if (isset($widths['s1-r-ie6'])) { $ret .= "
	right: ".$widths['s1-r-ie6']."px;";
		}
		$ret .= "
}";
		if ($widths['sidebar-2'] > 0) {
			$ret .= "
#ie6 $template_class #sidebar-2, #ie6 $template_class #sidebar-2-b, #ie6 $template_class #sidebar-shell-2 {
	width: ".($widths['sidebar-2'] - 8)."px;
}
#ie6 $template_class #sidebar-shell-2 {";
		if (isset($widths['s2-l-ie6'])) { $ret .= "
	left: ".($widths['s2-l-ie6'])."px;";
		}
		if (isset($widths['s2-r-ie6'])) { $ret .= "
	right: ".($widths['s2-r-ie6'])."px;";
		}
		$ret .= "
}
";
		}
		if ($widths['sidebar-container'] > 0) {
			$ret .= "
#ie6 $template_class #sidebar-container {
	width: ".($widths['sidebar-container'] - 10)."px;
}
";
		}
		$ret .= "
$template_class .tab-box {
	width: ".$widths['tabbed']."px;
}";
		return $ret;
	}

	function get_template_specific_classes($template_class, $widths) {
		$ret = $this->get_template_specific_container_classes($template_class, $widths);
		$ret .= $this->get_template_specific_header_footer_nav_classes($template_class, $widths);
		$ret .= $this->get_template_specific_other_elements($template_class, $widths);
		return $ret;
	}

	function get_navigation_bar_custom_css($bar) {
		if ($bar == 'nav') { $opt = 'nav'; } else { $opt = 'navt'; }
		$def_cust = "suf_{$opt}_skin_def_cust";
		$nav_effect = "suf_{$opt}_effect";
		$nav_delay = "suf_{$opt}_delay";
		global $$def_cust, $$nav_effect, $$nav_delay;
		$ret = "";
		$nav = '#'.$bar;
		if ($$def_cust == 'custom') {
			$ret .= "
$nav, $nav.continuous {
	".$this->get_bg_information("suf_{$opt}_skin_settings_bg").";
	".$this->get_font_information("suf_{$opt}_skin_settings_bg_font").";
	".$this->get_border_information("suf_{$opt}_skin_settings_bg_border")."
}
$nav ul li, $nav.continuous ul li,
$nav ul ul li, $nav.continuous ul ul li,
$nav ul li a, $nav.continuous ul li a,
$nav a.current li a, $nav.continuous a.current li a {
	".$this->get_bg_information("suf_{$opt}_skin_settings").";
	".$this->get_font_information("suf_{$opt}_skin_settings_font").";
	".$this->get_border_information("suf_{$opt}_skin_settings_border").";
}
$nav ul li a:visited, $nav.continuous ul li a:visited,
$nav a.current li a:visited, $nav.continuous a.current li a:visited {
	".$this->get_bg_information("suf_{$opt}_skin_settings_visited").";
	".$this->get_font_information("suf_{$opt}_skin_settings_visited_font").";
	".$this->get_border_information("suf_{$opt}_skin_settings_visited_border").";
}
$nav ul li a:active, $nav.continuous ul li a:active,
$nav ul li a.current, $nav.continuous ul li a.current,
$nav ul li a.current:visited, $nav.continuous ul li a.current:visited {
	".$this->get_bg_information("suf_{$opt}_skin_settings_hl").";
	".$this->get_font_information("suf_{$opt}_skin_settings_hl_font").";
	".$this->get_border_information("suf_{$opt}_skin_settings_hl_border").";
}
$nav ul li a:hover, $nav.continuous ul li a:hover,
$nav ul li a.current:hover, $nav.continuous ul li a.current:hover,
$nav a.current li a:hover, $nav.continuous a.current li a:hover {
	".$this->get_bg_information("suf_{$opt}_skin_settings_hover").";
	".$this->get_font_information("suf_{$opt}_skin_settings_hover_font").";
	".$this->get_border_information("suf_{$opt}_skin_settings_hover_border").";
}
";
		}
		if ($$nav_effect == 'fade') {
			$ret .= "
$nav .mm-warea {
	transition: opacity ".$$nav_delay."ms linear;
	-moz-transition: opacity ".$$nav_delay."ms linear;
	-webkit-transition: opacity ".$$nav_delay."ms linear;
	-khtml-transition: opacity ".$$nav_delay."ms linear;
}
";
		}
		return $ret;
	}

	function get_custom_layout_template_css() {
		$ret = '';
		for ($i = 1; $i <= 5; $i++) {
			$def_cust = "suf_clt_wa{$i}_skin_setting";
			global $$def_cust;
			if (isset($$def_cust) && $$def_cust == 'on') {
				$ret .= "
#cl-warea-id-$i .cl-widget {
	".$this->get_bg_information("suf_clt_wa{$i}_skin_settings_bg").";
	".$this->get_border_information("suf_clt_wa{$i}_skin_settings_bg_border").";
}
";
			}
		}
		global $suf_clt_title_font_setting;
		if (isset($suf_clt_title_font_setting) && 'on' == $suf_clt_title_font_setting) {
			$ret .= "
.cl-title {
	".$this->get_font_information('suf_clt_title_font').";
}";
		}
		return $ret;
	}

	function get_custom_body_settings() {
		global $suf_body_style_setting, $suf_body_background_color, $suf_body_background_image, $suf_body_background_repeat, $suf_body_background_attachment, $suf_body_background_position;
		if (!get_background_image() && !get_background_color() && $suf_body_style_setting == 'custom') {
			$ret = "
body {
	background-color: #".$this->strip_color_hash($suf_body_background_color).";";
			if ($suf_body_background_image != "") {
				$body_bg_url = " url($suf_body_background_image) ";
				$ret .= "
	background-image: $body_bg_url;
	background-repeat: $suf_body_background_repeat;
	background-attachment: $suf_body_background_attachment;
	background-position: $suf_body_background_position;";
			}
			$ret .= "
}";
			return $ret;
		}
		return "";
	}

	function get_zero_sidebars_template_widths($template_class = ".page-template-no-sidebars-php") {
		$ret = "
$template_class #container { padding-left: 0; padding-right: 0; }
$template_class #main-col {	width: 100%; }";
		return $ret;
	}

	function get_nr_css($widths) {
		global $suf_nr_main_cover_w, $suf_nr_main_cover_h, $suf_nr_books_per_row;
		$slot_width = floor(100/$suf_nr_books_per_row);
		$ret = "
div.booklisting img, div.bookentry img { width: ".suffusion_admin_get_size_from_field($suf_nr_main_cover_w, "108px")."; height: ".suffusion_admin_get_size_from_field($suf_nr_main_cover_h, "160px")."; }
div.bookentry .stats { width: ".(suffusion_get_numeric_size_from_field($suf_nr_main_cover_w, 108) + 34)."px; }
div.bookentry .review { width: ".($widths['main-col'] - suffusion_get_numeric_size_from_field($suf_nr_main_cover_w, 108) - 80)."px; }
#ie6 div.bookentry .review { width: ".($widths['main-col'] - suffusion_get_numeric_size_from_field($suf_nr_main_cover_w, 108) - 100)."px; }
col.nr-shelf-slot { width: $slot_width%; }";
		return $ret;
	}

	function get_finalized_header_footer_nav_css() {
		global $suf_navt_bar_style, $suf_wah_layout_style, $suf_footer_layout_style, $suf_header_layout_style, $suf_nav_bar_style;
		global $suf_nav_text_transform, $suf_navt_text_transform, $suf_navt_dd_pos;
		$ret = "";
		if ($suf_navt_bar_style == 'full-full') {
			$ret .= "
#nav-top .col-control, #top-bar-right-spanel .col-control { width: auto; }
#nav-top {
	border-radius: 0;
}";
		}
		else if ($suf_navt_bar_style == 'full-align') {
			$ret .= "
#nav-top, #top-bar-right-spanel { width: auto; }
#nav-top {
	border-radius: 0;
}";
		}
		else if ($suf_navt_bar_style == 'align') {
			$ret .= "
#nav-top, #top-bar-right-spanel { margin: 0 auto; }";
		}

		$ret .= "
#nav ul { text-transform: $suf_nav_text_transform; }
#nav-top ul { text-transform: $suf_navt_text_transform; float: ".($suf_navt_dd_pos == 'center' ? 'none' : $suf_navt_dd_pos)."; }";

		if ($suf_wah_layout_style == 'full-full') {
			$ret .= "
#widgets-above-header .col-control { width: auto; }";
		}
		else if ($suf_wah_layout_style == 'full-align') {
			$ret .= "
#widgets-above-header { width: auto; }";
		}
		else if ($suf_wah_layout_style == 'align') {
			$ret .= "
#widgets-above-header { margin: 0 auto; }";
		}

		if ($suf_footer_layout_style != 'in-align') {
			if ($suf_footer_layout_style == 'out-hcfull') {
				$ret .= "
#page-footer .col-control { width: auto; }";
			}
			else if ($suf_footer_layout_style == 'out-cfull-halign') {
				$ret .= "
#page-footer { width: auto; }";
			}
			else if ($suf_footer_layout_style == 'out-hcalign') {
				$ret .= "
#page-footer { margin: 0 auto; padding: 0 10px; }";
			}
		}

		if ($suf_header_layout_style != 'in-align') {
			if ($suf_header_layout_style == 'out-hcfull') {
				$ret .= "
#header-container .col-control { width: auto; }";
			}
			else if ($suf_header_layout_style == 'out-cfull-halign') {
				$ret .= "
#header-container { width: auto; }";
			}
			else if ($suf_header_layout_style == 'out-hcalign') {
				$ret .= "
#header-container { margin: 0 auto; padding: 0 10px; }";
			}
			if ($suf_nav_bar_style == 'full-full') {
				$ret .= "
#nav .col-control { width: auto; }";
			}
			else if ($suf_nav_bar_style == 'full-align') {
				$ret .= "
#nav { width: auto; }";
			}
			else if ($suf_nav_bar_style == 'align') {
				$ret .= "
#nav { margin: 0 auto; }";
			}
		}
		else {
			$ret .= "
#nav { margin: 0 auto; width: 100%; ";
			if (is_rtl()) {
				$ret .= " float: right; ";
			}
			$ret .= "}";
		}
		return $ret;
	}

	function get_mag_template_widths($widths) {
		global $suf_mag_headlines_height, $suf_mag_excerpts_per_row, $suf_mag_excerpts_image_box_height, $suf_mag_catblocks_per_row, $suf_mag_catblocks_image_box_height;
		global $suf_mag_headline_main_title_alignment;
		$mag_excerpt_td_width = floor(100/(int)$suf_mag_excerpts_per_row);
		if (suffusion_admin_check_integer($widths['main-col'])) {
			$mag_category_td_img_width = floor($widths['main-col']/(int)$suf_mag_catblocks_per_row) - 20;
			$mag_category_td_img_width_ie = floor($widths['main-col']/(int)$suf_mag_catblocks_per_row) - 20 - (int)$suf_mag_catblocks_per_row;
		}
		else {
			$mag_category_td_img_width = '98%';
			$mag_category_td_img_width_ie = '95%';
		}
		$mag_category_td_width = floor(100/(int)$suf_mag_catblocks_per_row);
		$ret = "
.suf-mag-headlines {";
		$ret .= "
	padding-left: ".(suffusion_admin_check_integer($widths['mag-headline-photos']) ? ($widths['mag-headline-photos']).'px' : $widths['mag-headline-photos']).";
}";
		$ret .= "
.suf-mag-headline-photo-box { width: {$widths['mag-headline-photos']}px; right: {$widths['mag-headline-photos']}px; }
.suf-mag-headline-block { width: ".(suffusion_admin_check_integer($widths['mag-headline-block']) ? $widths['mag-headline-block'].'px' : $widths['mag-headline-block'])."; }
#ie6 .suf-mag-headline-block { width: ".(suffusion_admin_check_integer($widths['mag-headline-block']) ? ($widths['mag-headline-block'] - 20).'px' : $widths['mag-headline-block'])."; }
.suf-mag-headlines { min-height: ".suffusion_admin_get_size_from_field($suf_mag_headlines_height, "250px")."; height: auto; }
.suf-mag-excerpt-image {
	height: ".suffusion_admin_get_size_from_field($suf_mag_excerpts_image_box_height, "100px").";
}
.suf-mag-category-image {
	width: ".(suffusion_admin_check_integer($mag_category_td_img_width) ? $mag_category_td_img_width.'px' : $mag_category_td_img_width).";
	height: ".suffusion_admin_get_size_from_field($suf_mag_catblocks_image_box_height, "100px").";
}
#ie6 .suf-mag-category-image { width: ".(suffusion_admin_check_integer($mag_category_td_img_width_ie) ? $mag_category_td_img_width_ie.'px' : $mag_category_td_img_width_ie)."; }
h2.suf-mag-headlines-title { text-align: $suf_mag_headline_main_title_alignment; }";

		return $ret;
	}

	function get_custom_header_settings() {
		global $suf_header_style_setting, $suf_header_image_type, $suf_header_background_image, $suf_header_background_rot_folder, $suf_header_background_repeat;
		global $suf_header_background_position, $suf_header_section_height, $suf_header_height, $suf_header_gradient_start_color, $suf_header_gradient_end_color, $suf_header_gradient_style;
		global $suf_blog_title_color, $suf_blog_title_style, $suf_blog_title_hover_color, $suf_blog_title_hover_style, $suf_blog_description_color, $suf_sub_header_vertical_alignment;
		global $suf_header_alignment, $suf_sub_header_alignment, $suf_wih_width;
		$ret = "";
		if ($suf_header_style_setting == "custom") {
			if (($suf_header_image_type == "image" && isset($suf_header_background_image) && trim($suf_header_background_image) != '') ||
					($suf_header_image_type == "rot-image" && isset($suf_header_background_rot_folder) && trim($suf_header_background_rot_folder) != '')) {
				if ($suf_header_image_type == "image") {
					$header_bg_url = " url($suf_header_background_image) ";
				}
				else {
					$header_bg_url = " url(".suffusion_get_rotating_image($suf_header_background_rot_folder).") ";
				}
				$ret .= "
#header-container {	background-image: $header_bg_url; background-repeat: $suf_header_background_repeat; background-position: $suf_header_background_position; height: $suf_header_section_height; }";
			}
			else if ($suf_header_image_type == "gradient") {
				if (isset($suf_header_height)) {
					$header_bg_url = " url(".get_template_directory_uri()."/gradient.php?start=$suf_header_gradient_start_color&finish=$suf_header_gradient_end_color&direction=$suf_header_gradient_style&height=$suf_header_height)";
				}
				else {
					$header_bg_url = " url(".get_template_directory_uri()."/gradient.php?start=$suf_header_gradient_start_color&finish=$suf_header_gradient_end_color&direction=$suf_header_gradient_style&height=121)";
				}
				if ($suf_header_gradient_style == "top-down" || $suf_header_gradient_style == "down-top") {
					$header_bg_repeat = "repeat-x";
				}
				else if ($suf_header_gradient_style == "left-right" || $suf_header_gradient_style == "right-left") {
					$header_bg_repeat = "repeat-y";
				}
				if ($suf_header_gradient_style == "top-down" || $suf_header_gradient_style == "left-right") {
					$header_bg_color = $suf_header_gradient_end_color;
				}
				else if ($suf_header_gradient_style == "down-top" || $suf_header_gradient_style == "right-left") {
					$header_bg_color = $suf_header_gradient_start_color;
				}
				$ret .= "
#header-container { background-image: $header_bg_url; background-repeat: $header_bg_repeat; background-color: #".$this->strip_color_hash($header_bg_color)."; }";
			}
			$ret .= "
.blogtitle a { color: #".$this->strip_color_hash($suf_blog_title_color)."; text-decoration: $suf_blog_title_style; }
.custom-header .blogtitle a:hover { color: #".$this->strip_color_hash($suf_blog_title_hover_color)."; text-decoration: $suf_blog_title_hover_style; }
.description { color: #".$this->strip_color_hash($suf_blog_description_color)."; }";

			if (isset($suf_header_height)) {
				$header_height = suffusion_admin_get_size_from_field($suf_header_height, "55px");
				$ret .= "
#header { min-height: $header_height; }";
			}
		}

		if ($suf_sub_header_vertical_alignment == "above" || $suf_sub_header_vertical_alignment == "below") {
			$ret .= "
.description { display: block; width: 100%; margin-top: 0; margin-left: 0; margin-right: 0; }
.blogtitle { width: 100%; }";
		}

		if ($suf_header_alignment == "center") {
			$ret .= "
#header { text-align: center; }";
		}

		// If there are header widgets then the width of the header needs to be balanced
		if (!suffusion_is_sidebar_empty(12)) {
			$wih_width = suffusion_admin_get_size_from_field($suf_wih_width, "300px");
			if ($suf_header_alignment != 'right') {
				$ret .= "
#header { float: left; width: auto; }
#header .blogtitle, #header .description { float: none; }
#header-widgets { float: right; width: $wih_width; }";
			}
			else {
				$ret .= "
#header { float: right; width: auto; }
#header .blogtitle, #header .description { float: none; }
#header-widgets { float: left; width: $wih_width; }";
			}
		}

		return $ret;
	}

	function get_custom_wrapper_settings() {
		global $suf_wrapper_settings_def_cust, $suf_show_shadows, $suf_wrapper_margin, $suf_header_style_setting;
		$ret = "";
		if ($suf_wrapper_settings_def_cust == 'custom') {
			$ret .= "
#wrapper {
	".$this->get_bg_information('suf_wrapper_bg_settings');
			if ($suf_show_shadows == 'show') {
				$ret .= "
	box-shadow: 10px 10px 5px #888;";
			}
			$ret .="
}";
		}
		if ($suf_header_style_setting == "custom" && isset($suf_wrapper_margin)) {
			$wrapper_margin = suffusion_admin_get_size_from_field($suf_wrapper_margin, "50px");
			$ret .= "
#wrapper { margin: $wrapper_margin auto; }";
		}
		return $ret;
	}

	function get_custom_post_bg_settings() {
		global $suf_post_bg_settings_def_cust;
		$ret = "";
		if ($suf_post_bg_settings_def_cust == 'custom') {
			$ret .= "
.post, article.page {
	".$this->get_bg_information('suf_post_bg_settings')."
}
";
		}
		return $ret;
	}

	function get_custom_body_font_settings() {
		global $suf_body_font_style_setting, $suf_font_color, $suf_body_font_family, $suf_link_color, $suf_link_style;
		global $suf_visited_link_color, $suf_visited_link_style, $suf_link_hover_color, $suf_link_hover_style;
		$ret = "";
		if ($suf_body_font_style_setting == 'custom') {
			$font_string = stripslashes($suf_body_font_family);
			$font_string = wp_specialchars_decode($font_string, ENT_QUOTES);
			$ret .= "
body { color: #".$this->strip_color_hash($suf_font_color)."; font-family: ".$font_string."; }
a { color: #".$this->strip_color_hash($suf_link_color)."; text-decoration: $suf_link_style; }
a:visited { color: #".$this->strip_color_hash($suf_visited_link_color)."; text-decoration: $suf_visited_link_style; }
a:hover { color: #".$this->strip_color_hash($suf_link_hover_color)."; text-decoration: $suf_link_hover_style; }
";
		}
		return $ret;
	}

	function get_custom_date_box_css() {
		global $suf_date_box_show, $suf_post_meta_position, $suf_date_box_settings_def_cust;
		$ret = "";
		if ($suf_date_box_show == 'hide' || $suf_date_box_show == 'hide-search' || $suf_post_meta_position != 'corners') {
			if ($suf_date_box_show == 'hide-search' && $suf_post_meta_position == 'corners') {
				$template_class = '.search-results';
			}
			else {
				$template_class = '';
			}
			$ret .= "
$template_class .post .date { display: none; }
$template_class .title-container { padding-left: 0; padding-right: 0; }
$template_class .post .title { padding-left: 0; }
";
		}

		if ($suf_date_box_settings_def_cust == 'custom') {
			$ret .= "
.post div.date {
	".$this->get_bg_information('suf_date_box_settings')."
}
.post .date span.day {
	".$this->get_font_information('suf_date_box_dfont')."
}
.post .date span.month {
	".$this->get_font_information('suf_date_box_mfont')."
}
.post .date span.year {
	".$this->get_font_information('suf_date_box_yfont')."
}
";
		}
		return $ret;
	}

	function get_custom_emphasis_css() {
		global $suf_emphasis_customization, $suf_download_font_color, $suf_download_background_color, $suf_download_border_color, $suf_announcement_font_color, $suf_announcement_background_color;
		global $suf_announcement_border_color, $suf_note_font_color, $suf_note_background_color, $suf_note_border_color, $suf_warning_font_color, $suf_warning_background_color, $suf_warning_border_color;
		$ret = "";
		if ($suf_emphasis_customization == 'custom') {
			$ret .= "
.download { color: #".$this->strip_color_hash($suf_download_font_color)."; background-color: #".$this->strip_color_hash($suf_download_background_color)."; border-color: #".$this->strip_color_hash($suf_download_border_color)."; }
.announcement { color: #".$this->strip_color_hash($suf_announcement_font_color)."; background-color: #".$this->strip_color_hash($suf_announcement_background_color)."; border-color: #".$this->strip_color_hash($suf_announcement_border_color)."; }
.note { color: #".$this->strip_color_hash($suf_note_font_color)."; background-color: #".$this->strip_color_hash($suf_note_background_color)."; border-color: #".$this->strip_color_hash($suf_note_border_color)."; }
.warning { color: #".$this->strip_color_hash($suf_warning_font_color)."; background-color: #".$this->strip_color_hash($suf_warning_background_color)."; border-color: #".$this->strip_color_hash($suf_warning_border_color)." }";
		}
		return $ret;
	}

	function get_custom_byline_css() {
		global $suf_post_show_cats, $suf_post_show_comment, $suf_page_show_comment, $suf_post_show_tags, $suf_post_show_posted_by, $suf_page_show_posted_by, $suf_page_meta_position;
		$formats = array('aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat');
		$ret = "";
		$cat_align = ($suf_post_show_cats == 'show-tright' || $suf_post_show_cats == 'show-bright') ? "right" : "left";
		$post_comment_align = ($suf_post_show_comment == 'show-tleft' || $suf_post_show_comment == 'show-bleft') ? "left" : "right";
		$tag_align = ($suf_post_show_tags == 'show-tleft' || $suf_post_show_tags == 'show-bleft') ? "left" : "right";
		$post_author_align = ($suf_post_show_posted_by == 'show-tright' || $suf_post_show_posted_by == 'show-bright') ? "right" : "left";
		$page_comment_align = ($suf_page_show_comment == 'show-tleft' || $suf_page_show_comment == 'show-bleft') ? "left" : "right";
		$page_author_align = ($suf_page_show_posted_by == 'show-tright' || $suf_page_show_posted_by == 'show-bright') ? "right" : "left";
		if ($suf_page_meta_position == 'corners') {
			$ret .= "
.postdata .category{ float: $cat_align; }
.post .postdata .comments { float: $post_comment_align; }
.tags { float: $tag_align; text-align: $tag_align; }
.post span.author { float: $post_author_align; ".($post_author_align == "left" ? "padding-right: 10px; " : "padding-left: 10px; ")." }
article.page .postdata .comments { float: $page_comment_align; }
article.page span.author { float: $page_author_align; ".($page_author_align == "left" ? "padding-right: 10px; " : "padding-left: 10px; ")." }
";
		}

		foreach ($formats as $format) {
			$show_title = 'suf_post_'.$format.'_show_title';
			$show_cats = 'suf_post_'.$format.'_show_cats';
			$show_posted_by = 'suf_post_'.$format.'_show_posted_by';
			$show_tags = 'suf_post_'.$format.'_show_tags';
			$show_comment = 'suf_post_'.$format.'_show_comment';
			$show_perm = 'suf_post_'.$format.'_show_perm';
			$meta_position = 'suf_post_'.$format.'_meta_position';

			global $$show_title, $$show_cats, $$show_posted_by, $$show_tags, $$show_comment, $$show_perm, $$meta_position;
			$post_show_title = $$show_title;
			$post_show_cats = $$show_cats;
			$post_show_posted_by = $$show_posted_by;
			$post_show_tags = $$show_tags;
			$post_show_comment = $$show_comment;
			$post_show_perm = $$show_perm;
			$post_meta_position = $$meta_position;

			$cat_align = ($post_show_cats == 'show-tright' || $post_show_cats == 'show-bright') ? "right" : "left";
			$post_comment_align = ($post_show_comment == 'show-tleft' || $post_show_comment == 'show-bleft') ? "left" : "right";
			$tag_align = ($post_show_tags == 'show-tleft' || $post_show_tags == 'show-bleft') ? "left" : "right";
			$perm_align = ($post_show_perm == 'show-tleft' || $post_show_perm == 'show-bleft') ? "left" : "right";
			$post_author_align = ($post_show_posted_by == 'show-tright' || $post_show_posted_by == 'show-bright') ? "right" : "left";
			if ($post_show_title == 'hide') {
				$ret .= "
.format-$format h1.posttitle, .format-$format h2.posttitle, .post.format-$format .date { display: none; }
.format-$format .title-container { padding-left: 0; }
";
			}
			if ($post_meta_position == 'corners') {
				$ret .= "
.format-$format .postdata .category{ float: $cat_align; }
.post.format-$format .postdata .comments { float: $post_comment_align; }
.format-$format .tags { float: $tag_align; text-align: $tag_align; }
.format-$format .permalink { float: $perm_align; text-align: $perm_align; }
.post.format-$format  span.author { float: $post_author_align; ".($post_author_align == "left" ? "padding-right: 10px; " : "padding-left: 10px; ")." }
";
			}
		}
		return $ret;
	}

	function get_custom_wabh_css() {
		global $suf_widget_area_below_header_enabled, $suf_wabh_font_style_setting;
		global $suf_wabh_font_color, $suf_wabh_link_color, $suf_wabh_link_style, $suf_wabh_visited_link_color, $suf_wabh_visited_link_style, $suf_wabh_link_hover_color, $suf_wabh_link_hover_style;
		$ret = "";
		if ($suf_widget_area_below_header_enabled == "enabled") {
			if ($suf_wabh_font_style_setting == "custom") {
				$ret .= "
#horizontal-outer-widgets-1 { color: #".$this->strip_color_hash($suf_wabh_font_color)."; }
#horizontal-outer-widgets-1 a { color: #".$this->strip_color_hash($suf_wabh_link_color)."; text-decoration: $suf_wabh_link_style; }
#horizontal-outer-widgets-1 a:visited { color: #".$this->strip_color_hash($suf_wabh_visited_link_color)."; text-decoration: $suf_wabh_visited_link_style; }
#horizontal-outer-widgets-1 a:hover { color: #".$this->strip_color_hash($suf_wabh_link_hover_color)."; text-decoration: $suf_wabh_link_hover_style; }";
			}
		}
		return $ret;
	}

	function get_custom_waaf_css() {
		global $suf_widget_area_above_footer_enabled, $suf_waaf_font_style_setting;
		global $suf_waaf_font_color, $suf_waaf_link_color, $suf_waaf_link_style, $suf_waaf_visited_link_color, $suf_waaf_visited_link_style, $suf_waaf_link_hover_color, $suf_waaf_link_hover_style;
		$ret = "";
		if ($suf_widget_area_above_footer_enabled == "enabled") {
			if ($suf_waaf_font_style_setting == "custom") {
				$ret .= "
#horizontal-outer-widgets-2 { color: #".$this->strip_color_hash($suf_waaf_font_color)."; }
#horizontal-outer-widgets-2 a { color: #".$this->strip_color_hash($suf_waaf_link_color)."; text-decoration: $suf_waaf_link_style; }
#horizontal-outer-widgets-2 a:visited {	color: #".$this->strip_color_hash($suf_waaf_visited_link_color)."; text-decoration: $suf_waaf_visited_link_style; }
#horizontal-outer-widgets-2 a:hover { color: #".$this->strip_color_hash($suf_waaf_link_hover_color)."; text-decoration: $suf_waaf_link_hover_style; }";
			}
		}
		return $ret;
	}

	function get_custom_featured_css() {
		global $suf_featured_height, $suf_featured_excerpt_width, $suf_featured_excerpt_bg_color, $suf_featured_excerpt_font_color, $suf_featured_excerpt_link_color, $suf_featured_show_border, $suf_featured_override_theme;
		$featured_height = suffusion_admin_get_size_from_field($suf_featured_height, "250px");
		$control_position = suffusion_admin_get_size_from_field($suf_featured_height, "250px", false);
		$control_position = substr($control_position, 0, strlen($control_position) - 2);
		$control_position = (int)(((int)$control_position)/2);
		$adjusted_control_position = $control_position - 15;
		$control_position = $control_position."px";
		$featured_excerpt_width = suffusion_admin_get_size_from_field($suf_featured_excerpt_width, "250px");
		if (isset($suf_featured_override_theme) && $suf_featured_override_theme) {
			$custom = '.suffusion-custom';
		}
		else {
			$custom = '';
		}
		$ret = "
#slider, #sliderContent { max-height: $featured_height; }
$custom #slider .left, $custom #slider .right { height: $featured_height; max-height: $featured_height; width: $featured_excerpt_width !important; }
$custom .sliderImage .top, $custom .sliderImage .bottom { max-width: none; }
.sliderImage { height: $featured_height; }
.controller-icons #sliderControl { top: -$control_position; }
.controller-icons.index-overlaid #sliderControl { top: -{$adjusted_control_position}px; }
$custom .sliderImage div { background-image: none; background-color: #".$this->strip_color_hash($suf_featured_excerpt_bg_color)."; color: #".$this->strip_color_hash($suf_featured_excerpt_font_color)."; }
$custom .sliderImage div a { color: #".$this->strip_color_hash($suf_featured_excerpt_link_color)."; }";
		if ($suf_featured_show_border == "show") {
			$ret .= "
#featured-posts { border-width: 1px; border-style: solid; }";
		}
		return $ret;
	}

	function get_custom_tiled_layout_css($widths) {
		global $suf_tile_image_box_height, $suf_tile_title_alignment;

		$ret = "
#ie6 table.suf-tiles { width: ".(suffusion_admin_check_integer($widths['main-col']) ? ($widths['main-col'] - 25).'px' : '96%')." }
.suf-tile-image { height: ".(suffusion_admin_get_size_from_field($suf_tile_image_box_height, "100px"))."; }
h2.suf-tile-title { text-align: $suf_tile_title_alignment; }";
		return $ret;
	}

	function get_custom_tbrh_css() {
		global $suf_wa_tbrh_style, $suf_wa_tbrh_panel_color, $suf_wa_tbrh_panel_border_color, $suf_wa_tbrh_panel_font_color, $suf_wa_tbrh_override_theme;
		$ret = "";
		if (isset($suf_wa_tbrh_override_theme) && $suf_wa_tbrh_override_theme) {
			$custom = '.custom';
		}
		else {
			$custom = '';
		}
		if ($suf_wa_tbrh_style != 'tiny') {
			$ret .= "
#top-bar-right-spanel$custom { background-color: #".$this->strip_color_hash($suf_wa_tbrh_panel_color)."; border-color: #".$this->strip_color_hash($suf_wa_tbrh_panel_border_color)."; color: #".$this->strip_color_hash($suf_wa_tbrh_panel_font_color)."; }";
		}
		return $ret;
	}

	function get_custom_sidebar_settings_css() {
		global $suf_sb_font_style_setting, $suf_sb_font_color, $suf_sb_link_color, $suf_sb_link_style, $suf_sb_visited_link_color, $suf_sb_visited_link_style;
		global $suf_sb_link_hover_color, $suf_sb_link_hover_style;
		$ret = "";

		if ($suf_sb_font_style_setting == "custom") {
			$ret .= "
#sidebar, #sidebar-2, #sidebar-container { color: #".$this->strip_color_hash($suf_sb_font_color)."; }
#sidebar a, #sidebar-2 a, #sidebar-container a { color: #".$this->strip_color_hash($suf_sb_link_color)."; text-decoration: $suf_sb_link_style; }
#sidebar a:visited, #sidebar-2 a:visited, #sidebar-container a:visited { color: #".$this->strip_color_hash($suf_sb_visited_link_color)."; text-decoration: $suf_sb_visited_link_style; }
#sidebar a:hover, #sidebar-2 a:hover, #sidebar-container a:hover { color:  #".$this->strip_color_hash($suf_sb_link_hover_color)."; text-decoration: $suf_sb_link_hover_style; }";
		}
		$ret .= "
.sidebar-wrap-right #sidebar-shell-1 { float: right; margin-left: 0; margin-right: 0;}
.sidebar-wrap-right #sidebar-shell-2 { float: right; margin-right: 15px; margin-left: 0;}
.sidebar-wrap-left #sidebar-shell-1 { float: left; margin-left: 0; margin-right: 0;}
.sidebar-wrap-left #sidebar-shell-2 { float: left; margin-left: 15px; margin-right: 0;}
.sidebar-container-left #sidebar-wrap { margin-left: 0; margin-right: 0; left: auto; right: auto; }
.sidebar-container-right #sidebar-wrap { margin-left: 0; margin-right: 0; left: auto; right: auto; }
#sidebar-container .tab-box { margin-left: 0; margin-right: 0; }
#sidebar-container.sidebar-container-left { margin-left: -100%; }
#ie6 #sidebar-container #sidebar-shell-1, #ie6 #sidebar-container #sidebar-shell-2 { left: auto; right: auto; }
#ie6 .sidebar-container-left #sidebar-wrap, #ie6 .sidebar-container-right #sidebar-wrap { left: auto; right: auto; }";
		return $ret;
	}

	function get_custom_miscellaneous_css() {
		global $suf_audio_att_player_width, $suf_audio_att_player_height, $suf_application_att_player_width, $suf_text_att_player_width, $suf_video_att_player_width, $suf_video_att_player_height;
		global $suf_uprof_post_info_gravatar_alignment, $suf_mosaic_constrain_row, $suf_mosaic_constrain_by_padding;
		$ret = "";
		//Attachments
		$ret .= "
.attachment object.audio { width: {$suf_audio_att_player_width}px; height: {$suf_audio_att_player_height}px; }
.attachment object.application { width: {$suf_application_att_player_width}px; }
.attachment object.text { width: {$suf_text_att_player_width}px; }
.attachment object.video { width: {$suf_video_att_player_width}px; height: {$suf_video_att_player_height}px; }";

		//Avatar
		$ret .= "
.author-info img.avatar { float: $suf_uprof_post_info_gravatar_alignment; padding: 5px; }";

		if ($suf_mosaic_constrain_row == 'padding') {
			$ret .= "
.suf-mosaic-thumb-container { margin-left: {$suf_mosaic_constrain_by_padding}px; margin-right: {$suf_mosaic_constrain_by_padding}px; }";
		}
		return $ret;
	}

	function get_icon_set_css() {
		global $suf_iconset, $suf_little_icons_enabled;
		$ret = "
.postdata .category .icon, .postdata .author .icon, .postdata .tax .icon, .postdata .permalink .icon, .postdata .comments .icon, .postdata .edit .icon, .postdata .line-date .icon,
.previous-entries .icon, .next-entries .icon, .post-nav .previous .icon, .post-nav .next .icon, h3.comments .icon, #reply-title .icon, input.inside, .exif-button .icon,
.bookdata .edit .icon, .bookdata .manage .icon, .page-nav-left a, .page-nav-right a, .mosaic-page-nav-right a, .mosaic-page-nav-left a, .mosaic-overlay a span,
.meta-pullout .category .icon, .meta-pullout .author .icon, .meta-pullout .tax .icon, .meta-pullout .permalink .icon, .meta-pullout .comments .icon, .meta-pullout .edit .icon, .meta-pullout .pullout-date .icon,
.controller-icons #sliderControl .sliderPrev, .controller-icons #sliderControl .sliderNext, .controller-icons .sliderControl .sliderPrev, .controller-icons .sliderControl .sliderNext, .user-profiles .icon {
	background-image: url(".get_template_directory_uri()."/images/$suf_iconset.png);
}
";
		$icons = explode(',', $suf_little_icons_enabled);
		$icons[] = 'tax';
		$icon_selector = array();
		if (is_array($icons)) {
			foreach ($icons as $icon) {
				if ($icon != 'date') {
					$icon_selector[] = ".postdata .$icon .icon";
					$icon_selector[] = ".meta-pullout .$icon .icon";
				}
				else {
					$icon_selector[] = ".postdata .line-$icon .icon";
					$icon_selector[] = ".meta-pullout .pullout-$icon .icon";
				}
			}
		}
		if (count($icon_selector) > 0) {
			$icon_selector = implode(',', $icon_selector);
			$ret .= "$icon_selector { display: inline-block; }\n";
		}
		return $ret;
	}

	function get_typography_css() {
		global $suf_main_font_style_setting, $suf_title_font_style_setting, $suf_comment_font_setting, $suf_header_font_setting, $suf_footer_font_setting;
		$ret = "";
		if (isset($suf_main_font_style_setting) && $suf_main_font_style_setting == 'on') {
			$ret .= ".entry, .non-wp-entry { ".$this->get_font_information('suf_main_font_size')." }\n";
		}
		if (isset($suf_title_font_style_setting) && $suf_title_font_style_setting == 'on') {
			$ret .= "h1.posttitle, h2.posttitle { ".$this->get_font_information('suf_post_title_font')." }\n";
			$ret .= "h1.posttitle a, h2.posttitle a, h1.posttitle a:visited, h2.posttitle a:visited { ".$this->get_font_information('suf_post_title_link_font')." }\n";
			$ret .= "h1.posttitle a:hover, h2.posttitle a:hover { ".$this->get_font_information('suf_post_title_link_hover_font')." }\n";
		}
		if (isset($suf_header_font_setting) && $suf_header_font_setting == 'on') {
			$ret .= "h1 { ".$this->get_font_information('suf_post_h1_font')." }\n";
			$ret .= "h2 { ".$this->get_font_information('suf_post_h2_font')." }\n";
			$ret .= "h3 { ".$this->get_font_information('suf_post_h3_font')." }\n";
			$ret .= "h4 { ".$this->get_font_information('suf_post_h4_font')." }\n";
			$ret .= "h5 { ".$this->get_font_information('suf_post_h5_font')." }\n";
			$ret .= "h6 { ".$this->get_font_information('suf_post_h6_font')." }\n";
		}
		if (isset($suf_comment_font_setting) && $suf_comment_font_setting == 'on') {
			$ret .= "h3.comments, h3#respond, h3.respond, #reply-title { ".$this->get_font_information('suf_comment_header_font')." }\n";
			$ret .= ".commentlist li.comment, .commentlist li.pingback, .commentlist li.trackback { ".$this->get_font_information('suf_comment_body_font')." }\n";
		}
		if (isset($suf_footer_font_setting) && $suf_footer_font_setting == 'on') {
			$ret .= "#cred { ".$this->get_font_information('suf_footer_text_font')." }\n";
			$ret .= "#cred a { ".$this->get_font_information('suf_footer_link_font')." }\n";
			$ret .= "#cred a:hover { ".$this->get_font_information('suf_footer_link_hover_font')." }\n";
		}
		return $ret;
	}

	function get_post_format_widths_css() {
		global $suf_gallery_format_thumb_panel_position, $suf_gallery_format_thumb_panel_width;
		$ret = "";
		if ($suf_gallery_format_thumb_panel_position == 'left' || $suf_gallery_format_thumb_panel_position == 'right') {
			$width = suffusion_admin_get_size_from_field($suf_gallery_format_thumb_panel_width, '250px');
			$mod_width = (int)(substr($width, 0, strlen($width) - 2));
			$mod_width += 16;
			$mod_width = $mod_width.'px';
			$ret .= ".gallery-container { padding-$suf_gallery_format_thumb_panel_position: $mod_width }";
			$ret .= ".gallery-contents { width: $width }";
			$ret .= ".gallery-contents.left { left: -$mod_width }";
			$ret .= ".gallery-contents.right { margin-right: -$mod_width }\n";
		}
		return $ret;
	}

	function generate_all_css() {
		global $suf_size_options, $suf_sidebar_count, $suf_minify_css, $suf_enable_responsive;
		$css = '';

		$css .= "/* ".$this->get_creation_date()." */";
		$css .= $this->get_custom_body_settings();
		$css .= $this->get_custom_wrapper_settings();
		$css .= $this->get_custom_post_bg_settings();
		$css .= $this->get_custom_body_font_settings();

		$suffusion_template_prefixes = suffusion_get_template_prefixes();
		$suffusion_template_sidebars = suffusion_get_template_sidebars();
		foreach ($suffusion_template_prefixes as $template => $prefix) {
			$sb_count = $suffusion_template_sidebars[$template];
			$suffusion_template_widths = $this->get_widths_for_template($prefix, $sb_count, $template);
			$template_class = '.page-template-'.str_replace('.', '-', $template);
			$css .= $this->get_template_specific_classes($template_class, $suffusion_template_widths);
		}

		if ($suf_size_options == "custom") {
			$suffusion_template_widths = $this->get_widths_for_template(false, $suf_sidebar_count);
		}
		else {
			// We still need to get the array of widths for the sidebars.
			$suffusion_template_widths = $this->get_automatic_widths(1000, $suf_sidebar_count, false);
		}

		// The default settings:
		$css .= $this->get_template_specific_classes('', $suffusion_template_widths);

		// For the no-sidebars.php template (uses the same widths as computed for the default settings):
		$css .= $this->get_zero_sidebars_template_widths();

		$css .= $this->get_mag_template_widths($suffusion_template_widths);

		$css .= $this->get_custom_date_box_css();
		$css .= $this->get_custom_byline_css();
		$css .= $this->get_custom_header_settings();

		$css .= $this->get_custom_tbrh_css();
		$css .= $this->get_custom_wabh_css();
		$css .= $this->get_custom_waaf_css();
		$css .= $this->get_custom_featured_css();
		$css .= $this->get_custom_emphasis_css();
		$css .= $this->get_custom_layout_template_css();

		$css .= $this->get_custom_tiled_layout_css($suffusion_template_widths);
		$css .= $this->get_finalized_header_footer_nav_css();
		$css .= $this->get_nr_css($suffusion_template_widths);

		$css .= $this->get_navigation_bar_custom_css('nav');
		$css .= $this->get_navigation_bar_custom_css('nav-top');

		$css .= $this->get_custom_miscellaneous_css();
		$css .= $this->get_custom_sidebar_settings_css();

		$css .= $this->get_typography_css();
		$css .= $this->get_icon_set_css();
		$css .= $this->get_post_format_widths_css();

		if (isset($suf_enable_responsive) && $suf_enable_responsive == 'on') {
			$css .= suffusion_get_responsive_widths_css();
		}

		if ($suf_minify_css == 'minify') {
			$css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
			/* remove tabs, spaces, newlines, etc. */
			$css = str_replace(array("\r\n", "\r", "\n", "\t"), '', $css);
			$css = str_replace(array('  ', '   ', '    ', '     '), ' ', $css);
			$css = str_replace(array(": ", " :"), ':', $css);
			$css = str_replace(array(" {", "{ "), '{', $css);
			$css = str_replace(';}','}', $css);
			$css = str_replace(', ', ',', $css);
			$css = str_replace('; ', ';', $css);
		}
		return $css;
	}
}
