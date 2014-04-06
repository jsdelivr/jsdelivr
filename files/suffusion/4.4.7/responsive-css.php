<?php
function suffusion_get_responsive_widths_css() {
	global $suf_responsive_stops, $suf_responsive_nav_switch, $suf_responsive_thumb_switch, $suf_responsive_pullout_switch, $suf_responsive_scale_header, $suf_responsive_headline_box_switch;
	$stops = explode(',', $suf_responsive_stops);

	$ret = '';
	$nav_switch = $thumb_switch = $pullout_switch = $headline_switch = 10000;
	$responsive_nav = $responsive_thumb = $responsive_pullout = $responsive_headline = '';

	$responsive_nav .= "\n.tinynav { display: block; }\n";
	$responsive_nav .= "#nav ul.sf-menu, #nav-top ul.sf-menu { display: none; }\n";

	$responsive_thumb .= ".suf-thumbnail-anchor-left, .suf-thumbnail-anchor-right, .left-thumbnail, .right-thumbnail { width: 100%; float: none; display: inline-block; text-align: center; }\n";
	$responsive_thumb .= "img.left-thumbnail, img.right-thumbnail { float: none; width: auto; }\n";

	$responsive_pullout .= ".meta-position-left-pullout .entry-container, .meta-position-right-pullout .entry-container, .outer-pullout-container { padding-left: 0; padding-right: 0; }\n";
	$responsive_pullout .= ".meta-pullout, .outer-pullout-container .meta-pullout { margin-left: 0; margin-right: 0; margin-top: 5px; left: auto; right: auto; width: 100%; }\n";
	$responsive_pullout .= ".meta-pullout ul { border-right: none; border-left: none; }\n";
	$responsive_pullout .= ".meta-pullout ul li { text-align: center; }\n";
	$responsive_pullout .= ".meta-pullout ul li span.author { float: none; }\n";

	if ($suf_responsive_nav_switch == 'always') {
		$ret .= $responsive_nav;
	}
	else if ($suf_responsive_nav_switch != 'never') {
		$nav_switch = rtrim($suf_responsive_nav_switch, 'px');
	}
	if ($suf_responsive_thumb_switch == 'always') {
		$ret .= $responsive_thumb;
	}
	else if ($suf_responsive_thumb_switch != 'never') {
		$thumb_switch = rtrim($suf_responsive_thumb_switch, 'px');
	}
	if ($suf_responsive_pullout_switch == 'always') {
		$ret .= $responsive_pullout;
	}
	else if ($suf_responsive_pullout_switch != 'never') {
		$pullout_switch = rtrim($suf_responsive_pullout_switch, 'px');
	}
	if (isset($suf_responsive_scale_header) && $suf_responsive_scale_header == 'on') {
		$ret .= ".blogtitle a { max-width: 100%; width: auto; }\n";
		$ret .= ".blogtitle a img { max-width: 100%; }\n";
		$ret .= "#header { max-width: 100%; }\n";
	}
	foreach ($stops as $stop) {
		$n_stop = rtrim($stop, 'px');
		$sb = 'suf_responsive_'.$n_stop.'_sb';
		global $$sb;
		$sb = $$sb;
		$ret .= "@media screen and (max-width: $stop) {";
		if ($n_stop <= $nav_switch) {
			$ret .= $responsive_nav;
		}
		if ($n_stop <= $thumb_switch) {
			$ret .= $responsive_thumb;
		}
		if ($n_stop <= $pullout_switch) {
			$ret .= $responsive_pullout;
		}
		/*			if ($n_stop <= $headline_switch) {
			   $ret .= $responsive_headline;
		   }*/
		$ret .=
			"\n\t".suffusion_all_templates_selector('#wrapper')." {
		width: 100%;
		max-width: none;
		min-width: 0;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-ms-box-sizing: border-box;
		box-sizing: border-box;
	}\n";

		$ret .=	"\t".suffusion_all_templates_selector('#nav .col-control')." {	width: 100%; max-width: none; min-width: 0; }\n";

		if ($sb == 'kill') {
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-shell-1')." { display: none; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-shell-2')." { display: none; }\n";
		}
		else if ($sb == 'below') {
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-shell-1')." { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar').", ".suffusion_all_templates_selector('#sidebar-b')." { width: 100%; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-shell-2')." { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-2').", ".suffusion_all_templates_selector('#sidebar-2-b')." { width: 100%; }\n";
		}
		else if ($sb == 'below-beside') {
			global $suf_sidebar_count, $suf_sidebar_alignment, $suf_sidebar_2_alignment;
			if (2 == $suf_sidebar_count && $suf_sidebar_alignment === $suf_sidebar_2_alignment) {
				$ret .= "\t#sidebar-wrap { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
				$ret .= "\t.sidebar-wrap-$suf_sidebar_alignment #sidebar-shell-1 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float: $suf_sidebar_alignment;}\n";
				$ret .= "\t.sidebar-wrap-$suf_sidebar_alignment #sidebar-shell-2 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float:".($suf_sidebar_alignment == 'right' ? 'left' : 'right').";}\n";
				$ret .= "\t#sidebar-container.sidebar-container-left, #sidebar-container.sidebar-container-right { width: 100%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-$suf_sidebar_alignment #sidebar-shell-1 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float: $suf_sidebar_alignment;}\n";
				$ret .= "\t#sidebar-container.sidebar-container-$suf_sidebar_alignment #sidebar-shell-2 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float:".($suf_sidebar_alignment == 'right' ? 'left' : 'right').";}\n";
			}
			else if (2 == $suf_sidebar_count) {
				$ret .= "\t#sidebar-shell-1 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: $suf_sidebar_alignment; }\n";
				$ret .= "\t#sidebar-shell-2 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: $suf_sidebar_2_alignment; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-left, #sidebar-container.sidebar-container-right { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-left { float: left; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-right { float: right; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-left #sidebar-shell-1, #sidebar-container.sidebar-container-right #sidebar-shell-1, #sidebar-container.sidebar-container-left #sidebar-shell-2, #sidebar-container.sidebar-container-right #sidebar-shell-2 {width: 100%;}\n";
			}
			else if ($suf_sidebar_count == 1) {
				$ret .= "\t#sidebar-shell-1 { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
				$ret .= "\t#sidebar, #sidebar-b { width: 100%; }\n";
				$ret .= "\t#sidebar-container.sidebar-container-left, #sidebar-container.sidebar-container-right { width: 100%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";
			}

			$ret .= "\t#sidebar.$suf_sidebar_alignment, #sidebar-b.$suf_sidebar_alignment, #sidebar-2.$suf_sidebar_2_alignment, #sidebar-2-b.$suf_sidebar_2_alignment { float: left; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar').", ".suffusion_all_templates_selector('#sidebar-b')." { width: 100%; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#sidebar-2').", ".suffusion_all_templates_selector('#sidebar-2-b')." { width: 100%; }\n";

			$ret .= "\t.page-template-2l-sidebars-php #sidebar-wrap, .page-template-2r-sidebars-php #sidebar-wrap { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
			$ret .= "\t.page-template-2l-sidebars-php #sidebar-shell-1, .page-template-2r-sidebars-php #sidebar-shell-2 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: left; }\n";
			$ret .= "\t.page-template-2r-sidebars-php #sidebar-shell-1, .page-template-2l-sidebars-php #sidebar-shell-2 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: right; }\n";
			$ret .= "\t.page-template-2l-sidebars-php #sidebar-container.sidebar-container-left, .page-template-2r-sidebars-php #sidebar-container.sidebar-container-right { width: 100%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";
			$ret .= "\t.page-template-2l-sidebars-php #sidebar-container.sidebar-container-left #sidebar-shell-1, .page-template-2r-sidebars-php #sidebar-container.sidebar-container-right #sidebar-shell-2 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float: left;}\n";
			$ret .= "\t.page-template-2r-sidebars-php #sidebar-container.sidebar-container-right #sidebar-shell-1, .page-template-2l-sidebars-php #sidebar-container.sidebar-container-left #sidebar-shell-2 {width: 49%; margin-right: auto; margin-left: auto;left: auto; right: auto; float: right;}\n";

			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-shell-1 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: $suf_sidebar_alignment; }\n";
			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-shell-2 { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; float: ".($suf_sidebar_alignment == 'right' ? 'left' : 'right')."; }\n";
			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-left, .page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-right { width: 49%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";
			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-left { float: left; }\n";
			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-right { float: right; }\n";
			$ret .= "\t.page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-left #sidebar-shell-1, .page-template-1l1r-sidebar-php #sidebar-container.sidebar-container-right #sidebar-shell-1, #sidebar-container.sidebar-container-left #sidebar-shell-2, #sidebar-container.sidebar-container-right #sidebar-shell-2 {width: 100%;}\n";

			$ret .= "\t.page-template-1l-sidebar-php #sidebar-shell-1, .page-template-1r-sidebar-php #sidebar-shell-1 { margin-right: auto; margin-left: auto; width: 100%; left: auto; right: auto; }\n";
			$ret .= "\t.page-template-1l-sidebar-php #sidebar, .page-template-1l-sidebar-php #sidebar-b, .page-template-1r-sidebar-php #sidebar, .page-template-1r-sidebar-php #sidebar-b { width: 100%; }\n";
			$ret .= "\t.page-template-1l-sidebar-php #sidebar-container.sidebar-container-left, .page-template-1r-sidebar-php #sidebar-container.sidebar-container-right { width: 100%; margin-right: auto; margin-left: auto; left: auto; right: auto; }\n";

			$ret .= "\t".suffusion_all_templates_selector('.tab-box')." { width: 100%; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#wsidebar-top')." { width: 100%; }\n";
			$ret .= "\t".suffusion_all_templates_selector('#wsidebar-bottom')." { width: 100%; }\n";
		}

		if ($sb != 'in-position') {
			$ret .= "\t".suffusion_all_templates_selector('#container')." { padding-left: 0; padding-right: 0; }";
		}
		$ret .=
			"\n\t".suffusion_all_templates_selector('#main-col')." {
		width: 100%;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-ms-box-sizing: border-box;
		box-sizing: border-box;
	}\n";

		$columns_opt = 'suf_responsive_'.$n_stop.'_columns';
		global $$columns_opt;
		$columns_opt = $$columns_opt;
		$column_counts = suffusion_get_associative_array($columns_opt);
		$width_map = array(
			1 => '100%',
			2 => '49%',
			3 => '32%',
			4 => '24%',
			5 => '19%',
			6 => '16%',
			7 => '13%',
			8 => '12%',
			9 => '10.5%',
			10 => '9.5%',
		);
		$margin_map = array(
			1 => '0',
			2 => '0.39%',
			3 => '0.49%',
			4 => '0.38%',
			5 => '0.35%',
		);
		$children_map = array(
			'widgets-above-header' => '#;.suf-widget',
			'header-widgets' => '#;.suf-widget',
			'horizontal-outer-widgets-1' => '#;.suf-widget',
			'horizontal-outer-widgets-2' => '#;.suf-widget',
			'ad-hoc-1' => '#;.suf-widget',
			'ad-hoc-2' => '#;.suf-widget',
			'ad-hoc-3' => '#;.suf-widget',
			'ad-hoc-4' => '#;.suf-widget',
			'ad-hoc-5' => '#;.suf-widget',
			'cl-warea-id-1' => '#;.cl-widget',
			'cl-warea-id-2' => '#;.cl-widget',
			'cl-warea-id-3' => '#;.cl-widget',
			'cl-warea-id-4' => '#;.cl-widget',
			'cl-warea-id-5' => '#;.cl-widget',
			'suf-mag-excerpts' => '.;.suf-tile',
			'suf-mag-categories' => '.;.suf-mag-category',
			'suf-tiles' => '.;.suf-tile'
		);

		foreach ($children_map as $area => $split_array) {
			if (isset($column_counts[$area])) {
				$columns = $column_counts[$area];
				if (isset($columns['columns']) && !empty($columns['columns'])) {
					$columns = $columns['columns'];
				}
				else {
					$columns = 1;
				}
			}
			else {
				$columns = 1;
			}

			$splits = explode(';', $split_array);
			$width = $width_map[$columns];
			$margin = '5px '.$margin_map[$columns];

			if ($area == 'suf-mag-excerpts' || $area == 'suf-mag-categories' || $area == 'suf-tiles') {
				$tile_containers = array();
				for ($i=1; $i<=8; $i++) {
					$tile_containers[] = $splits[0].$area.' .suf-tile-'.$i.'c';
				}

				$ret .= "\t".implode(', ', $tile_containers)." { width: {$width_map[$columns]}; }\n";
			}
			else if (substr($area, 0, 12) == 'cl-warea-id-') {
				$cl_containers = array();
				$cl_containers[] = $splits[0].$area.' .cl-widget';
				$cl_containers[] = $splits[0].$area.' .cl-warea-row .cl-widget';
				$cl_containers[] = $splits[0].$area.'.cl-warea-all .cl-widget';
				$cl_containers[] = $splits[0].$area.'.cl-warea-original .cl-widget';

				$ret .= "\t".implode(', ', $cl_containers)." { width: {$width_map[$columns]}; }\n";
			}
			else {
				$elements = array();
				for ($i=1; $i<=8; $i++) {
					$elements[] = $splits[0].$area.' '.$splits[1].'-'.$i.'c';
				}

				$ret .= "\t".implode(', ', $elements)." { width: $width; margin: $margin; }\n";
			}
		}

		if (isset($column_counts['mega-menus'])) {
			$columns = $column_counts['mega-menus'];
			if (isset($columns['columns']) && !empty($columns['columns'])) {
				$mm_columns = $columns['columns'];
			}
			else {
				$mm_columns = 1;
			}
			$max_width = $mm_columns * 180;
			$ret .= ".mm-warea { max-width: {$max_width}px; }\n";
			$ret .= ".mm-row-equal, .mm-original, .mm-mason { text-align: justify; -ms-text-justify: distribute; text-justify: distribute; }\n";
			$ret .= ".mm-row-equal:after { content: ''; width: 100%; display: inline-block; font-size: 0; line-height: 0 }\n";
			$ret .= ".mm-warea .mm-widget { float: left; max-width: 160px; width: {$width_map[$mm_columns]}; }\n";
		}

		$ret .= "}\n";
	}

	return $ret;
}

function suffusion_all_templates_selector($selector) {
	$all_templates = array('.page-template-no-sidebars-php', '.page-template-1l-sidebar-php', '.page-template-1r-sidebar-php',
		'.page-template-2l-sidebars-php', '.page-template-2r-sidebars-php', '.page-template-1l1r-sidebar-php', );

	$ret = array($selector);
	foreach ($all_templates as $template) {
		$ret[] = $template.' '.$selector;
	}
	return implode(", ", $ret);
}
