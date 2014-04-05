<?php
/**
 * Helper classes for the CSS generator.
 *
 * @since 3.8.4
 * @package Suffusion
 * @subpackage CSS
 */
class Suffusion_CSS_Helper {
	function get_bg_information($option) {
		global $$option;
		$option_val = $$option;
		if (!is_array($option_val)) {
			$val_array = array();
			$vals = explode(';', $option_val);
			foreach ($vals as $val) {
				if (trim($val) == '') { continue; }
				$pair = explode('=', $val);
				$val_array[$pair[0]] = $pair[1];
			}
			$option_val = $val_array;
		}
		$bg_string = "";
		$bg_rgba_string = "";
		if ($option_val['colortype'] == 'transparent') {
			$bg_string .= " transparent ";
		}
		else {
			if (isset($option_val['color'])) {
				if (substr($option_val['color'], 0, 1) == '#') {
					//$bg_string .= " ".$option_val['color'];
					$color_string = substr($option_val['color'],1);
				}
				else {
					//$bg_string .= " #".$option_val['color'];
					$color_string = $option_val['color'];
				}
				$rgb_str_array = array();
				if (strlen($color_string)==3) {
					$rgb_str_array[] = substr($color_string, 0, 1).substr($color_string, 0, 1);
					$rgb_str_array[] = substr($color_string, 1, 1).substr($color_string, 1, 1);
					$rgb_str_array[] = substr($color_string, 2, 1).substr($color_string, 2, 1);
				}
				else {
					$rgb_str_array[] = substr($color_string, 0, 2);
					$rgb_str_array[] = substr($color_string, 2, 2);
					$rgb_str_array[] = substr($color_string, 4, 2);
				}
				$rgb_array = array();
				$rgb_array[] = hexdec($rgb_str_array[0]);
				$rgb_array[] = hexdec($rgb_str_array[1]);
				$rgb_array[] = hexdec($rgb_str_array[2]);
				$rgb_string = implode(',',$rgb_array);
				$rgb_string = ' rgb('.$rgb_string.') ';

				if (isset($option_val['trans'])) {
					$bg_rgba_string = $bg_string;
					$transparency = (int)$option_val['trans'];
					if ($transparency != 0) {
						$trans_dec = $transparency/100;
						$rgba_string = implode(',', $rgb_array);
						$rgba_string = ' rgba('.$rgba_string.','.$trans_dec.') ';
						$bg_rgba_string .= $rgba_string;
					}
				}

				$bg_string .= $rgb_string;
			}
		}
		if (trim($option_val['image']) != '') {
			$bg_string .= " url(".$option_val['image'].") ";
			$bg_string .= $option_val['position']." ".$option_val['repeat'];

			if (trim($bg_rgba_string) != '') {
				$bg_rgba_string .= " url(".$option_val['image'].") ";
				$bg_rgba_string .= $option_val['position']." ".$option_val['repeat'];
			}
		}

		if (trim($bg_string) != '') {
			$bg_string = "background: ".$bg_string.";\n";
			if (trim($bg_rgba_string) != '') {
				$bg_string .= "\tbackground: ".$bg_rgba_string.";\n";
			}
		}
		return $bg_string;
	}

	function get_font_information($option) {
		global $$option;
		$option_val = $$option;
		$option_val = wp_specialchars_decode($option_val, ENT_QUOTES);
		if (!is_array($option_val)) {
			$option_val = stripslashes($option_val);
			$val_array = array();
			$vals = explode(';', $option_val);
			foreach ($vals as $val) {
				$pair = explode('=', $val);
				if (is_array($pair) && count($pair) > 1) {
					$val_array[$pair[0]] = $pair[1];
				}
			}
			$option_val = $val_array;
		}
		//$font_string = "";
		$font_string = "";
		foreach ($option_val as $name => $value) {
			if ($name != "font-face" && $name != "font-size" && $name != "font-size-type" && $name != '' && $name != 'color') {
				$font_string .= $name.":".$value.";";
			}
			else if ($name == "font-size") {
				$font_string .= $name.":".$value.$option_val['font-size-type'].";";
			}
			else if ($name == "font-face") {
				$font_string .= "font-family:".$value.";";
			}
			else if ($name == 'color') {
				if (substr($value, 0, 1) != '#') {
					$value = '#'.$value;
				}
				$font_string .= "color:".$value.";";
			}
		}

		if (trim($font_string) != '') {
			$font_string = stripslashes($font_string);
			$font_string = wp_specialchars_decode($font_string, ENT_QUOTES);
			$font_string = $font_string."\n";
		}
		return $font_string;
	}

