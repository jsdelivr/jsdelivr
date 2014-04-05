<?php
global $sidebar_2_alignment, $suf_sidebar_alignment, $suf_sidebar_2_alignment, $suf_wa_sb2_style;

if (is_page_template('1l-sidebar.php') || is_page_template('2l-sidebars.php') || (is_page_template('1l1r-sidebar.php') && $suf_sidebar_alignment == 'right')) {
	$sidebar_2_alignment = 'left';
}
else if (is_page_template('1r-sidebar.php') || is_page_template('2r-sidebars.php') || is_page_template('1l1r-sidebar.php') || (is_page_template('1l1r-sidebar.php') && $suf_sidebar_alignment == 'left')) {
	$sidebar_2_alignment = 'right';
}
else if ($suf_sidebar_2_alignment == 'left') {
	$sidebar_2_alignment = 'left';
}
else if ($suf_sidebar_2_alignment == 'right') {
	$sidebar_2_alignment = 'right';
}

if ($suf_wa_sb2_style != 'tabbed') {
?>
<div class="dbx-group <?php echo $sidebar_2_alignment;?> <?php echo $suf_wa_sb2_style;?> warea" id="sidebar-2">
<?php
}
else {
?>
<div class="tabbed-sidebar tab-box-<?php echo $sidebar_2_alignment;?>  <?php echo $sidebar_2_alignment;?> warea fix" id="sidebar-2">
	<ul class="sidebar-tabs">
<?php
}
?>

  <?php dynamic_sidebar(2); ?>

<?php
if ($suf_wa_sb2_style != 'tabbed') {
?>
</div><!--/sidebar-2 -->
<?php
}
else {
?>
	</ul>
</div><!--/sidebar-2 -->
<?php
}
?>
