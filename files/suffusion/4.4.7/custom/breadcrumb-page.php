<?php
/**
 * Shows the breadcrumb for anything for pages based on the following algorithm:
 *	- It can print a full hierarchy of ancestors, siblings and immediate children, if the breadcrumb is set to display everything.
 * 	- It can print a regular breadcrumb if set appropriately.
 * A home link/icon is optionally shown.
 *
 * @since 3.8.3
 * @package Suffusion
 * @subpackage Custom
 */

global $post, $suf_nav_breadcrumb, $suf_nav_exclude_in_breadcrumb, $suf_breadcrumb_separator, $suf_show_home_in;
$toggle = suffusion_get_post_meta($post->ID, 'suf_toggle_breadcrumb');
if ($suf_nav_breadcrumb == "none" && !$toggle) {
	return;
}
else if ($suf_nav_breadcrumb != "none" && $toggle) {
	return;
}

if (!is_front_page() && !is_home() && is_page()) {
	$ancestors = get_ancestors($post->ID, 'page');
	$num_ancestors = count($ancestors);
	if ($suf_nav_breadcrumb == "all") {
		$display = apply_filters('suffusion_can_display_hierarchical_navigation', true);
		if (!$display) {
			return;
		}

		$exclusion_list = suffusion_get_excluded_pages("suf_nav_pages");
		for ($anc_index = 1; $num_ancestors - $anc_index >= 0; $anc_index++) {
			$style = ($anc_index == 1) ? "subnav" : "l".($anc_index + 1)."nav";
			$class = ($anc_index == 1) ? "" : "hier-nav";
?>
	<div id="<?php echo $style;?>" class="<?php echo $class; ?> fix">
		<ul>
			<?php suffusion_get_siblings_in_nav($ancestors, $num_ancestors - $anc_index, $exclusion_list, $suf_nav_exclude_in_breadcrumb); ?>
		</ul>
	</div><?php echo "<!-- /".$style."-->"; ?>
<?php
		}
		$exclusion_query = $suf_nav_exclude_in_breadcrumb == "hide" ? "&exclude_tree=".$exclusion_list : "";
		$style = ($num_ancestors == 0) ? "subnav" : "l".($num_ancestors + 2)."nav";
		$class = ($num_ancestors == 0) ? "" : "hier-nav";
		$children = wp_list_pages("title_li=&child_of=".$post->ID."&echo=0".$exclusion_query);
		if ($children) {
	?>
	<div id="<?php echo $style;?>" class="<?php echo $class; ?> fix">
		<ul>
			<?php echo $children; ?>
		</ul>
	</div><!-- /sub nav -->
<?php
		}
	}
	else {
		$display = apply_filters('suffusion_can_display_breadcrumb_navigation', true);
		if (!$display) {
			return;
		}

		$show_home = explode(',', $suf_show_home_in);
		if ($num_ancestors > 0 || in_array('page', $show_home)) {
	?>
	<div id="subnav" class="fix">
		<div class="breadcrumb">
	<?php
			if (in_array('page', $show_home)) {
				echo "<a href='".home_url()."'>".__('Home', 'suffusion')."</a> ".$suf_breadcrumb_separator." ";
			}
			for ($i = $num_ancestors-1; $i>=0; $i--) {
				$anc_page = get_page($ancestors[$i]);
				echo "<a href='".get_permalink($ancestors[$i])."'>".$anc_page->post_title."</a> ".$suf_breadcrumb_separator." ";
			}
			echo get_the_title();
	?>
		</div>
	</div><!-- /sub nav -->
	<?php
		}
	}
}
?>