	function get_border_information($option) {
		global $$option;
		$option_val = $$option;
		if (!is_array($option_val)) {
			$option_val = stripslashes($option_val);
			$edge_array = array();
			$edges = explode('||', $option_val);
			foreach ($edges as $edge_val) {
				if (trim($edge_val) != '') {
					$edge_options = explode('::', trim($edge_val));
					if (is_array($edge_options) && count($edge_options) > 1) {
						$val_array = array();
						$vals = explode(';', $edge_options[1]);
						foreach ($vals as $val) {
							$pair = explode('=', $val);
							if (is_array($pair) && count($pair) > 1) {
								$val_array[$pair[0]] = $pair[1];
							}
						}
						$edge_array[$edge_options[0]] = $val_array;
					}
				}
			}
			$option_val = $edge_array;
		}
		$border_string = '';
		foreach ($option_val as $edge => $selections) {
			$border_string .= "\tborder-$edge: ";
			if (!isset($selections['style'])) {
				$selections['style'] = 'none';
			}
			if ($selections['style'] == 'none') {
				$border_string .= "none";
			}
			else {
				if (isset($selections['border-width'])) {
					$border_string .= $selections['border-width'];
				}
				if (isset($selections['border-width-type'])) {
					$border_string .= $selections['border-width-type'];
				}
				else {
					$border_string .= "px";
				}
				$border_string .= " ".$selections['style']." ";
				if ($selections['colortype'] == 'transparent') {
					$border_string .= "transparent";
				}
				else {
					if (substr($selections['color'], 0, 1) == '#') {
						$border_string .= $selections['color'];
					}
					else {
						$border_string .= '#'.$selections['color'];
					}
				}
			}
			$border_string .= ";\n";
		}
		return $border_string;
	}

	function get_automatic_widths($cust_wrapper_width, $sidebar_count, $prefix) {
		if ($cust_wrapper_width < 600) {
			$wrapper_width = 600;
		}
		else {
			$wrapper_width = $cust_wrapper_width;
		}
		$computed_widths = array();
		if ($sidebar_count == 0) {
			$computed_widths['main-col'] = floor($wrapper_width);
			$computed_widths['sidebar-1'] = 0;
			$computed_widths['sidebar-2'] = 0;
		}
		else if ($sidebar_count == 1) {
			$computed_widths['main-col'] = floor(0.725 * $wrapper_width);
			$computed_widths['sidebar-1'] = $wrapper_width - $computed_widths['main-col'] - 15;
			$computed_widths['sidebar-2'] = 0;
		}
		else {
			$computed_widths['main-col'] = floor(0.63 * $wrapper_width);
			$computed_widths['sidebar-1'] = floor(0.5 * ($wrapper_width - $computed_widths['main-col'] - 30));
			$computed_widths['sidebar-2'] = floor(0.5 * ($wrapper_width - $computed_widths['main-col'] - 30));
		}

		$widths = $this->get_widths_from_components($computed_widths, $sidebar_count, $prefix);
		return $widths;
	}

	function get_widths_from_components($component_widths, $sidebar_count, $prefix) {
		global $suf_sidebar_alignment, $suf_sidebar_2_alignment, $suf_sbtab_alignment, $suf_mag_headline_image_container_width, $content_width;
		$widths = array();
		$main_col_width = $component_widths['main-col'] < 380 ? 380 : $component_widths['main-col'];
		$sb_1_width = $component_widths['sidebar-1'] < 95 ? 95 : $component_widths['sidebar-1'];
		$sb_2_width = $component_widths['sidebar-2'] < 95 ? 95 : $component_widths['sidebar-2'];
		$widths['main-col'] = $main_col_width;

		if ($sidebar_count == 0) {
			$widths['wrapper'] = $main_col_width;
			$widths = $this->set_widths_for_no_sidebars($widths);
		}
		else if ($sidebar_count == 1) {
			$widths['sidebar-1'] = $sb_1_width;
			$widths['sidebar-2'] = 0;
			$widths['sidebar-container'] = $sb_1_width + 15;
			$widths['tabbed'] = $sb_1_width;
			$widths['wrapper'] = $main_col_width + $sb_1_width + 15;
			if (($suf_sidebar_alignment == 'left' && $prefix != '_1r') || $prefix == '_1l') {
				$widths['s1-lmargin'] = '-100%';
				$widths['s1-rmargin'] = 15;
				$widths['s2-lmargin'] = 0;
				$widths['s2-rmargin'] = 0;
				$widths['s1-l'] = 'auto';
				$widths['s1-r'] = $sb_1_width + 15;
				$widths['s2-l'] = 'auto';
				$widths['s2-r'] = 'auto';
//				$widths['s1-l-ie6'] = floor($sb_1_width/2) + 15;
				$widths['cleft'] = $sb_1_width + 15;
				$widths['cright'] = 0;
				$widths['cleft-ie6'] = $sb_1_width + 15;
				$widths['cright-ie6'] = 0;
			}
			else if (($suf_sidebar_alignment == 'right' && $prefix != '_1l') || $prefix == '_1r') {
				$widths['s1-lmargin'] = 15;
				$widths['s1-rmargin'] = - $sb_1_width - 15;
				$widths['s2-lmargin'] = 0;
				$widths['s2-rmargin'] = 0;
				$widths['s1-l'] = 'auto';
				$widths['s1-r'] =  'auto';
				$widths['s2-l'] = 'auto';
				$widths['s2-r'] = 'auto';
//				$widths['s1-l-ie6'] = 'auto';
//				$widths['s1-r-ie6'] =  $sb_1_width;
				$widths['cleft'] = 0;
				$widths['cright'] = $sb_1_width + 15;
				$widths['cleft-ie6'] = 0;
				$widths['cright-ie6'] = $sb_1_width + 15;
			}
		}
		else if ($sidebar_count == 2) {
			$widths['sidebar-1'] = $sb_1_width;
			$widths['sidebar-2'] = $sb_2_width;

			if (($suf_sidebar_alignment == $suf_sidebar_2_alignment) && $prefix != '_1l1r') {
				$widths['sidebar-container'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 30;
				$widths['tabbed'] = $widths['sidebar-container'] - 17; // -17 because 2px are added by borders of widgets
				if (($suf_sidebar_alignment == 'left' && $prefix != '_2r') || $prefix == '_2l') {
					$widths = $this->set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width);
				}
				else if (($suf_sidebar_alignment == 'right' && $prefix != '_2l') || $prefix == '_2r') {
					$widths = $this->set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width);
				}
			}
			else {
				if (($suf_sidebar_alignment != $suf_sidebar_2_alignment && $prefix != '_2l' && $prefix != '_2r') || $prefix == '_1l1r') {
					if ($suf_sbtab_alignment == $suf_sidebar_alignment) {
						$widths['sidebar-container'] = $widths['sidebar-1'] + 15;
					}
					else {
						$widths['sidebar-container'] = $widths['sidebar-2'] + 15;
					}
					$widths['tabbed'] = $widths['sidebar-container'] - 15;

					if ($suf_sidebar_alignment == 'right') {
						$widths = $this->set_widths_for_single_left_single_right_sidebar_layout($widths, $sb_2_width, $sb_1_width,2, 1);
					}
					else if ($suf_sidebar_alignment == 'left') {
						$widths = $this->set_widths_for_single_left_single_right_sidebar_layout($widths, $sb_1_width, $sb_2_width, 1, 2);
					}
				}
				else {
					$widths['sidebar-container'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 30;
					$widths['tabbed'] = $widths['sidebar-container'] - 17; // -17 because 2px are added by borders of widgets
					if ($prefix == '_2r' || ($prefix != '_2r' && $suf_sidebar_alignment == $suf_sidebar_2_alignment && $suf_sidebar_alignment == 'right')) {
						$widths = $this->set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width);
					}
					else if ($prefix == '_2l' || ($prefix != '_2l' && $suf_sidebar_alignment == $suf_sidebar_2_alignment && $suf_sidebar_alignment == 'left')) {
						$widths = $this->set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width);
					}
				}
			}
			$widths['wrapper'] = $main_col_width + $sb_1_width + $sb_2_width + 30;
		}

		$content_width = $widths['main-col'] - 30; // Account for padding on the sides
		$widths['wsidebar'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 13;
		$widths['category'] = $widths['main-col'] - 275;
		$widths['tags'] = $widths['main-col'] - 275;
		$widths['calendar-side-padding'] = 4;

		$mag_hl_photos = suffusion_admin_get_size_from_field($suf_mag_headline_image_container_width, "250px");
		$widths['mag-headline-photos'] = (int)(substr($mag_hl_photos, 0, strlen($mag_hl_photos) - 2));
		$widths['mag-headline-block'] = '100%';

		return $widths;
	}

	function get_fluid_widths($component_widths, $sidebar_count, $prefix) {
		global $suf_sidebar_alignment, $suf_sidebar_2_alignment, $suf_sbtab_alignment, $suf_mag_headline_image_container_width, $content_width;
		$widths = array();
		$sb_1_width = $component_widths['sidebar-1'] < 95 ? 95 : $component_widths['sidebar-1'];
		$sb_2_width = $component_widths['sidebar-2'] < 95 ? 95 : $component_widths['sidebar-2'];

		$widths['wrapper'] = $component_widths['wrapper'].'%';
		$widths['wrapper-max'] = $component_widths['wrapper-max'];
		$widths['wrapper-min'] = $component_widths['wrapper-min'] < 600 ? 600 : $component_widths['wrapper-min'];
		$widths['main-col'] = '100%';

		if ($sidebar_count == 0) {
			$widths = $this->set_widths_for_no_sidebars($widths);
		}
		else if ($sidebar_count == 1) {
			$widths['sidebar-1'] = $sb_1_width;
			$widths['sidebar-2'] = 0;
			$widths['sidebar-container'] = $sb_1_width + 15;
			$widths['tabbed'] = $sb_1_width;
			if (($suf_sidebar_alignment == 'left' && $prefix != '_1r') || $prefix == '_1l') {
				$widths['s1-lmargin'] = '-100%';
				$widths['s1-rmargin'] = 15;
				$widths['s2-lmargin'] = 0;
				$widths['s2-rmargin'] = 0;
				$widths['s1-l'] = 'auto';
				$widths['s1-r'] = $sb_1_width + 15;
				$widths['s2-l'] = 'auto';
				$widths['s2-r'] = 'auto';
				$widths['cleft'] = $sb_1_width + 15;
				$widths['cright'] = 0;
				$widths['cleft-ie6'] = $sb_1_width + 15;
				$widths['cright-ie6'] = 0;
			}
			else if (($suf_sidebar_alignment == 'right' && $prefix != '_1l') || $prefix == '_1r') {
				$widths['s1-lmargin'] = 15;
				$widths['s1-rmargin'] = - $sb_1_width - 15;
				$widths['s2-lmargin'] = 0;
				$widths['s2-rmargin'] = 0;
				$widths['s1-l'] = 'auto';
				$widths['s1-r'] =  'auto';
				$widths['s2-l'] = 'auto';
				$widths['s2-r'] = 'auto';
//				$widths['s1-l-ie6'] = 'auto';
//				$widths['s1-r-ie6'] =  $sb_1_width;
				$widths['s1-l-ie6'] = 0;
				$widths['cleft'] = 0;
				$widths['cright'] = $sb_1_width + 15;
				$widths['cleft-ie6'] = 0;
				$widths['cright-ie6'] = $sb_1_width + 15;
			}
		}
		else if ($sidebar_count == 2) {
			$widths['sidebar-1'] = $sb_1_width;
			$widths['sidebar-2'] = $sb_2_width;

			if (($suf_sidebar_alignment == $suf_sidebar_2_alignment) && $prefix != '_1l1r') {
				$widths['sidebar-container'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 30;
				$widths['tabbed'] = $widths['sidebar-container'] - 17; // -17 because 2px are added by borders of widgets
				if (($suf_sidebar_alignment == 'left' && $prefix != '_2r') || $prefix == '_2l') {
					$widths = $this->set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width);
				}
				else if (($suf_sidebar_alignment == 'right' && $prefix != '_2l') || $prefix == '_2r') {
					$widths = $this->set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width);
				}
			}
			else {
				if (($suf_sidebar_alignment != $suf_sidebar_2_alignment && $prefix != '_2l' && $prefix != '_2r') || $prefix == '_1l1r') {
					if ($suf_sbtab_alignment == $suf_sidebar_alignment) {
						$widths['sidebar-container'] = $widths['sidebar-1'] + 15;
					}
					else {
						$widths['sidebar-container'] = $widths['sidebar-2'] + 15;
					}
					$widths['tabbed'] = $widths['sidebar-container'] - 15;

					if ($suf_sidebar_alignment == 'right') {
						$widths = $this->set_widths_for_single_left_single_right_sidebar_layout($widths, $sb_2_width, $sb_1_width,2, 1);
					}
					else if ($suf_sidebar_alignment == 'left') {
						$widths = $this->set_widths_for_single_left_single_right_sidebar_layout($widths, $sb_1_width, $sb_2_width, 1, 2);
					}
				}
				else {
					$widths['sidebar-container'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 30;
					$widths['tabbed'] = $widths['sidebar-container'] - 17; // -17 because 2px are added by borders of widgets
					if ($prefix == '_2r' || ($prefix != '_2r' && $suf_sidebar_alignment == $suf_sidebar_2_alignment && $suf_sidebar_alignment == 'right')) {
						$widths = $this->set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width);
					}
					else if ($prefix == '_2l' || ($prefix != '_2l' && $suf_sidebar_alignment == $suf_sidebar_2_alignment && $suf_sidebar_alignment == 'left')) {
						$widths = $this->set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width);
					}
				}
			}
		}

		$content_width = $widths['main-col'] - 30; // Account for padding on the sides
		$widths['wsidebar'] = $widths['sidebar-1'] + $widths['sidebar-2'] + 13;
		$widths['category'] = '60%';
		$widths['tags'] = '60%';
		$widths['calendar-side-padding'] = 4;

		$mag_hl_photos = suffusion_admin_get_size_from_field($suf_mag_headline_image_container_width, "250px");
		$widths['mag-headline-photos'] = (int)(substr($mag_hl_photos, 0, strlen($mag_hl_photos) - 2));
		$widths['mag-headline-block'] = '100%';

		return $widths;
	}

	function get_widths_for_template($prefix, $sb_count, $template = null) {
		$wrapper_width_type_var = 'suf'.$prefix.'_wrapper_width_type';
		$wrapper_width_preset_var = 'suf'.$prefix.'_wrapper_width_preset';
		$wrapper_width_var = 'suf'.$prefix.'_wrapper_width';
		$wrapper_width_flex_var = 'suf'.$prefix.'_wrapper_width_flex';
		$wrapper_width_flex_max_var = 'suf'.$prefix.'_wrapper_width_flex_max';
		$wrapper_width_flex_min_var = 'suf'.$prefix.'_wrapper_width_flex_min';
		$main_col_width_var = 'suf'.$prefix.'_main_col_width';
		$sb_1_width_var = 'suf'.$prefix.'_sb_1_width';
		$sb_2_width_var = 'suf'.$prefix.'_sb_2_width';
		global $$wrapper_width_preset_var, $$wrapper_width_var, $$main_col_width_var, $$sb_1_width_var, $$sb_2_width_var, $suf_sidebar_count, $$wrapper_width_type_var, $$wrapper_width_flex_var, $$wrapper_width_flex_max_var, $$wrapper_width_flex_min_var;

		$wrapper_width_preset = $$wrapper_width_preset_var;
		$wrapper_width = $$wrapper_width_var;
		if (isset($$wrapper_width_flex_var)) $wrapper_width_flex = $$wrapper_width_flex_var;
		if (isset($$wrapper_width_flex_max_var)) $wrapper_width_flex_max = $$wrapper_width_flex_max_var;
		if (isset($$wrapper_width_flex_min_var)) $wrapper_width_flex_min = $$wrapper_width_flex_min_var;
		$main_col_width = $$main_col_width_var;
		if (isset($$sb_1_width_var)) $sb_1_width = $$sb_1_width_var;
		if (isset($$sb_2_width_var)) $sb_2_width = $$sb_2_width_var;
		if ($prefix) {
			$sidebar_count = $sb_count;
		}
		else {
			$sidebar_count = $suf_sidebar_count;
		}
		$wrapper_width_type = isset($$wrapper_width_type_var) ? $$wrapper_width_type_var : 'fixed';

		if ($wrapper_width_type == 'fluid') {
			$sb_1_width = isset($sb_1_width) ? suffusion_admin_get_size_from_field($sb_1_width, "260px", false) : "260px";
			$sb_2_width = isset($sb_2_width) ? suffusion_admin_get_size_from_field($sb_2_width, "260px", false) : "260px";
			$wrapper_width_flex = isset($wrapper_width_flex) ? $wrapper_width_flex : "75";
			$wrapper_width_flex_max = isset($wrapper_width_flex_max) ? suffusion_admin_get_size_from_field($wrapper_width_flex_max, "1200px", false) : "1200px";
			$wrapper_width_flex_min = isset($wrapper_width_flex_min) ? suffusion_admin_get_size_from_field($wrapper_width_flex_min, "600px", false) : "600px";
			$component_widths = array('wrapper' => $wrapper_width_flex,
				'wrapper-max' => (int)(substr($wrapper_width_flex_max, 0, strlen($wrapper_width_flex_max) - 2)),
				'wrapper-min' => (int)(substr($wrapper_width_flex_min, 0, strlen($wrapper_width_flex_min) - 2)),
				'sidebar-1' => (int)(substr($sb_1_width, 0, strlen($sb_1_width) - 2)),
				'sidebar-2' => (int)(substr($sb_2_width, 0, strlen($sb_2_width) - 2)));
			$widths = $this->get_fluid_widths($component_widths, $sidebar_count, $prefix);
		}
		else { // Fixed width
			if (($wrapper_width_preset != "custom") && ($wrapper_width_preset != "custom-components")) {
				$widths = $this->get_automatic_widths($wrapper_width_preset, $sidebar_count, $prefix);
			}
			else if ($wrapper_width_preset == "custom") {
				$wrapper_width = suffusion_admin_get_size_from_field($wrapper_width, "1000px");
				$widths = $this->get_automatic_widths((int)(substr($wrapper_width, 0, strlen($wrapper_width) - 2)), $sidebar_count, $prefix);
			}
			else {
				$main_col_width = suffusion_admin_get_size_from_field($main_col_width, "725px");
				$sb_1_width = isset($sb_1_width) ? suffusion_admin_get_size_from_field($sb_1_width, "260px") : "260px";
				$sb_2_width = isset($sb_2_width) ? suffusion_admin_get_size_from_field($sb_2_width, "260px") : "260px";
				$component_widths = array('main-col' => (int)(substr($main_col_width, 0, strlen($main_col_width) - 2)),
					'sidebar-1' => (int)(substr($sb_1_width, 0, strlen($sb_1_width) - 2)),
					'sidebar-2' => (int)(substr($sb_2_width, 0, strlen($sb_2_width) - 2)));
				$widths = $this->get_widths_from_components($component_widths, $sidebar_count, $prefix);
			}
		}
		return apply_filters('suffusion_set_template_widths', $widths, $template);
	}

	function set_widths_for_no_sidebars($widths) {
		if (!is_array($widths)) $widths = array();
		$widths['sidebar-1'] = 0;
		$widths['sidebar-2'] = 0;
		$widths['sidebar-container'] = 0;
		$widths['tabbed'] = 0;
		$widths['s1-lmargin'] = 0;
		$widths['s1-rmargin'] = 0;
		$widths['s2-lmargin'] = 0;
		$widths['s2-rmargin'] = 0;
		$widths['s1-l'] = 'auto';
		$widths['s1-r'] = 'auto';
		$widths['s2-l'] = 'auto';
		$widths['s2-r'] = 'auto';
		$widths['cleft'] = 0;
		$widths['cright'] = 0;
		return $widths;
	}

	function set_widths_for_double_left_sidebar_layout($widths, $sb_1_width, $sb_2_width) {
		if (!is_array($widths)) $widths = array();
		$widths['s1-lmargin'] = 0;
		$widths['s1-rmargin'] = 0;
		$widths['s2-lmargin'] = 15;
		$widths['s2-rmargin'] = - $sb_2_width - 15;
		$widths['s1-l'] = 'auto';
		$widths['s1-r'] = 'auto';
		$widths['s2-l'] = 'auto';
		$widths['s2-r'] = 'auto';
		$widths['sw-l'] = 'auto';
		$widths['sw-r'] = $sb_1_width + $sb_2_width + 30;
		$widths['sw-l-ie6'] = 'auto';
		$widths['sw-r-ie6'] = floor(($sb_1_width + $sb_2_width)/2) + 30;
		$widths['cleft'] = $sb_1_width + $sb_2_width + 30;
		$widths['cright'] = 0;
		return $widths;
	}

	function set_widths_for_double_right_sidebar_layout($widths, $sb_1_width, $sb_2_width) {
		if (!is_array($widths)) $widths = array();
		$widths['s1-lmargin'] = 0;
		$widths['s1-rmargin'] = 0;
		$widths['s2-lmargin'] = - $sb_2_width - 15;
		$widths['s2-rmargin'] = 15;
		$widths['s1-l'] = 'auto';
		$widths['s1-r'] = 'auto';
		$widths['s2-l'] = 'auto';
		$widths['s2-r'] = 'auto';
		$widths['cleft'] = 0;
		$widths['cright'] = $sb_1_width + $sb_2_width + 30;
		return $widths;
	}

	function set_widths_for_single_left_single_right_sidebar_layout($widths, $lwidth, $rwidth, $left, $right) {
		if (!is_array($widths)) $widths = array();
		$l = 's'.$left;
		$r = 's'.$right;

		$widths["$l-lmargin"] = '-100%';
		$widths["$l-rmargin"] = 0;
		$widths["$r-lmargin"] = 15;
		$widths["$r-rmargin"] = - $rwidth - 15;
		$widths["$l-l"] = 'auto';
		$widths["$l-r"] = $lwidth + 15;
		$widths["$r-l"] = 'auto';
		$widths["$r-r"] = 'auto';
		$widths["$l-l-ie6"] = floor(($lwidth + $rwidth)/2) + 30;
		$widths["$l-r-ie6"] = $lwidth + 15;
		$widths['cleft'] = $lwidth + 15;
		$widths['cright'] = $rwidth + 15;
		return $widths;
	}
}
